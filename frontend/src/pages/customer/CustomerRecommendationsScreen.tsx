import React from 'react';
import { Loading03Icon } from 'hugeicons-react';
import headerActionsImg from '../../assets/header_actions.png';
import sarahRecAvatar from '../../assets/sarah_recommendation_avatar.png';
import { CandidateCard, CandidateCardProps } from '../../components/ui/CandidateCard';
import { useApp } from '../../context/AppContext';

const RECOMMENDATIONS_DATA: Omit<CandidateCardProps, 'onViewProfile'>[] = [
  {
    id: '1',
    name: 'Sarah Aduloju',
    rating: 4.5,
    role: 'Social Media Manager & Content Creator',
    skills: ['Analytics', 'Content Strategy', 'Instagram'],
    hourlyRate: '₦15,000/hr',
    avatar: sarahRecAvatar,
  },
  {
    id: '2',
    name: 'Sarah Aduloju',
    rating: 4.5,
    role: 'Social Media Manager & Content Creator',
    skills: ['Analytics', 'Content Strategy', 'Instagram'],
    hourlyRate: '₦15,000/hr',
    avatar: sarahRecAvatar,
  },
  {
    id: '3',
    name: 'Sarah Aduloju',
    rating: 4.5,
    role: 'Social Media Manager & Content Creator',
    skills: ['Analytics', 'Content Strategy', 'Instagram'],
    hourlyRate: '₦15,000/hr',
    avatar: sarahRecAvatar,
  },
  {
    id: '4',
    name: 'Sarah Aduloju',
    rating: 4.5,
    role: 'Social Media Manager & Content Creator',
    skills: ['Analytics', 'Content Strategy', 'Instagram'],
    hourlyRate: '₦15,000/hr',
    avatar: sarahRecAvatar,
  },
];

export const CustomerRecommendationsScreen: React.FC = () => {
  const { user, navigateTo } = useApp();

  const displayName = user.fullName ? user.fullName.split(' ')[0] : 'Emmanuel';

  const handleSelectCandidate = () => {
    // Route to Candidate Profile Details
    navigateTo('customer/freelancer-profile');
  };

  return (
    <div className="w-full max-w-[390px] min-h-[807px] bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] relative overflow-y-auto">
      {/* Content Container (358px width - lateral padding 16px) */}
      <div className="w-full max-w-[358px] flex flex-col gap-[16px]">
        {/* Top Header & Search State Stack (Frame 4429 Node 1062:1304) */}
        <div className="w-full flex flex-col gap-[32px]">
          {/* Header Row (Frame 4371 Node 1062:1305) */}
          <header className="w-full flex items-center justify-between">
            {/* Left: Greeting + Subtitle (Frame 48 Node 1062:1306) */}
            <div className="flex flex-col gap-[4px] items-start text-left min-w-0">
              <h1 className="text-[20px] font-medium leading-[24px] tracking-[-0.01em] text-[#272931] whitespace-nowrap">
                Good morning {displayName}
              </h1>
              <p className="text-[14px] font-normal leading-[17px] text-[#272931]/50 whitespace-nowrap">
                How are you doing today
              </p>
            </div>

            {/* Right: Actions (Notification Bell + Avatar - Node 1062:1309) */}
            <button
              type="button"
              onClick={() => console.log('Header action clicked')}
              className="h-[40px] flex items-center shrink-0 outline-none cursor-pointer"
              aria-label="User profile and notifications"
            >
              <img
                src={headerActionsImg}
                alt="User profile and notifications"
                className="h-[40px] object-contain"
              />
            </button>
          </header>

          {/* Sub-Header with Pinwheel Loader (Frame 4428 Node 1062:1315) */}
          <div className="flex items-center gap-[6px] text-left">
            <span className="text-[15px] font-normal leading-[17px] text-[#0D0D0D]">
              Based on your needs
            </span>
            <Loading03Icon
              size={18}
              color="#0D0D0D"
              className="w-[18px] h-[18px] text-[#0D0D0D] animate-spin shrink-0"
            />
          </div>
        </div>

        {/* Section Container (Frame 4438 Node 1062:1501) */}
        <div className="w-full flex flex-col gap-[16px]">
          {/* Sub-copy (Frame 4437 Node 1062:1502) */}
          <div className="w-full text-left">
            <p className="text-[12px] font-normal leading-[13px] text-[#6B7280]">
              Based on your needs, these are recommended fit for your task
            </p>
          </div>

          {/* 2x2 Candidate Cards Grid (Frame 4435 Node 1062:1506 & Node 1062:1533) */}
          <div className="grid grid-cols-2 gap-[12px] w-full">
            {RECOMMENDATIONS_DATA.map((candidate, idx) => (
              <CandidateCard
                key={`${candidate.id}-${idx}`}
                {...candidate}
                onViewProfile={handleSelectCandidate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
