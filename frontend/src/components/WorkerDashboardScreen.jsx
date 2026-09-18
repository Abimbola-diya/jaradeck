import React, { useState } from 'react';
import emmanuelImg from '../assets/emmanuel.png';
import jakeTaiwoImg from '../assets/Jake Taiwo.png';
import { useApp } from '../context/AppContext';
import { SwipeableChecklistCard } from './ui/SwipeableChecklistCard';

// Clean Header Actions (Bell icon + Avatar next to each other, matching Figma standard)
function HeaderActions({ user, onProfileClick }) {
  const [imgError, setImgError] = useState(false);
  const avatarSrc = user?.avatar_url || emmanuelImg;

  return (
    <div className="flex items-center gap-[14px]">
      {/* Bare Notification Bell (No circle/pill background) */}
      <button
        type="button"
        aria-label="Notifications"
        className="w-[24px] h-[24px] flex items-center justify-center text-[#141B34] hover:opacity-80 transition-opacity outline-none cursor-pointer p-0 bg-transparent border-0 shrink-0"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 18C15.5 19.933 13.933 21.5 12 21.5C10.067 21.5 8.5 19.933 8.5 18" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19.2311 18H4.76887C3.79195 18 3 17.208 3 16.2311C3 15.762 3.18636 15.3121 3.51809 14.9803L4.12132 14.3771C4.68393 13.8145 5 13.0514 5 12.2558V9.5C5 5.63401 8.13401 2.5 12 2.5C15.866 2.5 19 5.634 19 9.5V12.2558C19 13.0514 19.3161 13.8145 19.8787 14.3771L20.4819 14.9803C20.8136 15.3121 21 15.762 21 16.2311C21 17.208 20.208 18 19.2311 18Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Clean Profile Avatar */}
      <button
        type="button"
        onClick={onProfileClick}
        className="w-[40px] h-[40px] rounded-full overflow-hidden shrink-0 outline-none cursor-pointer border-0 p-0"
        title="Profile & Settings"
      >
        {!imgError ? (
          <img
            src={avatarSrc}
            alt={user?.fullName || 'User avatar'}
            className="w-full h-full object-cover rounded-full"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-[#0048B3] text-white font-medium flex items-center justify-center text-[15px] rounded-full">
            {user?.first_name ? user.first_name[0].toUpperCase() : 'E'}
          </div>
        )}
      </button>
    </div>
  );
}

// Inline Empty State Icon
function FreelancerEmptyIcon() {
  return (
    <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12C5 6 9 6 12 12C15 18 19 18 22 12C25 6 29 6 32 12" stroke="#0D0D0D" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M2 18C5 12 9 12 12 18C15 24 19 24 22 18C25 12 29 12 32 18" stroke="#0048B3" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

export const WorkerDashboardScreen = ({
  initialState,
  initialEmptyState,
}) => {
  const {
    user,
    navigateTo,
    freelancerState,
    updateFreelancerState,
    resetChecklist,
    currentFreelancerStage,
  } = useApp();

  const dashboardState = (() => {
    if (initialState) return initialState;
    if (initialEmptyState === false) return 'active';
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash;
      if (search.includes('state=active') || hash.includes('state=active') || hash.includes('has-project')) {
        return 'active';
      }
      if (search.includes('state=empty') || hash.includes('state=empty') || hash.includes('1584-1557')) {
        return 'empty';
      }
      if (search.includes('state=checklist') || hash.includes('state=checklist') || hash.includes('1637')) {
        return 'checklist';
      }
    }
    return currentFreelancerStage;
  })();

  const displayName = user?.fullName ? user.fullName.split(' ')[0] : (user?.first_name || 'Emmanuel');

  const checklistItems = [
    {
      id: 'verify-email',
      title: 'Verify your email address',
      subtitle: 'Confirm your account via the link sent',
      bgColor: 'bg-[#FFF4F2]',
      deepBgColor: 'bg-[#FF3D00]',
      isDone: freelancerState?.emailVerified ?? false,
      onClick: () => {
        navigateTo('shared/otp-verification');
      },
    },
    {
      id: 'setup-profile',
      title: 'Set up your profile',
      subtitle: 'Finish setting up your profile',
      bgColor: 'bg-[#F0F4FA]',
      deepBgColor: 'bg-[#0048B3]',
      isDone: freelancerState?.profileCompleted ?? false,
      onClick: () => {
        navigateTo('shared/profile-portfolio');
      },
    },
    {
      id: 'payout-details',
      title: 'Add payout details',
      subtitle: 'Provide your payment info to receive funds',
      bgColor: 'bg-[#FFFBF4]',
      deepBgColor: 'bg-[#FEB943]',
      isDone: freelancerState?.payoutsConfigured ?? false,
      onClick: () => {
        navigateTo('shared/payouts');
      },
    },
    {
      id: 'availability',
      title: 'Set your availability status',
      subtitle: 'Update your availability status',
      bgColor: 'bg-[#FFF2F5]',
      deepBgColor: 'bg-[#EC4899]',
      isDone: freelancerState?.availabilitySet ?? false,
      onClick: () => {
        navigateTo('shared/availability');
      },
    },
  ];

  const handleDismissCard = (itemId) => {
    const existing = freelancerState?.dismissedChecklistIds || [];
    if (!existing.includes(itemId)) {
      updateFreelancerState({
        dismissedChecklistIds: [...existing, itemId],
      });
    }
  };

  const dismissedIds = freelancerState?.dismissedChecklistIds || [];
  const visibleChecklistItems = checklistItems.filter(
    (item) => !dismissedIds.includes(item.id)
  );

  // Priority ordering: Next uncompleted item is at the top; completed items move away to the bottom
  const sortedChecklistItems = [...visibleChecklistItems].sort((a, b) => {
    if (a.isDone === b.isDone) return 0;
    return a.isDone ? 1 : -1;
  });

  return (
    <div
      id="worker-dashboard"
      className="w-full max-w-[430px] min-h-[844px] bg-white flex flex-col items-center px-[21px] pt-[60px] pb-[100px] relative overflow-hidden select-none mx-auto"
      style={{
        fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* 1. Header (Greeting + Subtitle & Bare Bell Icon + Avatar) */}
      <header className="w-full flex items-end justify-between">
        <div className="flex flex-col gap-[4px] items-start text-left min-w-0">
          <h1 className="text-[20px] font-medium leading-[24px] tracking-[-0.01em] text-[#272931] whitespace-nowrap">
            Good morning {displayName}
          </h1>
          <p className="text-[14px] font-normal leading-[17px] text-[#272931]/50 whitespace-nowrap">
            How are you doing today
          </p>
        </div>

        <HeaderActions
          user={user}
          onProfileClick={() => navigateTo('shared/profile-portfolio')}
        />
      </header>

      {dashboardState === 'checklist' ? (
        /* 2A. Pre-activation Setup Checklist */
        <div className="w-full flex-1 flex flex-col justify-start pt-[53px] gap-[8px] animate-fadeIn">
          {sortedChecklistItems.length > 0 ? (
            sortedChecklistItems.map((item) => (
              <SwipeableChecklistCard
                key={item.id}
                id={item.id}
                isDone={item.isDone}
                bgColor={item.bgColor}
                deepBgColor={item.deepBgColor}
                title={item.title}
                subtitle={item.subtitle}
                onClick={item.onClick}
                onDismiss={handleDismissCard}
              />
            ))
          ) : (
            <div className="w-full text-center py-[40px] flex flex-col items-center gap-2">
              <FreelancerEmptyIcon />
              <p className="text-[14px] text-gray-700 font-medium mt-2">All tasks completed and cleared!</p>
              <button
                type="button"
                onClick={resetChecklist}
                className="mt-[6px] text-[12px] text-[#0048B3] underline font-medium cursor-pointer"
              >
                Reset Checklist
              </button>
            </div>
          )}
        </div>
      ) : dashboardState === 'empty' ? (
        /* 2B. Empty State Center */
        <div className="w-full flex-1 flex flex-col items-center justify-center -mt-[30px] animate-fadeIn">
          <div className="w-[263px] flex flex-col items-center gap-[16px] text-center">
            <FreelancerEmptyIcon />
            <div className="w-full flex flex-col items-center gap-[4px]">
              <h2 className="text-[14px] font-medium leading-[30px] text-[#0D0D0D] tracking-[-0.01em]">
                No active projects yet
              </h2>
              <p className="text-[12px] font-medium leading-[18px] text-[#7B7B7B] text-center max-w-[263px]">
                You’ll be notified when you’re matched with a project
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Populated Content Stack */
        <div className="w-full flex flex-col gap-[24px] mt-[16px] animate-fadeIn">
          <div className="w-full flex flex-col gap-[8px]">
            {/* Active Project Card */}
            <div className="w-full h-[177px] bg-[#FCFCFC] border border-[#FFFFFF] rounded-[16px] p-[15px_11px_11px_10px] flex flex-col justify-between">
              <h2 className="text-[16px] font-medium leading-[19px] text-[#272931] text-left">
                Active Project
              </h2>

              <div className="w-full flex items-center gap-[12px]">
                <img
                  src={jakeTaiwoImg}
                  alt="Client avatar"
                  className="w-[62px] h-[62px] rounded-full object-cover shrink-0"
                />
                <div className="flex flex-col gap-[6px] items-start text-left">
                  <h3 className="text-[16px] font-medium leading-[19px] text-[#272931]">
                    Social Media Management
                  </h3>
                  <p className="text-[14px] font-normal leading-[17px] text-[#272931]/50">
                    Jake Taiwo
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('freelancer/project-details')}
                className="w-full h-[41px] rounded-[21px] bg-[#0048B3] flex items-center justify-center gap-[4px] text-white text-[12px] font-medium leading-[15px] cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all outline-none"
              >
                View Project Details
              </button>
            </div>

            {/* Overall Activity Card */}
            <div className="w-full h-[127px] bg-[#FCFCFC] border border-[#FFFFFF] rounded-[16px] p-[15px_10px] flex flex-col justify-between">
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
                onClick={() => navigateTo('dashboard/projects')}
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
                onClick={() => navigateTo('dashboard/projects')}
                className="text-[12px] font-medium leading-[14px] text-[#9E9E9E] hover:text-[#0A0A0A] transition-colors outline-none cursor-pointer"
              >
                See all
              </button>
            </div>

            <div className="w-full flex flex-col gap-[16px]">
              {[1, 2, 3].map((item) => (
                <div key={item} className="w-full h-[62px] flex items-center gap-[12px]">
                  <img
                    src={jakeTaiwoImg}
                    alt="Client avatar"
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
