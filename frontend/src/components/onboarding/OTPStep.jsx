import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import OBShell from "./OBShell";
import ArrowRight02Icon from "../ArrowRight02Icon";
import { API_BASE_URL } from "../../lib/api";

const RESEND_COOLDOWN_SECONDS = 60;

function formatErrorMessage(
  detail,
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

function maskEmail(email) {
  if (!email) return "";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export default function OTPStep({ email, onVerified, onSignIn, onBack }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendStatus, setResendStatus] = useState(""); // '' | 'sending' | 'sent' | 'error'
  const inputRefs = useRef([]);

  // Auto-focus first input & lock body scroll on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    const origHtmlHeight = document.documentElement.style.height;
    const origBodyHeight = document.body.style.height;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";
    document.body.style.height = "100vh";

    return () => {
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.overflow = origBodyOverflow;
      document.documentElement.style.height = origHtmlHeight;
      document.body.style.height = origBodyHeight;
    };
  }, []);

  // Dispatch initial email OTP on component mount if needed
  useEffect(() => {
    let isMounted = true;
    const sendInitialOTP = async () => {
      if (!email) return;
      try {
        await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch {
        if (isMounted)
          setError("Failed to send OTP email. Please click resend.");
      }
    };

    sendInitialOTP();
    return () => {
      isMounted = false;
    };
  }, [email]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    setError("");
    if (val && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (digits.some((d) => !d)) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    const code = digits.join("");
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      console.log(data)

      if (!res.ok) {
        setError(
          formatErrorMessage(
            data.detail,
            "Verification failed. Please check your code and try again.",
          ),
        );
        if (res.status === 400) {
          setDigits(Array(6).fill(""));
          inputRefs.current[0]?.focus();
        }
        return;
      }

      // Persist auth data
      localStorage.setItem("jaradeck_token", data.access_token);
      localStorage.setItem("jaradeck_user", JSON.stringify(data.user));

      if (onVerified) onVerified(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resendStatus === "sending") return;
    setResendStatus("sending");
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResendStatus("error");
        setError(
          formatErrorMessage(
            data.detail,
            "Failed to resend code. Please try again.",
          ),
        );
        return;
      }

      setResendStatus("sent");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();

      setTimeout(() => setResendStatus(""), 3000);
    } catch {
      setResendStatus("error");
      setError("Network error. Please try again.");
    }
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <OBShell
      isSignIn={false}
      onAuthSwitch={onSignIn}
      onBack={onBack}
      hideBack={true}
      align="center"
    >
      <div className="ob2-otp-container">
        <h1 className="ob2-title ob2-otp-title text-center">
          Verify your email
        </h1>
        <p className="ob2-subtitle ob2-otp-subtitle text-center">
          We&apos;ve sent a 6-digit verification code to your email address
          {email ? ` (${maskEmail(email)})` : ""}. Enter it below to verify your
          account.
        </p>

        <form
          className="ob2-form ob2-otp-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="ob2-otp-row justify-center" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                id={`otp-digit-${i + 1}`}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={1}
                className={`ob2-otp-box${d ? " ob2-otp-box--filled" : ""}${error ? " ob2-otp-box--error" : ""}`}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`Digit ${i + 1} of 6`}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <p className="ob2-error text-center" role="alert">
              {error}
            </p>
          )}

          <p className="ob2-resend-text text-center">
            {resendStatus === "sent" ? (
              <span style={{ color: "#16a34a", fontWeight: 500 }}>
                ✓ New code sent to your email!
              </span>
            ) : (
              <>
                Didn&apos;t receive a code?{" "}
                {resendCooldown > 0 ? (
                  <span className="ob2-resend-countdown">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    className="ob2-link-btn"
                    onClick={handleResend}
                    disabled={resendStatus === "sending"}
                  >
                    {resendStatus === "sending" ? "Sending…" : "Resend code"}
                  </button>
                )}
              </>
            )}
          </p>

          <button
            type="submit"
            className="ob2-cta-btn ob2-otp-cta-btn"
            style={{ marginTop: "40px" }}
            disabled={!isComplete || isLoading}
          >
            {isLoading ? (
              "Verifying…"
            ) : (
              <>
                Continue to Jaradeck <ArrowRight02Icon size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </OBShell>
  );
}

OTPStep.propTypes = {
  email: PropTypes.string.isRequired,
  onVerified: PropTypes.func.isRequired,
  onSignIn: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};
