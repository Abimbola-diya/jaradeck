import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase01Icon, UserAccountIcon } from "hugeicons-react";
import ArrowLeft02Icon from "./ArrowLeft02Icon";
import ArrowIcon from "./ArrowIcon";
import BrandLogo from "./BrandLogo";
import confettiImage from "../assets/coffette.svg";
import successTickImage from "../assets/success tick.svg";
import ProfileStep from "./onboarding/ProfileStep";
import { API_BASE_URL } from "../lib/api";
import { useAuthStore } from "../context/AuthContext";

type OnboardingStep = "role" | "profile" | "done";

interface RoleSelectionStepProps {
  onSelect: (role: string) => void;
  onNavigateHome: () => void;
}

// ─── Role Selection ───────────────────────────────────────────────────────────
function RoleSelectionStep({
  onSelect,
  onNavigateHome,
}: RoleSelectionStepProps) {
  const [selectedRole, setSelectedRole] = useState<"customer" | "worker">(
    "customer",
  );

  return (
    <div className="ob2-page">
      {onNavigateHome && (
        <button
          type="button"
          className="ob2-back-btn ob2-anim-back"
          onClick={onNavigateHome}
          aria-label="Go back home"
        >
          <ArrowLeft02Icon size={20} />
        </button>
      )}

      <div className="ob2-role-container">
        <div className="ob2-role-top-section">
          <div className="ob2-role-header-group">
            <div className="ob2-role-logo ob2-anim-logo">
              <BrandLogo width={34} height={25} tone="blue" />
            </div>
            <div className="ob2-role-title-group ob2-anim-header">
              <h1 className="ob2-role-title">How can we help you?</h1>
              <p className="ob2-role-subtitle">
                Choose how you would like to use Jaradeck
              </p>
            </div>
          </div>

          <div className="ob2-role-card-group">
            <button
              type="button"
              className={`ob2-role-custom-card ob2-anim-card-1 ${
                selectedRole === "customer"
                  ? "ob2-role-custom-card-selected"
                  : ""
              }`}
              onClick={() => setSelectedRole("customer")}
            >
              <div className="ob2-role-card-icon">
                <Briefcase01Icon size={26} />
              </div>
              <div className="ob2-role-card-content">
                <div className="ob2-role-card-title">I need work done.</div>
                <div className="ob2-role-card-desc">
                  Hand off your projects and get finished results without the
                  hiring hassle.
                </div>
              </div>
            </button>

            <button
              type="button"
              className={`ob2-role-custom-card ob2-anim-card-2 ${
                selectedRole === "worker" ? "ob2-role-custom-card-selected" : ""
              }`}
              onClick={() => setSelectedRole("worker")}
            >
              <div className="ob2-role-card-icon">
                <UserAccountIcon size={26} />
              </div>
              <div className="ob2-role-card-content">
                <div className="ob2-role-card-title">I want to do work</div>
                <div className="ob2-role-card-desc">
                  Get matched directly with active projects and earn on your
                  terms.
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="ob2-role-footer ob2-anim-footer">
          <button
            type="button"
            className="ob2-role-submit-btn"
            disabled={!selectedRole}
            onClick={() => onSelect(selectedRole)}
          >
            Continue <ArrowIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Success ──────────────────────────────────────────────────────────────────
function SuccessStep({
  onNavigateDashboard,
}: {
  onNavigateDashboard: () => void;
}) {
  return (
    <div className="ob2-page ob2-page-success">
      <img
        src={confettiImage}
        className="ob2-confetti-img"
        alt=""
        aria-hidden="true"
      />
      <div className="ob2-success-content">
        <img
          src={successTickImage}
          className="ob2-success-badge-img"
          alt="Onboarding complete"
        />
        <h1 className="ob2-success-title">You&apos;re all set!</h1>
        <p className="ob2-success-copy">
          Keep an eye on your dashboard
          <br />
          we&apos;ll match you as soon as work comes in.
        </p>
        <button
          className="ob2-cta-btn ob2-dashboard-cta"
          onClick={onNavigateDashboard}
        >
          Continue to Dashboard <ArrowIcon size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const navigate = useNavigate();
  const { token, user, updateUser } = useAuthStore();

  const [step, setStep] = useState<OnboardingStep>(() => {
    return user?.role ? "profile" : "role";
  });
  const [role, setRole] = useState<string | null>(user?.role || null);

  useEffect(() => {
    if (!window.history.state?.onboardingStep) {
      window.history.replaceState(
        { ...window.history.state, onboardingStep: step },
        "",
      );
    }
    const handlePop = (e: PopStateEvent) => {
      if (e.state?.onboardingStep) setStep(e.state.onboardingStep);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const goToStep = (newStep: OnboardingStep) => {
    if (window.history.state?.onboardingStep !== newStep) {
      window.history.pushState({ onboardingStep: newStep }, "");
    }
    setStep(newStep);
  };

  const handleRoleSelect = async (selected: string) => {
    setRole(selected);
    updateUser({ role: selected });

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/set-role`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: selected }),
        });
      } catch (e) {
        console.warn("[OB] set-role sync failed:", e);
      }
    }
    goToStep("profile");
  };

  const handleNavigateHome = () => navigate("/");
  const handleNavigateDashboard = () => {
    const targetRole = role || user?.role || "customer";
    navigate(`/dashboard/${targetRole}`);
  };

  return (
    <>
      {step === "role" && (
        <RoleSelectionStep
          onSelect={handleRoleSelect}
          onNavigateHome={handleNavigateHome}
        />
      )}

      {step === "profile" && (
        <ProfileStep
          role={role}
          accessToken={token}
          onNext={() => goToStep("done")}
          onBack={() => goToStep("role")}
        />
      )}

      {step === "done" && (
        <SuccessStep onNavigateDashboard={handleNavigateDashboard} />
      )}
    </>
  );
}
