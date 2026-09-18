import React, { useState, useRef, useEffect } from "react";
import { BottomSheetModal } from "../components/ui/BottomSheetModal";
import { ArrowLeft02Icon, ArrowDown01Icon, Edit02Icon } from "hugeicons-react";
import { useAuthStore } from "../context/AuthContext";
import profileSuccessBadgeImg from "../assets/profile_success_badge.png";
import profileAvatarImg from "../assets/profile_avatar_user.png";
import { useNavigate } from "react-router-dom";

export const ProfilePortfolioScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, token } = useAuthStore() as any;

  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [primarySkill, setPrimarySkill] = useState<string>("");
  const [portfolioLink, setPortfolioLink] = useState<string>("");

  const [isSkillDropdownOpen, setIsSkillDropdownOpen] =
    useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Sync state with logged-in user profile[cite: 25]
  useEffect(() => {
    if (user) {
      setName(user.full_name || "");
      setAbout(user.one_liner || "");
      setPrimarySkill((user as any).primary_skill || "");
      setPortfolioLink((user as any).portfolio_url || "");
    }
  }, [user]);

  // Determine if any field has changed from current user data
  const isFormDirty = Boolean(
    name.trim() !== (user?.full_name || "") ||
    about.trim() !== (user?.one_liner || "") ||
    primarySkill !== ((user as any)?.primary_skill || "") ||
    portfolioLink.trim() !== ((user as any)?.portfolio_url || ""),
  );

  const handleUpdateProfile = async () => {
    if (!isFormDirty || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    // Build payload with only updated fields
    const payload: Record<string, string> = {};
    if (name.trim() !== (user?.full_name || ""))
      payload.full_name = name.trim();
    if (about.trim() !== (user?.one_liner || ""))
      payload.one_liner = about.trim();
    if (primarySkill !== ((user as any)?.primary_skill || ""))
      payload.primary_skill = primarySkill;
    if (portfolioLink.trim() !== ((user as any)?.portfolio_url || ""))
      payload.portfolio_url = portfolioLink.trim();

    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorDetail = "Failed to update profile.";
        try {
          const errorJson = JSON.parse(errorText);
          errorDetail = errorJson.detail || errorDetail;
        } catch {
          errorDetail = errorText || errorDetail;
        }
        throw new Error(errorDetail);
      }

      const responseText = await response.text();
      const updatedUserData = responseText
        ? JSON.parse(responseText)
        : { ...user, ...payload };

      updateUser(updatedUserData);
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Profile update error:", err);
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillsList = [
    "Product Design",
    "Software Development",
    "Content Creation",
    "UI/UX Design",
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Mobile App Development",
    "Product Management",
    "Brand & Visual Identity",
    "Copywriting & Content Strategy",
    "Digital Marketing & Growth",
    "Motion Graphics & Video Editing",
    "Data Analytics & BI",
    "DevOps & Cloud Engineering",
  ];

  return (
    <div
      id="profile-portfolio-screen"
      className="w-full max-w-[390px] min-h-screen bg-white mx-auto flex flex-col items-center px-[20px] pt-[40px] pb-[100px] relative text-left"
    >
      {/* 1. Header Bar */}
      <div className="w-[350px] h-[40px] flex items-center gap-[24px] mb-[32px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center cursor-pointer shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft02Icon size={20} color="#272931" />
        </button>

        <h1 className="text-[20px] font-medium leading-[24px] text-[#272931]">
          Profile & Portfolio
        </h1>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="w-[350px] mb-4 p-3 bg-red-50 border border-red-200 rounded-[12px] text-red-600 text-[13px]">
          {errorMessage}
        </div>
      )}

      {/* 2. Avatar & Name Section */}
      <div className="w-[350px] flex flex-col items-center gap-[16px] mb-[16px]">
        <div className="w-[80px] h-[80px] rounded-full overflow-hidden shrink-0">
          <img
            src={user?.avatar_url || profileAvatarImg}
            alt="User profile avatar"
            className="w-[80px] h-[80px] object-cover"
          />
        </div>

        <label
          htmlFor="profile-name-input"
          className="h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] inline-flex items-center gap-[6px] cursor-text max-w-[350px]"
        >
          <div className="inline-grid items-center">
            <span className="invisible col-start-1 row-start-1 whitespace-pre text-[14px] font-medium leading-[30px]">
              {name || "What’s your name"}
            </span>
            <input
              id="profile-name-input"
              ref={nameInputRef}
              size={1}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What’s your name"
              className="col-start-1 row-start-1 w-full min-w-0 bg-transparent outline-none text-[14px] font-medium leading-[30px] text-[#0D0D0D] placeholder:text-[#7B7B7B]"
            />
          </div>
          <Edit02Icon
            size={14}
            color="#7B7B7B"
            className="shrink-0 pointer-events-none"
          />
        </label>
      </div>

      {/* 3. "About you" Section */}
      <div className="w-[350px] flex flex-col gap-[8px] mb-[16px]">
        <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B] select-none">
          About you
        </label>
        <div className="w-[350px] h-[90px] bg-[#FDFDFD] rounded-[20px] p-[16px]">
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell us about yourself"
            className="w-full h-full bg-transparent resize-none outline-none text-[14px] font-medium leading-[18px] text-[#0D0D0D] placeholder:text-[#7B7B7B]"
          />
        </div>
      </div>

      {/* 4. "Primary Skill" Section */}
      <div className="w-[350px] flex flex-col gap-[8px] mb-[16px]">
        <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B] select-none">
          Primary Skill
        </label>

        <div className="w-[350px] flex flex-col gap-[4px]">
          <div
            onClick={() => setIsSkillDropdownOpen((prev) => !prev)}
            className="w-[350px] h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer select-none"
          >
            <span
              className={`text-[14px] font-medium truncate ${
                primarySkill ? "text-[#0D0D0D]" : "text-[#7B7B7B]"
              }`}
            >
              {primarySkill || "Select your primary skill"}
            </span>
            <ArrowDown01Icon
              size={18}
              color="#7B7B7B"
              className={`shrink-0 transition-transform duration-200 ${
                isSkillDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isSkillDropdownOpen && (
            <div className="w-[350px] max-h-[210px] overflow-y-auto bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col gap-[16px] items-start text-left select-none z-10">
              {skillsList.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    setPrimarySkill(skill);
                    setIsSkillDropdownOpen(false);
                  }}
                  className="w-full text-left text-[14px] font-medium leading-[30px] text-[#7B7B7B] hover:text-[#0D0D0D] cursor-pointer transition-colors shrink-0"
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. "Portfolio" Section */}
      <div className="w-[350px] flex flex-col gap-[8px] mb-[32px]">
        <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B] select-none">
          Portfolio
        </label>
        <div className="w-[350px] h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center">
          <input
            type="text"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            placeholder="e.g. https://behance.net/yourprofile"
            className="w-full bg-transparent outline-none text-[14px] font-medium text-[#0D0D0D] placeholder:text-[#7B7B7B]"
          />
        </div>
      </div>

      {/* 6. CTA Button */}
      <button
        type="button"
        disabled={!isFormDirty || isSubmitting}
        onClick={handleUpdateProfile}
        className={`w-[350px] h-[44px] rounded-[22px] flex items-center justify-center shadow-[inset_2px_2px_4px_0px_rgba(255,255,255,0.35),_inset_0px_-2px_4px_0px_rgba(255,255,255,0.3)] transition-all mb-8 ${
          isFormDirty && !isSubmitting
            ? "bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] cursor-pointer"
            : "bg-[#6B7280] cursor-not-allowed opacity-70"
        }`}
      >
        <span className="text-[14px] font-medium text-white text-center leading-[15px]">
          {isSubmitting ? "Updating..." : "Update your profile"}
        </span>
      </button>

      {/* 7. Success Bottom Sheet Modal */}
      <BottomSheetModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <div className="w-full flex flex-col items-center gap-[20px] py-[4px] text-center">
          <img
            src={profileSuccessBadgeImg}
            alt="Profile updated successful"
            className="w-[88px] h-[90px] object-contain animate-badge-pop"
          />

          <div className="w-full flex flex-col items-center gap-[8px] text-center">
            <h3 className="text-[24px] font-medium leading-[29px] text-[#0A0A0A] tracking-[-0.01em]">
              Successful!
            </h3>
            <p className="text-[14px] font-normal leading-[20px] text-[#7B7B7B] max-w-[280px]">
              Your profile has been updated successfully. Your profile is
              visible to customers now.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSuccessModal(false)}
            className="w-full h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none"
          >
            <span>Done</span>
          </button>
        </div>
      </BottomSheetModal>
    </div>
  );
};

export default ProfilePortfolioScreen;
