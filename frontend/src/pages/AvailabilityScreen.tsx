// AvailabilityScreen.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft02Icon, ArrowDown01Icon } from "hugeicons-react";
import ellipse8Svg from "../assets/ellipse_8.svg";
import ellipseLimitedSvg from "../assets/ellipse_limited.svg";
import ellipseBookedSvg from "../assets/ellipse_booked.svg";
import calendarIconSvg from "../assets/calendar_icon.svg";
import WorkerBottomNav from "../components/WorkerBottomNav";
import { useAuthStore } from "../context/AuthContext"; // Import Auth Context hook

export interface StatusOption {
  id: string;
  label: string;
  dotColor: string;
  svgIcon: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  {
    id: "available",
    label: "Available for work",
    dotColor: "#5AAD02",
    svgIcon: ellipse8Svg,
  },
  {
    id: "limited",
    label: "Limited availability",
    dotColor: "#FF6600",
    svgIcon: ellipseLimitedSvg,
  },
  {
    id: "booked",
    label: "Fully booked",
    dotColor: "#CC3100",
    svgIcon: ellipseBookedSvg,
  },
];

export const START_DATE_OPTIONS = [
  "Immediately",
  "In the next two weeks",
  "Specific date",
];

export const RESPONSE_EXPECTATION_OPTIONS = [
  "Under two hours",
  "Within 24 hours",
];

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const AvailabilityScreen: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore(); // Get validated token from auth store

  const [selectedStatus, setSelectedStatus] = useState<StatusOption>(
    STATUS_OPTIONS[0],
  );
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>("");
  const [specificDate, setSpecificDate] = useState<string>("");
  const [isStartDateOpen, setIsStartDateOpen] = useState<boolean>(false);

  const [responseExpectation, setResponseExpectation] = useState<string>("");
  const [isResponseOpen, setIsResponseOpen] = useState<boolean>(false);

  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // 1. Fetch user availability state on component mount
 useEffect(() => {
   const fetchUserProfile = async () => {
     try {
       if (!token) return; // Guard clause if token isn't ready yet

       const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });

       if (res.ok) {
         const data = await res.json();
         if (data.availability_status) {
           const matched = STATUS_OPTIONS.find(
             (opt) => opt.id === data.availability_status,
           );
           if (matched) setSelectedStatus(matched);
         }
         if (data.earliest_start_date) setStartDate(data.earliest_start_date);
         if (data.specific_start_date)
           setSpecificDate(data.specific_start_date);
         if (data.response_expectation)
           setResponseExpectation(data.response_expectation);
       }
     } catch (err) {
       console.error("Failed to load availability preferences", err);
     } finally {
       setIsLoading(false);
     }
   };

   fetchUserProfile();
 }, [token]);

  // 2. Save availability update via PATCH /api/users/profile
const handleSave = async () => {
  if (!token) {
    console.error("No authentication token available.");
    return;
  }
  setIsSaving(true);
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        availability_status: selectedStatus.id,
        earliest_start_date: startDate,
        specific_start_date: startDate === "Specific date" ? specificDate : "",
        response_expectation: responseExpectation,
      }),
    });

if (!res.ok) {
  const errorData = await res.json().catch(() => ({}));
  console.error("PATCH /api/users/profile failed:", res.status, errorData);
  throw new Error(errorData.detail || "Failed to save preferences");
}
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      navigate("/dashboard/settings");
    }, 800);
  } catch (err) {
    console.error("Save error:", err);
  } finally {
    setIsSaving(false);
  }
};

  if (isLoading) {
    return (
      <div className="w-full max-w-[390px] min-h-screen bg-white mx-auto flex items-center justify-center text-slate-500 text-sm">
        Loading availability...
      </div>
    );
  }

  return (
    <div
      id="availability-screen"
      className="w-full max-w-[390px] min-h-screen bg-white mx-auto flex flex-col items-center justify-between pt-[40px] px-[20px] pb-[100px] relative text-left select-none"
    >
      {/* Top Container */}
      <div className="w-[350px] flex flex-col items-start">
        {/* Header Bar */}
        <div className="w-[350px] h-[44px] flex items-center gap-[24px] mb-[32px]">
          <button
            type="button"
            onClick={() => navigate("/dashboard/settings")}
            className="w-[44px] h-[44px] rounded-full bg-[#FCFCFC] flex items-center justify-center cursor-pointer shrink-0 hover:bg-[#F3F4F6] active:scale-95 transition-all outline-none"
            aria-label="Back to Settings"
          >
            <ArrowLeft02Icon size={24} color="#141B34" />
          </button>

          <h1 className="text-[20px] font-medium leading-[24px] text-[#272931]">
            Availability
          </h1>
        </div>

        {/* Body Form */}
        <div className="w-[350px] flex flex-col gap-[16px]">
          {/* Current Status Section */}
          <div className="w-[350px] flex flex-col items-end gap-[4px]">
            <div className="w-[350px] h-[46px] flex items-center justify-between">
              <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
                Current Status
              </label>

              <button
                type="button"
                onClick={() => setIsStatusOpen((prev) => !prev)}
                className="w-[173px] h-[46px] bg-[#FDFDFD] rounded-[10px] px-[8px] py-[8px] flex items-center justify-between gap-[4px] cursor-pointer hover:bg-[#F8F8F8] transition-colors shrink-0"
              >
                <div className="flex items-center gap-[6px] min-w-0">
                  <img
                    src={selectedStatus.svgIcon}
                    alt={selectedStatus.label}
                    className="w-[14px] h-[14px] shrink-0"
                  />
                  <span className="text-[14px] font-medium leading-[30px] text-[#6E6E6E] whitespace-nowrap">
                    {selectedStatus.label}
                  </span>
                </div>
                <ArrowDown01Icon
                  size={18}
                  color="#7B7B7B"
                  className={`shrink-0 transition-transform duration-200 ${
                    isStatusOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {isStatusOpen && (
              <div className="w-[173px] bg-[#FDFDFD] rounded-[10px] p-[8px_32px_8px_8px] flex flex-col gap-[8px] items-start animate-slide-down origin-top">
                {STATUS_OPTIONS.filter(
                  (opt) => opt.id !== selectedStatus.id,
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(opt);
                      setIsStatusOpen(false);
                    }}
                    className="flex items-center gap-[8px] text-left cursor-pointer group"
                  >
                    <img
                      src={opt.svgIcon}
                      alt={opt.label}
                      className="w-[14px] h-[14px] shrink-0"
                    />
                    <span className="text-[14px] font-medium leading-[30px] text-[#6E6E6E] group-hover:text-[#0D0D0D] whitespace-nowrap transition-colors">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Earliest Start Date Section */}
          <div className="w-[350px] flex flex-col gap-[8px]">
            <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
              Earliest Start date
            </label>

            <div className="w-[350px] flex flex-col gap-[4px]">
              <div
                onClick={() => setIsStartDateOpen((prev) => !prev)}
                className="w-[350px] h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer hover:bg-[#F8F8F8] transition-colors select-none"
              >
                <span
                  className={`text-[14px] font-medium truncate ${
                    startDate ? "text-[#0D0D0D]" : "text-[#9E9E9E]"
                  }`}
                >
                  {startDate === "Specific date"
                    ? specificDate || "Specific date"
                    : startDate || "How soon can you start handling projects"}
                </span>
                <ArrowDown01Icon
                  size={18}
                  color="#7B7B7B"
                  className={`shrink-0 transition-transform duration-200 ${
                    isStartDateOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isStartDateOpen && (
                <div className="w-[350px] bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col gap-[16px] items-start text-left animate-slide-down origin-top">
                  {START_DATE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setStartDate(opt);
                        if (opt !== "Specific date") setIsStartDateOpen(false);
                      }}
                      className={`text-left text-[14px] font-medium leading-[30px] cursor-pointer transition-colors ${
                        startDate === opt
                          ? "text-[#0D0D0D]"
                          : "text-[#7B7B7B] hover:text-[#0D0D0D]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {isStartDateOpen && startDate === "Specific date" && (
                <div className="w-[350px] h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center gap-[8px] animate-slide-down origin-top">
                  <img
                    src={calendarIconSvg}
                    alt="Calendar icon"
                    className="w-[24px] h-[24px] shrink-0"
                  />
                  <input
                    type="text"
                    value={specificDate}
                    onChange={(e) => {
                      setSpecificDate(e.target.value);
                      setStartDate("Specific date");
                    }}
                    placeholder="What date is comfortable?"
                    className="w-full bg-transparent outline-none text-[14px] font-medium text-[#0D0D0D] placeholder:text-[#9E9E9E]"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>

          {/* Response Expectations Section */}
          <div className="w-[350px] flex flex-col gap-[8px]">
            <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
              Response Expectations
            </label>

            <div className="w-[350px] flex flex-col gap-[4px]">
              <div
                onClick={() => setIsResponseOpen((prev) => !prev)}
                className="w-[350px] h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer hover:bg-[#F8F8F8] transition-colors select-none"
              >
                <span
                  className={`text-[14px] font-medium truncate ${
                    responseExpectation ? "text-[#0D0D0D]" : "text-[#9E9E9E]"
                  }`}
                >
                  {responseExpectation || "When should clients expect a reply"}
                </span>
                <ArrowDown01Icon
                  size={18}
                  color="#7B7B7B"
                  className={`shrink-0 transition-transform duration-200 ${
                    isResponseOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isResponseOpen && (
                <div className="w-[350px] bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col gap-[16px] items-start text-left animate-slide-down origin-top">
                  {RESPONSE_EXPECTATION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setResponseExpectation(opt);
                        setIsResponseOpen(false);
                      }}
                      className={`text-left text-[14px] font-medium leading-[30px] cursor-pointer transition-colors ${
                        responseExpectation === opt
                          ? "text-[#0D0D0D]"
                          : "text-[#7B7B7B] hover:text-[#0D0D0D]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Container */}
      <div className="w-[350px] flex flex-col items-center mt-[40px]">
        {showSavedToast && (
          <div className="mb-[12px] px-[16px] py-[8px] bg-[#0A0A0A] text-white text-[13px] font-medium rounded-full shadow-lg animate-fadeIn">
            Availability preferences saved!
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="w-[350px] h-[44px] bg-[#0048B3] hover:bg-[#003A91] disabled:opacity-50 active:scale-[0.99] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-all outline-none"
        >
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </button>
      </div>
      <WorkerBottomNav />
    </div>
  );
};

export default AvailabilityScreen;
