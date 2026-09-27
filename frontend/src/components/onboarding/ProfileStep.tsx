import { useState } from "react";
import PropTypes from "prop-types";
import OBShell from "./OBShell";
import ArrowIcon from "../ArrowIcon";
import { API_BASE_URL } from "../../lib/api";
import { useAuthStore } from "../../context/AuthContext";

const MAX_ONE_LINER = 120;

const SKILL_OPTIONS = [
  "Social media management",
  "Content creation",
  "Graphic design",
  "Video editing",
  "Copywriting",
  "Web development",
  "Paid ads",
  "Project management",
];

interface ProfileStepProps {
  role: string | null;
  accessToken: string | null;
  onNext: () => void;
  onBack: () => void;
}

export default function ProfileStep({
  role,
  accessToken,
  onNext,
  onBack,
}: ProfileStepProps) {
  const { user, updateUser } = useAuthStore();

  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [oneLiner, setOneLiner] = useState(user?.one_liner ?? "");
  const [primarySkill, setPrimarySkill] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isWorker = role !== "customer";
  const isValid = fullName.trim().length > 1 && primarySkill.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    const payload = {
      full_name: fullName.trim(),
      one_liner: oneLiner.trim() || null,
      primary_skill: primarySkill.trim(),
      phone: phone.trim() || null,
      is_onboarded: true,
    };

    try {
      if (accessToken) {
        const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          setError("We couldn't save your profile. Please try again.");
          return;
        }
      }

      updateUser({
        full_name: payload.full_name,
        one_liner: payload.one_liner ?? undefined,
        phone: payload.phone ?? undefined,
        onboarding_completed: true,
      });

      onNext();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OBShell onBack={onBack} hideAuthSwitch>
      <h1 className="ob2-title">
        {isWorker ? "Tell people what you do" : "Set up your profile"}
      </h1>
      <p className="ob2-subtitle">
        {isWorker
          ? "This is the first thing clients see when we match you to a project."
          : "A few details help us match you with the right people."}
      </p>

      <form className="ob2-form" onSubmit={handleSubmit} noValidate>
        <div className="ob2-field">
          <label className="ob2-label" htmlFor="ob2-full-name">
            Full name
          </label>
          <input
            id="ob2-full-name"
            className="ob2-input"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Sarah Aduloju"
            autoComplete="name"
          />
        </div>

        {isWorker && (
          <div className="ob2-field">
            <div className="ob2-label-row">
              <label className="ob2-label" htmlFor="ob2-one-liner">
                One-liner
              </label>
              <span className="ob2-char-counter">
                {oneLiner.length}/{MAX_ONE_LINER}
              </span>
            </div>
            <textarea
              id="ob2-one-liner"
              className="ob2-textarea"
              rows={3}
              maxLength={MAX_ONE_LINER}
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
              placeholder="Social media manager helping brands sound like themselves."
            />
            <p className="ob2-field-helper">
              Keep it to one sentence. It shows on your profile card.
            </p>
          </div>
        )}

        {isWorker && (
          <div className="ob2-field">
            <label className="ob2-label" htmlFor="ob2-primary-skill">
              Main skill
            </label>
            <div className="ob2-select-wrapper">
              <select
                id="ob2-primary-skill"
                className="ob2-select"
                value={primarySkill}
                onChange={(e) => setPrimarySkill(e.target.value)}
              >
                <option value="">Select your main skill</option>
                {SKILL_OPTIONS.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <span className="ob2-select-arrow" aria-hidden="true" />
            </div>
          </div>
        )}

        {!isWorker && (
          <div className="ob2-field">
            <label className="ob2-label" htmlFor="ob2-phone">
              Phone number
            </label>
            <input
              id="ob2-phone"
              className="ob2-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="080... or +234..."
              autoComplete="tel"
            />
            <p className="ob2-field-helper">
              Only used for project updates. Never shared publicly.
            </p>
          </div>
        )}

        {error && <p className="ob2-error">{error}</p>}

        <button
          type="submit"
          className="ob2-cta-btn"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Continue"}
          <ArrowIcon size={16} />
        </button>
      </form>
    </OBShell>
  );
}

ProfileStep.propTypes = {
  role: PropTypes.string,
  accessToken: PropTypes.string,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
