import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft02Icon, ArrowDown01Icon, Calendar03Icon } from 'hugeicons-react';
import { useApp } from '../context/AppContext';
import ellipse8Svg from '../assets/ellipse_8.svg';
import ellipseLimitedSvg from '../assets/ellipse_limited.svg';
import ellipseBookedSvg from '../assets/ellipse_booked.svg';

export const STATUS_OPTIONS = [
  { id: 'available', label: 'Available for work', dotColor: '#5AAD02', svgIcon: ellipse8Svg },
  { id: 'limited', label: 'Limited availability', dotColor: '#FF6600', svgIcon: ellipseLimitedSvg },
  { id: 'booked', label: 'Fully booked', dotColor: '#CC3100', svgIcon: ellipseBookedSvg },
];

export const START_DATE_OPTIONS = [
  'Immediately',
  'In the next two weeks',
  'Specific date',
];

export const RESPONSE_EXPECTATION_OPTIONS = [
  'Under two hours',
  'Within 24 hours',
];

export const WorkerAvailabilityScreen = () => {
  const navigate = useNavigate();
  const appContext = useApp?.() || {};
  const { navigateTo, goBack, updateFreelancerState } = appContext;

  const handleBack = () => {
    if (goBack) {
      goBack();
    } else if (navigateTo) {
      navigateTo('dashboard/settings');
    } else {
      navigate(-1);
    }
  };

  // Check if preview-1462 is requested via hash or window search
  const [isPreview1462, setIsPreview1462] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.hash.includes('preview-1462') ||
        window.location.search.includes('preview-1462')
      );
    }
    return false;
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsPreview1462(
        window.location.hash.includes('preview-1462') ||
        window.location.search.includes('preview-1462')
      );
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Form State
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0]);
  const [isStatusOpen, setIsStatusOpen] = useState(isPreview1462);

  const [startDate, setStartDate] = useState('');
  const [specificDate, setSpecificDate] = useState('');
  const [isStartDateOpen, setIsStartDateOpen] = useState(isPreview1462);

  const [responseExpectation, setResponseExpectation] = useState('');
  const [isResponseOpen, setIsResponseOpen] = useState(isPreview1462);

  const [showSavedToast, setShowSavedToast] = useState(false);

  // Synchronize when isPreview1462 toggles
  useEffect(() => {
    if (isPreview1462) {
      setIsStatusOpen(true);
      setIsStartDateOpen(true);
      setIsResponseOpen(true);
    }
  }, [isPreview1462]);

  const handleSave = () => {
    setShowSavedToast(true);
    if (updateFreelancerState) {
      updateFreelancerState({ availabilitySet: true });
    }
    setTimeout(() => {
      setShowSavedToast(false);
      if (navigateTo) {
        navigateTo('freelancer/dashboard');
      } else {
        navigate('/dashboard');
      }
    }, 1000);
  };

  return (
    <div
      id="availability-screen"
      className="w-full max-w-[390px] min-h-screen bg-white mx-auto flex flex-col items-center justify-between pt-[40px] px-[16px] pb-[100px] relative text-left select-none"
    >
      {/* Top Container */}
      <div className="w-full max-w-[358px] flex flex-col items-start">
        {/* 1. Header Bar (50px height, gap: 16px) */}
        <div className="w-full h-[50px] flex items-center gap-[16px] mb-[32px]">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-[50px] h-[50px] rounded-full bg-[#FCFCFC] flex items-center justify-center cursor-pointer shrink-0 hover:bg-[#F3F4F6] active:scale-[0.94] transition-[background-color,transform] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-[#0048B3]/40"
            aria-label="Back to Settings"
          >
            <ArrowLeft02Icon size={24} color="#141B34" />
          </button>

          {/* Title */}
          <h1 className="text-[20px] font-medium leading-[24px] text-[#272931] [text-wrap:balance]">
            Availability
          </h1>
        </div>

        {/* 2. Body Form (gap: 16px) */}
        <div className="w-full flex flex-col gap-[16px]">
          {/* A. Current Status Section */}
          <div className="w-full flex flex-col items-end gap-[4px]">
            {/* Top Row: Label on Left, Status Pill Trigger on Right */}
            <div className="w-full h-[46px] flex items-center justify-between">
              <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
                Current Status
              </label>

              {/* Status Pill Trigger */}
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
                    isStatusOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* In-Flow Expanded Status Menu */}
            {isStatusOpen && (
              <div className="w-[173px] bg-[#FDFDFD] rounded-[10px] p-[8px_32px_8px_8px] flex flex-col gap-[8px] items-start animate-slide-down origin-top">
                {STATUS_OPTIONS.filter((opt) => opt.id !== selectedStatus.id).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(opt);
                      if (!isPreview1462) setIsStatusOpen(false);
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

          {/* B. Earliest Start Date Section */}
          <div className="w-full flex flex-col gap-[8px]">
            <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
              Earliest Start date
            </label>

            {/* In-Flow Container */}
            <div className="w-full flex flex-col gap-[4px]">
              {/* Trigger Box */}
              <div
                onClick={() => setIsStartDateOpen((prev) => !prev)}
                className="w-full h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer hover:bg-[#F8F8F8] transition-colors select-none"
              >
                <span
                  className={`text-[14px] font-medium truncate ${
                    startDate ? 'text-[#0D0D0D]' : 'text-[#9E9E9E]'
                  }`}
                >
                  {startDate === 'Specific date'
                    ? specificDate || 'Specific date'
                    : startDate || 'How soon can you start handling projects'}
                </span>
                <ArrowDown01Icon
                  size={18}
                  color="#7B7B7B"
                  className={`shrink-0 transition-transform duration-200 ${
                    isStartDateOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* In-Flow Expanded Options Menu */}
              {isStartDateOpen && (
                <div className="w-full bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col gap-[16px] items-start text-left animate-slide-down origin-top">
                  {START_DATE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setStartDate(opt);
                        if (opt !== 'Specific date' && !isPreview1462) {
                          setIsStartDateOpen(false);
                        }
                      }}
                      className={`text-left text-[14px] font-medium leading-[30px] cursor-pointer transition-colors ${
                        startDate === opt ? 'text-[#0D0D0D]' : 'text-[#7B7B7B] hover:text-[#0D0D0D]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* In-Flow Specific Date Input Field */}
              {isStartDateOpen && startDate === 'Specific date' && (
                <div className="w-full h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center gap-[8px] animate-slide-down origin-top">
                  <Calendar03Icon
                    size={24}
                    color="#9E9E9E"
                    className="shrink-0"
                  />
                  <input
                    type="text"
                    value={specificDate}
                    onChange={(e) => {
                      setSpecificDate(e.target.value);
                      setStartDate('Specific date');
                    }}
                    placeholder="What date is comfortable?"
                    className="w-full bg-transparent outline-none text-[14px] font-medium text-[#0D0D0D] placeholder:text-[#9E9E9E]"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>

          {/* C. Response Expectations Section */}
          <div className="w-full flex flex-col gap-[8px]">
            <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
              Response Expectations
            </label>

            {/* In-Flow Container */}
            <div className="w-full flex flex-col gap-[4px]">
              {/* Trigger Box */}
              <div
                onClick={() => setIsResponseOpen((prev) => !prev)}
                className="w-full h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer hover:bg-[#F8F8F8] transition-colors select-none"
              >
                <span
                  className={`text-[14px] font-medium truncate ${
                    responseExpectation ? 'text-[#0D0D0D]' : 'text-[#9E9E9E]'
                  }`}
                >
                  {responseExpectation || 'When should clients expect a reply'}
                </span>
                <ArrowDown01Icon
                  size={18}
                  color="#7B7B7B"
                  className={`shrink-0 transition-transform duration-200 ${
                    isResponseOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* In-Flow Expanded Options Menu */}
              {isResponseOpen && (
                <div className="w-full bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col gap-[16px] items-start text-left animate-slide-down origin-top">
                  {RESPONSE_EXPECTATION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setResponseExpectation(opt);
                        if (!isPreview1462) setIsResponseOpen(false);
                      }}
                      className={`text-left text-[14px] font-medium leading-[30px] cursor-pointer transition-colors ${
                        responseExpectation === opt
                          ? 'text-[#0D0D0D]'
                          : 'text-[#7B7B7B] hover:text-[#0D0D0D]'
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

      {/* Bottom Container: Save CTA Button */}
      <div className="w-full max-w-[358px] flex flex-col items-center mt-[40px]">
        {/* Toast confirmation */}
        {showSavedToast && (
          <div className="mb-[12px] px-[16px] py-[8px] bg-[#0A0A0A] text-white text-[13px] font-medium rounded-full shadow-lg animate-fadeIn">
            Availability preferences saved!
          </div>
        )}

        {/* 3. CTA Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full max-w-[358px] h-[44px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.97] rounded-[22px] shadow-button-inset flex items-center justify-center text-white text-[14px] font-medium leading-[15px] cursor-pointer transition-[background-color,transform] duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-[#0048B3]/40"
        >
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default WorkerAvailabilityScreen;

