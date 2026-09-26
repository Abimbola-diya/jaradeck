import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft02Icon,
  CameraAdd01Icon,
  CheckmarkCircle02Icon,
  Add01Icon,
  StarIcon,
} from 'hugeicons-react';
import { useApp } from '../context/AppContext';
import { AddPortfolioWorkModal } from './modals/AddPortfolioWorkModal';
import { getProjectBlocks } from '../lib/db/clientWorkspace';
import { SelectField } from './ui/SelectField';

// Figma Vector & Raster Assets
import sarahAdulojuAvatar from '../assets/sarah_aduloju_avatar.png';
import noActiveProjectsSvg from '../assets/no_active_projects.svg';
import portfolioRiseAppPreviewImg from '../assets/portfolio_rise_app_preview.png';
import emptyProfileIconSvg from '../assets/empty_profile_icon.svg';
import multipleStarsSvg from '../assets/multiple_stars.svg';

// Default initial work item matching Figma node 1802:3067
const DEFAULT_INITIAL_WORKS = [];

export const ProfilePortfolioScreen = ({ forceToast = false }) => {
  const { user = {}, updateUser, navigateTo, goBack } = useApp?.() || {};

  // Profile Identity & Content (matches Figma 1716:2694 & 1728:3122 exactly)
  const name = user.fullName || user.name || 'Sarah Aduloju';
  const roleTitle = 'Product Designer';
  const aboutText =
    'I am a passionate social media strategist with 6 years of experience, leading the line at various companies like Rise.';
  const [primarySkill, setPrimarySkill] = useState('Product Design');
  const [location, setLocation] = useState('Lagos, Nigeria');

  // Avatar Upload & Persistence State (Figma Node 1716:2708 & 1798:2893)
  const fileInputRef = useRef(null);
  const [avatarImage, setAvatarImage] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('jaradeck_profile_avatar');
        if (stored) return stored;
      } catch (e) {}
    }
    return user.avatarUrl || user.avatar_url || sarahAdulojuAvatar;
  });
  const [toastMessage, setToastMessage] = useState(null);

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size exceeds 10MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setAvatarImage(dataUrl);
        if (updateUser) updateUser({ avatarUrl: dataUrl });
        try {
          localStorage.setItem('jaradeck_profile_avatar', dataUrl);
        } catch (err) {
          console.warn('Failed to persist avatar to localStorage:', err);
        }
        setToastMessage('Profile picture updated');
        setTimeout(() => setToastMessage(null), 3000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleBack = () => {
    if (goBack) {
      goBack();
    } else if (navigateTo) {
      navigateTo('shared/settings');
    }
  };

  // Portfolio Works & Local Workspace State (defaults to Figma node 1802:3067)
  const [works, setWorks] = useState(() => DEFAULT_INITIAL_WORKS);
  const [isAddWorkModalOpen, setIsAddWorkModalOpen] = useState(false);

  // Load staged portfolio works from IndexedDB / Dexie / localStorage on mount
  useEffect(() => {
    let isMounted = true;
    const loadWorks = async () => {
      try {
        const stagedWorks = await getProjectBlocks('profile_portfolio_default');
        if (isMounted && stagedWorks && stagedWorks.length > 0) {
          setWorks(stagedWorks);
        }
      } catch (err) {
        console.error('Failed to load portfolio works from Dexie:', err);
      }
    };
    loadWorks();
    return () => {
      isMounted = false;
    };
  }, []);

  const skillsList = [
    'Product Design',
    'UI/UX Design',
    'Software Development',
    'Mobile App Development',
    'Frontend Development',
    'Backend Development',
  ];

  const locationsList = [
    'Lagos, Nigeria',
    'Abuja, Nigeria',
    'London, UK',
    'Remote (Worldwide)',
  ];

  const isPopulated = works.length > 0;

  return (
    <div
      id="profile-portfolio-screen"
      className="w-full max-w-[390px] min-h-[1168px] bg-white mx-auto flex flex-col items-center px-[16px] pt-[62px] pb-[120px] relative text-left font-sans select-none"
    >
      {/* Toast Notification (Figma Node 1802:3118: 163px x 30px, #0048B3, checkmark-circle-02, no shadow) */}
      {(toastMessage || forceToast) && (
        <div
          data-testid="profile-upload-toast"
          className="fixed top-[20px] left-1/2 -translate-x-1/2 z-50 w-[163px] h-[30px] bg-[#0048B3] rounded-[20px] px-[12px] py-[8px] flex items-center justify-center gap-[6px] transition-all duration-300 animate-fade-in pointer-events-auto select-none"
        >
          <CheckmarkCircle02Icon size={14} color="#FFFFFF" className="shrink-0" />
          <span className="text-[12px] font-medium leading-[14px] text-white whitespace-nowrap">
            {toastMessage || 'Profile picture updated'}
          </span>
        </div>
      )}

      {/* 1. Header Bar (Frame 4408: 358px x 40px) */}
      <div className="w-full max-w-[358px] h-[40px] flex items-center justify-between gap-[24px] mb-[24px]">
        {/* Back Button (40x40px circular standard) */}
        <button
          type="button"
          onClick={handleBack}
          className="w-[40px] h-[40px] rounded-full bg-[#FCFCFC] flex items-center justify-center cursor-pointer hover:bg-[#F3F4F6] active:scale-[0.94] transition-[background-color,transform] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-[#0048B3]/40 shrink-0"
          aria-label="Go back to Settings"
        >
          <ArrowLeft02Icon size={20} color="#272931" />
        </button>

        {/* Title (20px, font-medium, color #272931) */}
        <div className="flex-1 text-left">
          <h1 className="text-[20px] font-medium leading-[24px] text-[#272931]">
            Profile
          </h1>
        </div>
      </div>

      {/* 2. Content Stack (Frame 4443: width 358px, gap 24px) */}
      <div className="w-full max-w-[358px] flex flex-col gap-[24px]">
        {/* Identity Section (Frame 990: 350px x 80px) */}
        <div className="w-full h-[80px] flex items-center gap-[11px] relative">
          {/* Avatar Container with Centered Camera Upload Icon */}
          <div className="relative w-[80px] h-[80px] shrink-0">
            {/* Avatar Circle */}
            <button
              type="button"
              onClick={triggerUpload}
              className="w-[80px] h-[80px] rounded-full overflow-hidden border border-[#F3F4F6] relative block cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-[#0048B3]/50 transition-transform active:scale-[0.97]"
              title="Click to upload profile picture"
              aria-label="Upload profile picture"
            >
              <img
                src={avatarImage}
                alt={name}
                className="w-full h-full object-cover group-hover:brightness-90 transition-[filter]"
              />
              {/* Centered Camera Icon Overlay (empty_profile_icon.svg) */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/25 transition-colors">
                <img
                  src={emptyProfileIconSvg}
                  alt="Upload profile icon"
                  className="w-[30px] h-[30px] object-contain drop-shadow-sm"
                />
              </div>
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleAvatarUpload}
              className="hidden"
              data-testid="profile-picture-input"
            />
          </div>

          {/* Name & Title Container */}
          <div className="flex flex-col justify-center gap-[4px]">
            <h2 className="text-[24px] font-medium leading-[32px] text-[#000000] tracking-tight">
              {name}
            </h2>
            <p className="text-[14px] font-normal leading-[20px] text-[#6B7280]">
              {roleTitle}
            </p>
          </div>
        </div>

        {/* Metrics Strip (Figma Node 1802:3000: Frame 995, 350px x 37px) */}
        <div className="w-full h-[37px] flex items-start justify-between">
          {/* Metric 1: Earned (Frame 993) */}
          <div className="w-[51px] flex flex-col items-center justify-between h-[37px]">
            <span className="text-[16px] font-medium text-[#272931] leading-[19px]">
              ₦25K
            </span>
            <span className="text-[12px] text-[#6B7280] leading-[15px]">
              Earned
            </span>
          </div>

          {/* Metric 2: Hired (Frame 994) */}
          <div className="w-[51px] flex flex-col items-center justify-between h-[37px]">
            <span className="text-[16px] font-medium text-[#272931] leading-[19px]">
              7x
            </span>
            <span className="text-[14px] text-[#6B7280] leading-[17px]">
              Hired
            </span>
          </div>

          {/* Metric 3: Ratings (Frame 995 with multiple_stars.svg) */}
          <div className="w-[51px] flex flex-col items-center justify-between h-[37px]">
            <img
              src={multipleStarsSvg}
              alt="Ratings stars"
              className="w-[51px] h-[12px] object-contain my-auto"
            />
            <span className="text-[14px] text-[#6B7280] leading-[17px]">
              Ratings
            </span>
          </div>

          {/* Metric 4: Reviews (Frame 996) */}
          <div className="w-[50px] flex flex-col items-center justify-between h-[37px]">
            <span className="text-[16px] font-medium text-[#272931] leading-[19px]">
              20+
            </span>
            <span className="text-[14px] text-[#6B7280] leading-[17px]">
              Reviews
            </span>
          </div>
        </div>

        {/* 3. Completion Status Card (Node 1716:2732: 350px x 89px) */}
        <div className="w-full bg-[#FFFFFF] rounded-[16px] p-[16px] flex flex-col justify-between gap-[12px] border-[0.5px] border-[#CFCFCF]">
          <div className="w-full flex items-center justify-between text-[12px] font-medium leading-[14px]">
            <span className="text-[#4B5563]">Profile Status</span>
            <span className="text-[#0048B3]">70% Ready</span>
          </div>

          {/* 6px Progress Bar (Node 1716:2736) */}
          <div className="w-full h-[6px] bg-[#F9FAFB] rounded-[3px] overflow-hidden">
            <div
              className="h-full bg-[#0048B3] rounded-[3px]"
              style={{ width: '70%' }}
            />
          </div>

          {/* Checklist Summary (Node 1716:2740: 11px font-medium #4B5563) */}
          <div className="w-full text-[11px] font-medium leading-[13px] text-[#4B5563]">
            <span>Upload at least 3 portfolio works</span>
          </div>
        </div>

        {/* 4. "About you" Section (Frame 4459 Node 1716:2742) */}
        <div className="w-full flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
            About you
          </label>

          <div className="w-full min-h-[78px] bg-[#FDFDFD] rounded-[20px] p-[12px]">
            <p className="text-[14px] font-medium text-[#0D0D0D] leading-[18px]">
              {aboutText}
            </p>
          </div>
        </div>

        {/* 5. "Primary Skill" Section (Frame 4460 Node 1716:2748) using established SelectField */}
        <SelectField
          label="Primary Skill"
          value={primarySkill}
          options={skillsList}
          onChange={(val) => {
            setPrimarySkill(val);
            setToastMessage('Profile updated');
            setTimeout(() => setToastMessage(null), 3500);
          }}
          rounded="rounded-[20px]"
        />

        {/* 6. "Location" Section (Frame 4464 Node 1716:2761) using established SelectField */}
        <SelectField
          label="Location"
          value={location}
          options={locationsList}
          onChange={(val) => {
            setLocation(val);
            setToastMessage('Profile updated');
            setTimeout(() => setToastMessage(null), 3500);
          }}
          rounded="rounded-[20px]"
        />

        {/* 7. "Portfolio Works" Section (Figma Node 1802:3059) */}
        <div className="w-full flex flex-col gap-[16px]">
          <div className="w-full h-[30px] flex items-center justify-between">
            <span className="text-[14px] font-medium leading-[30px] text-[#7B7B7B]">
              Portfolio Works
            </span>

            {/* Add Work CTA Button in Section Header (Only shown when works exist) */}
            {isPopulated && (
              <button
                type="button"
                id="add-work-header-btn"
                onClick={() => navigateTo('shared/add-portfolio-work')}
                className="w-[96px] h-[30px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.96] text-white rounded-[20px] px-[12px] py-[8px] flex items-center justify-between cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M6 1.5V10.5M1.5 6H10.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[12px] font-medium leading-[14px]">Add Work</span>
              </button>
            )}
          </div>

          {/* Populated Cards vs Empty State */}
          {!isPopulated ? (
            <div className="w-full min-h-[180px] flex flex-col items-center justify-center gap-[16px] py-[12px]">
              <div className="flex flex-col items-center gap-[12px]">
                <img
                  src={noActiveProjectsSvg}
                  alt="No portfolio works yet"
                  className="w-[100px] h-[90px] object-contain"
                />
                <p className="text-[16px] font-medium text-[#272931] leading-[19px] text-center">
                  Upload your best works
                </p>
              </div>

              {/* Add Work CTA Button */}
              <button
                type="button"
                id="add-work-cta-btn"
                onClick={() => navigateTo('shared/add-portfolio-work')}
                className="w-[96px] h-[30px] bg-[#0048B3] hover:bg-[#003A91] active:scale-[0.96] text-white rounded-[20px] px-[12px] py-[8px] flex items-center justify-between cursor-pointer shadow-xs"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M6 1.5V10.5M1.5 6H10.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[12px] font-medium leading-[14px]">Add Work</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-[16px]">
              {works.map((work) => (
                <div
                  key={work.id}
                  className="w-full h-[226px] bg-[#FDFDFD] rounded-[20px] p-[12px] flex flex-col justify-between border border-[#F3F4F6]"
                >
                  {/* Card Header (Node 1721:2205: Project Info + Status Pill) */}
                  <div className="w-full h-[33px] flex items-center justify-between">
                    <div className="flex flex-col justify-between h-[33px]">
                      <h4 className="text-[14px] font-medium text-[#0D0D0D] leading-[17px]">
                        {work.title || 'Rise Mobile App'}
                      </h4>
                      <p className="text-[12px] text-[#6B7280] leading-[14px]">
                        {work.bodyText || 'Product Design • 2024'}
                      </p>
                    </div>

                    <div className="w-[56px] h-[20px] rounded-[12px] bg-[#FCFCFC] flex items-center justify-center">
                      <span className="text-[10px] font-medium text-[#0048B3] leading-[12px]">
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Card Preview Media (Node 1721:2211: 326px x 120px) */}
                  <div className="w-full h-[120px] rounded-[12px] overflow-hidden">
                    <img
                      src={work.storagePath || portfolioRiseAppPreviewImg}
                      alt={work.title || 'Preview image'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Card Footer (Node 1721:2212: 3 Files + View CTA) */}
                  <div className="w-full h-[25px] flex items-center justify-between">
                    <span className="text-[12px] text-[#6B7280] leading-[14px]">
                      3 Files
                    </span>

                    <button
                      type="button"
                      className="w-[44px] h-[25px] rounded-[16px] bg-[#FCFCFC] text-[#0048B3] text-[11px] font-medium leading-[13px] flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State Only: Reviews section */}
        {!isPopulated && (
          <div className="w-full flex flex-col gap-[16px] mb-[20px] pt-[8px]">
            <span className="text-[14px] font-medium leading-[20px] text-[#7B7B7B]">
              Reviews
            </span>
            <div className="w-full py-[24px] flex items-center justify-center">
              <p className="text-[16px] font-medium text-[#272931] leading-[19px] text-center">
                No reviews yet.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive "+ Add Work" Modal */}
      <AddPortfolioWorkModal
        isOpen={isAddWorkModalOpen}
        onClose={() => setIsAddWorkModalOpen(false)}
        onWorkAdded={(newBlock) => {
          setWorks((prev) => [newBlock, ...prev]);
        }}
      />
    </div>
  );
};

export default ProfilePortfolioScreen;
