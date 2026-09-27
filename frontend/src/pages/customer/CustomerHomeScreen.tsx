import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic01Icon, ArrowUp02Icon, Loading03Icon } from "hugeicons-react";

// Adjust asset import paths according to your structure or use public fallbacks
import headerActionsImg from "../../assets/header_actions.png";
import marcusAvatarSvg from "../../assets/marcus_avatar.svg";

import { useAuthStore } from "../../context/AuthContext";
import BottomNav from "../../components/BottomNav";

export const CustomerHomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [promptText, setPromptText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Mock project state (replaces ProjectContext)
  const [project] = useState({
    status: "in_progress", // 'in_progress' | 'in_review' | 'completed'
    contract: {
      payeeName: "Marcus Vance",
      totalAmount: 1200,
    },
  });

  const displayName =
    user?.first_name || user?.full_name?.split(" ")[0] || "Emmanuel";

  const handleSubmitPrompt = () => {
    if (!promptText.trim()) return;
    setIsLoading(true);

    // Simulated matching delay before navigating to recommendations
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard/recommendations");
    }, 2800);
  };

  const handleCancelLoading = () => {
    setIsLoading(false);
  };

  const handleVoiceRecord = () => {
    if (isLoading) return;
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      setPromptText("I need someone to manage my social media");
    }
  };

  return (
    <div className="w-full max-w-md min-h-screen bg-white flex flex-col items-center px-4 pt-10 pb-28 mx-auto relative overflow-y-auto font-sans">
      {/* Upper Stack Header */}
      <div className="w-full flex flex-col gap-7">
        <header className="w-full flex items-center justify-between">
          {/* Left: Greeting */}
          <div className="flex flex-col gap-0.5 items-start text-left min-w-0">
            <h1 className="text-b text-[17px] font-medium leading-6 tracking-tight text-[#272931] whitespace-nowrap">
              Good morning {displayName}
            </h1>
            <p className="text-[13px] font-normal leading-4 text-[#272931]/50 whitespace-nowrap">
              How are you doing today
            </p>
          </div>

          {/* Right: Actions */}
          <button
            type="button"
            className="h-10 flex items-center shrink-0 outline-none cursor-pointer"
            aria-label="User profile and notifications"
          >
            <img
              src={headerActionsImg}
              alt="User profile and notifications"
              className="h-10 object-contain"
            />
          </button>
        </header>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 self-start transition-all animate-fadeIn">
            <span className="text-[14px] font-normal text-[#6B7280]">
              Looking for best fit
            </span>
            <Loading03Icon
              size={18}
              className="w-4 h-4 text-[#6B7280] animate-spin shrink-0"
            />
          </div>
        )}
      </div>

      {/* Main Prompt Stack */}
      <div
        className={`w-full flex flex-col items-center gap-8 my-auto ${
          isLoading ? "py-10" : "py-14"
        }`}
      >
        {!isLoading && (
          <h2 className="text-[34px] font-medium leading-[40px] tracking-tight text-[#0D0D0D] text-center max-w-[270px]">
            What do you
            <br />
            need help with?
          </h2>
        )}

        {/* Textarea Card */}
        <div className="w-full h-[114px] bg-[#F5F6F8] rounded-[18px] p-4 flex flex-col justify-between transition-all duration-300">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitPrompt();
              }
            }}
            placeholder="Describe what you need help with"
            className="w-full bg-transparent text-[14px] text-[#111827] placeholder-[#9E9E9E] resize-none outline-none font-normal leading-5 h-11 disabled:opacity-90"
            rows={2}
          />

          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={handleVoiceRecord}
              disabled={isLoading}
              className={`p-1.5 rounded-full transition-all outline-none cursor-pointer ${
                isRecording
                  ? "text-[#0048B3] bg-[#0048B3]/10 animate-pulse scale-105"
                  : "text-[#272931] hover:text-[#0048B3]"
              }`}
              aria-label="Voice input"
            >
              <Mic01Icon size={18} className="w-[18px] h-[18px]" />
            </button>

            {isLoading ? (
              <button
                type="button"
                onClick={handleCancelLoading}
                className="w-[34px] h-[34px] rounded-full bg-[#0048B3] text-white flex items-center justify-center cursor-pointer outline-none shrink-0"
                aria-label="Stop searching"
              >
                <div className="w-[10px] h-[10px] bg-white rounded-[2px]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitPrompt}
                className="w-[34px] h-[34px] rounded-full bg-[#0048B3] text-white flex items-center justify-center cursor-pointer outline-none shrink-0"
                aria-label="Submit project description"
              >
                <ArrowUp02Icon
                  size={18}
                  color="#FFFFFF"
                  className="w-[18px] h-[18px]"
                />
              </button>
            )}
          </div>
        </div>

        {/* Active Project Card */}
        {!isLoading && (
          <div className="w-full bg-[#FCFCFC] rounded-[18px] p-4 flex flex-col gap-3 text-left transition-all border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-[#0048B3] bg-[#0048B3]/10 px-2.5 py-1 rounded-full">
                Active Project
              </span>
              <span className="text-[12px] font-medium text-[#498905]">
                {project.status === "in_review"
                  ? "Milestone 2 • In Review"
                  : project.status === "completed"
                    ? "Project Completed"
                    : "Milestone 2 • In Progress"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={marcusAvatarSvg}
                alt="Marcus Vance"
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
              <div className="flex flex-col">
                <h3 className="text-[15px] font-medium leading-5 text-[#0D0D0D]">
                  Social Media Management
                </h3>
                <p className="text-[13px] font-normal leading-4 text-[#6B7280]">
                  {project.contract.payeeName} • $
                  {project.contract.totalAmount.toLocaleString()} Total
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard/project-details")}
              className="w-full h-10 rounded-full bg-[#0048B3] text-white text-[13px] font-medium hover:bg-[#003A91] active:scale-[0.99] transition-all cursor-pointer outline-none flex items-center justify-center"
            >
              View Project & Escrow
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default CustomerHomeScreen;
