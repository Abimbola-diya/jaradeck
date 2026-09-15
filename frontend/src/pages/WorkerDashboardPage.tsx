import { useState, useMemo } from "react";
import WorkerBottomNav from "../components/WorkerBottomNav";
import ProjectDetailsModal from "../components/project/ProjectDetailsModal";
import UploadDeliverablesModal from "../components/project/UploadDeliverablesModal";
import jakeTaiwo from "../assets/Jake Taiwo.png";
import { useAuthStore } from "../context/AuthContext";

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 text-[#272931]"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ProjectPerson() {
  return (
    <div className="w-full h-[62px] flex items-center gap-[12px]">
      <img
        src={jakeTaiwo}
        alt="Jake Taiwo"
        className="w-[62px] h-[62px] rounded-full object-cover shrink-0"
      />
      <div className="flex flex-col gap-[6px] items-start text-left">
        <h3 className="text-[16px] font-medium leading-[19px] text-[#272931]">
          Social Media Manager
        </h3>
        <p className="text-[14px] font-normal leading-[17px] text-[#272931]/50">
          Jake Taiwo
        </p>
      </div>
    </div>
  );
}

export default function WorkerDashboardPage() {
  const { user } = useAuthStore();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [hasProjects, setHasProjects] = useState(false);

  // 1. Time-based Greeting
  const { greeting, subtext } = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return { greeting: "Good morning", subtext: "How are you doing today" };
    } else if (hour < 17) {
      return { greeting: "Good afternoon", subtext: "How is your day going" };
    } else {
      return {
        greeting: "Good evening",
        subtext: "How are you doing this evening",
      };
    }
  }, []);

  // 2. Name & Initials
  const fullName = user?.full_name || "User";
  const firstName = fullName.split(" ")[0];

  const initials = useMemo(() => {
    const parts = fullName.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0] ? parts[0][0].toUpperCase() : "U";
  }, [fullName]);

  const activeProject = {
    title: "Social Media\nManagement",
    clientName: "Sarah Jenkins",
    duration: "Oct 12 - Nov 30",
    budget: "$1,200 Total",
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[110px] mx-auto relative">
      {/* Header */}
      <header className="w-full max-w-[358px] flex items-center justify-between">
        <div className="flex flex-col gap-[2px] items-start text-left min-w-0">
          <h1 className="text-[17px] font-medium leading-[22px] tracking-[-0.01em] text-[#272931] truncate">
            {greeting} {firstName}
          </h1>
          <p className="text-[13px] font-normal leading-[16px] text-[#272931]/50 truncate">
            {subtext}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[#F3F4F5] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors outline-none cursor-pointer"
          >
            <BellIcon />
          </button>

          {/* User Avatar / Initials */}
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={fullName}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#0048B3] text-white font-semibold text-[14px] flex items-center justify-center shrink-0 shadow-sm">
              {initials}
            </div>
          )}
        </div>
      </header>

      {/* Demo State Toggle */}
      <div className="w-full max-w-[358px] text-right mt-2">
        <button
          onClick={() => setHasProjects(!hasProjects)}
          className="text-[11px] font-normal text-slate-400 hover:text-slate-600 outline-none cursor-pointer"
        >
          Toggle State ({hasProjects ? "Active" : "Empty"})
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[358px] flex flex-col gap-[24px] mt-[16px]">
        {!hasProjects ? (
          <section className="w-full bg-[#FCFCFC] border border-[#E5E7EB] rounded-[16px] p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
            {/* Playful Dancing / Bouncing Icon */}
            <div className="w-16 h-16 mb-4 rounded-full bg-[#F0F5FF] flex items-center justify-center animate-bounce">
              <span
                className="text-3xl animate-spin"
                style={{ animationDuration: "3s" }}
              >
                🎉
              </span>
            </div>

            <h2 className="text-[16px] font-medium leading-[19px] text-[#272931] mb-2">
              No Active Projects Yet
            </h2>
            <p className="text-[13px] font-normal leading-[18px] text-[#272931]/50 max-w-[260px]">
              You haven&apos;t been assigned any projects yet. Once you start
              working, your active tasks will appear here.
            </p>
          </section>
        ) : (
          <>
            <div className="w-full flex flex-col gap-[8px]">
              {/* Active Project Card */}
              <div className="w-full h-[177px] bg-[#FCFCFC] border border-[#E5E7EB]/60 rounded-[16px] p-[15px_11px_11px_10px] flex flex-col justify-between">
                <h2 className="text-[16px] font-medium leading-[19px] text-[#272931] text-left">
                  Active Project
                </h2>

                <ProjectPerson />

                <button
                  type="button"
                  onClick={() => setIsDetailsModalOpen(true)}
                  className="w-full h-[41px] rounded-[21px] bg-[#0048B3] shadow-button-inset flex items-center justify-center text-white text-[12px] font-medium leading-[15px] hover:opacity-95 active:scale-[0.99] transition-all outline-none cursor-pointer"
                >
                  View Project Details
                </button>
              </div>

              {/* Overall Activity Card */}
              <div className="w-full h-[127px] bg-[#FCFCFC] border border-[#E5E7EB]/60 rounded-[16px] p-[15px_10px] flex flex-col justify-between">
                <div className="flex flex-col gap-[6px] items-start text-left">
                  <h2 className="text-[16px] font-medium leading-[19px] text-[#272931]">
                    Overall Activity
                  </h2>
                  <p className="text-[14px] font-normal leading-[17px] text-[#272931]/50">
                    12 projects delivered with a 100% completion rate.
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full h-[41px] border border-[#0048B3] rounded-[21px] text-[#0048B3] text-[12px] font-medium leading-[15px] flex items-center justify-center hover:bg-[#0048B3]/5 active:scale-[0.99] transition-all outline-none cursor-pointer"
                >
                  View Analytics
                </button>
              </div>
            </div>

            {/* Completed Projects Feed */}
            <div className="w-full flex flex-col gap-[16px]">
              <div className="w-full flex items-center justify-between">
                <h2 className="text-[16px] font-medium leading-[19px] text-[#0D0D0D]">
                  Completed Project
                </h2>
                <button
                  type="button"
                  className="text-[12px] font-medium leading-[14px] text-[#9E9E9E] hover:text-[#0A0A0A] transition-colors outline-none cursor-pointer"
                >
                  See all
                </button>
              </div>

              <div className="w-full flex flex-col gap-[16px]">
                <ProjectPerson />
                <ProjectPerson />
                <ProjectPerson />
              </div>
            </div>
          </>
        )}
      </div>

      <WorkerBottomNav />

      <ProjectDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onOpenUpload={() => {
          setIsDetailsModalOpen(false);
          setIsUploadModalOpen(true);
        }}
        project={activeProject}
      />

      <UploadDeliverablesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onBack={() => {
          setIsUploadModalOpen(false);
          setIsDetailsModalOpen(true);
        }}
      />
    </div>
  );
}
