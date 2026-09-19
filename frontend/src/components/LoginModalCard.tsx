import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "motion/react";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import BrandLogo from "./BrandLogo";
import CrownIcon from "./CrownIcon";
import { Cancel01Icon } from "./ui/cancel-01";
import ArrowRight02Icon from "./ArrowRight02Icon";

import { API_BASE_URL } from "../lib/api";

function decodeJwt(token : string | undefined) {
  try {
    if (!token) return null;
    const base64 = token?.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function formatErrorMessage(
  detail : any,
  fallback = "An unexpected error occurred. Please try again.",
) {
  if (!detail) return fallback;
  if (typeof detail === "string") {
    if (
      detail.startsWith("{") ||
      detail.includes("Database error") ||
      detail.includes("Failing row contains") ||
      detail.includes("violates")
    ) {
      return fallback;
    }
    return detail;
  }
  if (typeof detail === "object") {
    if (typeof detail.message === "string") return detail.message;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  }
  return fallback;
}

interface LoginModalCardProps {
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onGoogleSuccess?: (data: any) => void;
  onOTPRequired?: (email: string) => void;
  triggerOrigin?: { x: number; y: number } | null | undefined;
}

interface GoogleHint {
  name: string;
  email: string;
  picture: string | null;
  fromBackend: boolean;
  backendUser?: any;
  credential?: string;
}

export default function LoginModalCard({
  onClose,
  onSwitchToSignUp,
  onGoogleSuccess,
  onOTPRequired,
  triggerOrigin,
}: LoginModalCardProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

const [googleHint, setGoogleHint] = useState<GoogleHint | null>(() => {
  try {
    const raw = localStorage.getItem("jaradeck_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.id || parsed?.auth_provider !== "google") {
      localStorage.removeItem("jaradeck_user");
      return null;
    }
    return {
      name: parsed.full_name || parsed.name || "",
      email: parsed.email || "",
      picture: parsed.picture || parsed.avatar_url || null,
      fromBackend: true,
      backendUser: parsed,
    };
  } catch {
    return null;
  }
});

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      if (!credentialResponse.credential) return; // Guard clause
      
      const payload = decodeJwt(credentialResponse.credential);
      if (payload && !googleHint?.fromBackend) {
        setGoogleHint({
          name: payload.name || "",
          email: payload.email || "",
          picture: payload.picture || null,
          fromBackend: false,
          credential: credentialResponse.credential,
        });
      }
    },
    onError: () => {},
    cancel_on_tap_outside: true,
    disabled: Boolean(googleHint?.fromBackend),
  });

  const hasSavedUser = Boolean(
    googleHint && (googleHint.name || googleHint.email),
  );
  const displayName = googleHint?.name || "";
  const hintFirstName = displayName ? displayName.split(" ")[0] : "";
  const displayEmail = googleHint?.email || "";
  const rawPicture = googleHint?.picture || null;
  const displayPicture =
    rawPicture && rawPicture.startsWith("https://") ? rawPicture : null;

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= 640,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const authenticateWithBackend = async ({
    access_token,
    credential,
  }: {
    access_token?: string;
    credential?: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token, credential, role: "customer" }),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        data.detail || "Google Sign-In failed. Please try again.",
      );
    return data;
  };

  const finalizeGoogleAuth = (data: any) => {
    localStorage.setItem("jaradeck_token", data.access_token);
    localStorage.setItem("jaradeck_user", JSON.stringify(data.user));
    setGoogleHint({
      name: data.user.full_name || data.user.name || "",
      email: data.user.email || "",
      picture: data.user.picture || data.user.avatar_url || null,
      fromBackend: true,
      backendUser: data.user,
    });
    if (onGoogleSuccess) onGoogleSuccess(data);
  };

  const googleLogin = useGoogleLogin({
    prompt: "select_account",
    hint: googleHint?.email || undefined,
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setError("");
      try {
        const data = await authenticateWithBackend({
          access_token: tokenResponse.access_token,
        });
        finalizeGoogleAuth(data);
      } catch (err: any) {
        setError(
          err.message || "Network error connecting to authentication server.",
        );
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => setError("Google Sign-In was cancelled or failed."),
  });

  const handleGoogleButtonClick = async () => {
    if (googleHint && !googleHint.fromBackend && googleHint.credential) {
      setIsGoogleLoading(true);
      setError("");
      try {
        const data = await authenticateWithBackend({
          credential: googleHint.credential,
        });
        finalizeGoogleAuth(data);
      } catch (err: any) {
        setError(
          err.message || "Network error connecting to authentication server.",
        );
      } finally {
        setIsGoogleLoading(false);
      }
      return;
    }
    googleLogin();
  };

  const transformOrigin = (() => {
    if (!triggerOrigin) return "85% 20px";
    const modalWidth = Math.min(530, window.innerWidth - 32);
    const modalHeight = 560;
    const modalLeft = (window.innerWidth - modalWidth) / 2;
    const modalTop = Math.max(20, (window.innerHeight - modalHeight) / 2);
    const originX = triggerOrigin.x - modalLeft;
    const originY = triggerOrigin.y - modalTop;
    return `${originX}px ${originY}px`;
  })();

  const handleClose = () => {
    setIsClosing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setError(
          formatErrorMessage(
            data.detail,
            "Could not send code. Please try again.",
          ),
        );
        return;
      }

      if (onOTPRequired) {
        onOTPRequired(email.trim().toLowerCase());
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Boolean(email.trim());

  return (
    <motion.div
      className="jd-signup-modal-overlay"
      onClick={handleClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (isClosing) onClose();
      }}
      style={{ willChange: "opacity" }}
    >
      <motion.div
        className="jd-signup-modal-card"
        style={{
          transformOrigin: isMobile ? "50% 50%" : transformOrigin,
          willChange: "transform, opacity",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        initial={
          isMobile ? { opacity: 0, scale: 0.97 } : { opacity: 0, scale: 0.15 }
        }
        animate={{
          opacity: isClosing ? 0 : 1,
          scale: isClosing ? (isMobile ? 0.97 : 0.15) : 1,
        }}
        transition={
          isMobile
            ? { duration: 0.18, ease: "easeOut" }
            : isClosing
              ? { duration: 0.16, ease: [0.4, 0, 1, 1] }
              : {
                  type: "spring",
                  stiffness: 380,
                  damping: 26,
                  mass: 0.5,
                }
        }
      >
        <button
          type="button"
          className="jd-signup-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <Cancel01Icon size={20} />
        </button>

        <div className="jd-signup-header-container">
          <div className="jd-signup-logo-wrapper">
            <BrandLogo width={36} tone="blue" />
          </div>
          <h2 id="login-modal-title" className="jd-signup-title">
            <span className="jd-title-w-anchor">
              W
              <CrownIcon
                width={50}
                height={50}
                color="#0048B3"
                className="jd-signup-title-crown-inline"
              />
            </span>
            elcome back!
          </h2>
          <p className="jd-signup-subtitle">
            Good to see you again. We&apos;ll send a code to your email.
          </p>
        </div>

        {hasSavedUser ? (
          <button
            type="button"
            className="jd-google-dribbble-btn"
            onClick={handleGoogleButtonClick}
            disabled={isGoogleLoading}
          >
            <div className="jd-google-btn-avatar">
              {displayPicture ? (
                <img
                  src={displayPicture}
                  alt={displayName}
                  className="jd-google-avatar-img"
                />
              ) : (
                <div className="jd-google-avatar-placeholder">
                  {hintFirstName ? hintFirstName.charAt(0).toUpperCase() : "G"}
                </div>
              )}
            </div>
            <div className="jd-google-btn-info">
              <span className="jd-google-btn-title">
                {isGoogleLoading
                  ? "Signing in..."
                  : `Continue as ${hintFirstName || "User"}`}
              </span>
              {displayEmail && (
                <div className="jd-google-btn-email-row">
                  <span className="jd-google-btn-email">{displayEmail}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="jd-google-chevron"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              )}
            </div>
            <div className="jd-google-btn-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
            </div>
          </button>
        ) : (
          <button
            type="button"
            className="jd-google-blue-btn"
            onClick={handleGoogleButtonClick}
            disabled={isGoogleLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>
              {isGoogleLoading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>
        )}

        <div className="jd-signup-divider">
          <span className="jd-signup-divider-line"></span>
          <span className="jd-signup-divider-text">
            {isMobile ? "or" : "or sign in below"}
          </span>
          <span className="jd-signup-divider-line"></span>
        </div>

        <form className="jd-signup-form" onSubmit={handleSubmit} noValidate>
          <div className="jd-signup-field">
            {isMobile && (
              <label className="jd-signup-label">Email Address</label>
            )}
            <input
              type="email"
              className="jd-signup-input"
              placeholder="mrlagbajatamedo@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
              required
            />
          </div>

          {error && <div className="jd-signup-error-msg">{error}</div>}

          <button
            type="submit"
            className="jd-signup-continue-btn"
            disabled={!isFormValid || isSubmitting}
          >
            <span>{isSubmitting ? "Sending code…" : "Log in"}</span>
            {!isSubmitting && <ArrowRight02Icon size={18} />}
          </button>
        </form>

        <div className="jd-signup-footer">
          New to Jaradeck?{" "}
          <button
            type="button"
            className="jd-signup-login-link"
            onClick={onSwitchToSignUp}
          >
            Sign up
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

LoginModalCard.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSwitchToSignUp: PropTypes.func.isRequired,
  onGoogleSuccess: PropTypes.func,
  onOTPRequired: PropTypes.func.isRequired,
  triggerOrigin: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};
