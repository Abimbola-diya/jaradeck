import React from 'react';
import {
  ArrowLeft02Icon,
  StarIcon,
  Location01Icon,
  SentIcon,
} from 'hugeicons-react';
import sarahRecAvatar from '../../assets/sarah_recommendation_avatar.png';
import portfolioWork1 from '../../assets/portfolio_work_1.png';
import portfolioWork2 from '../../assets/portfolio_work_2.png';
import reviewerAvatar from '../../assets/reviewer_avatar.png';
import { useApp } from '../../context/AppContext';

export const CandidateProfileScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const handleBack = () => {
    navigateTo('customer/recommendations');
  };

  const handleMessage = () => {
    // Route to Fresh New Chat Screen
    navigateTo('freelancer/fresh-chat');
  };

  const expertiseTags = [
    'Content Strategy',
    'Community Mgmt',
    'Copywriting',
    'Social Media Analytics',
    'Campaign Planning',
    'TikTok Growth',
  ];

  return (
    <div className="w-full max-w-[390px] min-h-[844px] bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[120px] relative overflow-y-auto">
      {/* Content Container (358px width) */}
      <div className="w-full max-w-[358px] flex flex-col gap-[24px]">
        {/* Header Bar (Figma Node 1032:2241) */}
        <div className="w-full flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20 py-2">
          <button
            type="button"
            onClick={handleBack}
            className="w-[40px] h-[40px] rounded-full bg-[#FCFCFC] border border-[#F3F4F5] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] active:scale-95 transition-all outline-none shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft02Icon size={20} color="#272931" className="w-[20px] h-[20px] shrink-0" />
          </button>

          <h1 className="text-[17px] font-medium leading-[22px] tracking-[-0.01em] text-[#272931] flex-1 ml-[12px] text-left">
            Profile
          </h1>
        </div>

        {/* Profile Summary Card (Figma Node 1032:2209) */}
        <div className="w-full flex items-center gap-[16px] text-left">
          {/* Avatar Photo */}
          <div className="w-[80px] h-[80px] rounded-full overflow-hidden shrink-0 bg-gray-100 border border-[#F3F4F6]">
            <img
              src={sarahRecAvatar}
              alt="Sarah Aduloju"
              width="80"
              height="80"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-[4px] min-w-0 flex-1">
            <h2 className="text-[20px] font-medium leading-[26px] text-[#0D0D0D] truncate">
              Sarah Aduloju
            </h2>
            <p className="text-[12px] font-normal leading-[16px] text-[#6B7280]">
              Senior Content Strategist &amp; Social Media Manager
            </p>

            {/* Rating & Location Row */}
            <div className="flex items-center gap-[12px] mt-[2px]">
              <div className="flex items-center gap-[3px]">
                <StarIcon size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-[11px] font-medium text-[#111827]">4.9</span>
              </div>
              <div className="flex items-center gap-[3px]">
                <Location01Icon size={12} color="#6B7280" />
                <span className="text-[11px] font-normal text-[#6B7280]">Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Sarah CTA (Figma Node 1034:2451) */}
        <button
          type="button"
          onClick={handleMessage}
          className="w-full h-[44px] rounded-[22px] bg-[#0048B3] text-white text-[13px] font-medium shadow-button-inset flex items-center justify-center gap-[8px] hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer outline-none"
        >
          <span>Message Sarah</span>
          <SentIcon size={15} color="#FFFFFF" className="w-[15px] h-[15px]" />
        </button>

        {/* Key Stats Metric Bar (Figma Node 1032:2220) */}
        <div className="w-full flex items-center justify-between border-y border-[#F3F4F6] py-[12px] px-[4px]">
          {/* Stat 1: Earned */}
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-medium leading-[19px] text-[#111827]">₦25K</span>
            <span className="text-[11px] font-normal leading-[15px] text-[#6B7280]">Earned</span>
          </div>

          <div className="w-[1px] h-[24px] bg-[#F3F4F6]" />

          {/* Stat 2: Hired */}
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-medium leading-[19px] text-[#111827]">7x</span>
            <span className="text-[11px] font-normal leading-[15px] text-[#6B7280]">Hired</span>
          </div>

          <div className="w-[1px] h-[24px] bg-[#F3F4F6]" />

          {/* Stat 3: Ratings */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-[2px]">
              <div className="flex text-[#F59E0B]">
                <StarIcon size={10} className="fill-[#F59E0B]" />
                <StarIcon size={10} className="fill-[#F59E0B]" />
                <StarIcon size={10} className="fill-[#F59E0B]" />
                <StarIcon size={10} className="fill-[#F59E0B]" />
              </div>
            </div>
            <span className="text-[11px] font-normal leading-[15px] text-[#6B7280]">Ratings</span>
          </div>

          <div className="w-[1px] h-[24px] bg-[#F3F4F6]" />

          {/* Stat 4: Reviews */}
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-medium leading-[19px] text-[#111827]">20+</span>
            <span className="text-[11px] font-normal leading-[15px] text-[#6B7280]">Reviews</span>
          </div>
        </div>

        {/* About Sarah Section (Figma Node 1034:2629) */}
        <div className="w-full flex flex-col items-start text-left gap-[8px]">
          <h3 className="text-[15px] font-medium leading-[19px] text-[#0D0D0D]">
            About Sarah
          </h3>
          <p className="text-[12px] font-normal leading-[19px] text-[#4B5563]">
            Data-driven content strategist with 5+ years of experience building engaged communities across Instagram, TikTok, and LinkedIn. I specialize in turning complex product messaging into relatable, high-performing social narratives. My approach blends creative copywriting with rigorous analytics to ensure every post drives measurable business impact.
          </p>
        </div>

        {/* Sarah's Expertise Section (Figma Node 1034:2630) */}
        <div className="w-full flex flex-col items-start text-left gap-[10px]">
          <h3 className="text-[15px] font-medium leading-[19px] text-[#0D0D0D]">
            Sarah’s Expertise
          </h3>
          <div className="flex items-center gap-[8px] flex-wrap">
            {expertiseTags.map((tag) => (
              <span
                key={tag}
                className="px-[12px] py-[8px] rounded-[12px] bg-[#FCFCFC] border border-[#F3F4F6] text-[12px] font-medium text-[#272931]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Selected Work Section (Figma Node 1034:2631) */}
        <div className="w-full flex flex-col items-start text-left gap-[14px]">
          <h3 className="text-[15px] font-medium leading-[19px] text-[#0D0D0D]">
            Selected Work
          </h3>

          {/* Work Item 1 */}
          <div className="w-full flex flex-col gap-[8px]">
            <div className="w-full h-[180px] rounded-[16px] overflow-hidden bg-gray-100 border border-[#F3F4F6]">
              <img
                src={portfolioWork1}
                alt="B2B SaaS Launch Campaign"
                width="350"
                height="180"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col gap-[2px]">
              <h4 className="text-[13px] font-medium leading-[17px] text-[#111827]">
                B2B SaaS Launch Campaign
              </h4>
              <p className="text-[11px] font-normal leading-[15px] text-[#6B7280]">
                Orchestrated a 30-day social sprint resulting in a 45% increase in demo requests.
              </p>
            </div>
          </div>

          {/* Work Item 2 */}
          <div className="w-full flex flex-col gap-[8px] mt-[4px]">
            <div className="w-full h-[180px] rounded-[16px] overflow-hidden bg-gray-100 border border-[#F3F4F6]">
              <img
                src={portfolioWork2}
                alt="TikTok Community Growth"
                width="350"
                height="180"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col gap-[2px]">
              <h4 className="text-[13px] font-medium leading-[17px] text-[#111827]">
                TikTok Community Growth
              </h4>
              <p className="text-[11px] font-normal leading-[15px] text-[#6B7280]">
                Grew D2C brand’s organic following from 0 to 50k in 3 months.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Reviews Section (Figma Node 1034:2604) */}
        <div className="w-full flex flex-col items-start text-left gap-[12px]">
          <h3 className="text-[15px] font-medium leading-[19px] text-[#0D0D0D]">
            Recent Reviews
          </h3>

          {/* Review Card 1 */}
          <div className="w-full bg-[#FCFCFC] border border-[#F3F4F6] rounded-[18px] p-[16px] flex flex-col gap-[12px]">
            <p className="text-[12px] font-normal leading-[18px] text-[#272931] italic">
              &ldquo;Sarah completely transformed our social presence. She doesn&apos;t just post content; she builds narratives that resonate. Highly communicative and incredibly sharp.&rdquo;
            </p>
            <div className="flex items-center gap-[10px]">
              <img
                src={reviewerAvatar}
                alt="Alex Mercer"
                width="32"
                height="32"
                className="w-[32px] h-[32px] rounded-full object-cover bg-gray-200"
              />
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#111827]">Alex Mercer</span>
                <span className="text-[10px] font-normal text-[#6B7280]">
                  Marketing Dir., TechFlow
                </span>
              </div>
            </div>
          </div>

          {/* Review Card 2 */}
          <div className="w-full bg-[#FCFCFC] border border-[#F3F4F6] rounded-[18px] p-[16px] flex flex-col gap-[12px]">
            <p className="text-[12px] font-normal leading-[18px] text-[#272931] italic">
              &ldquo;Sarah completely transformed our social presence. She doesn&apos;t just post content; she builds narratives that resonate. Highly communicative and incredibly sharp.&rdquo;
            </p>
            <div className="flex items-center gap-[10px]">
              <img
                src={reviewerAvatar}
                alt="Alex Mercer"
                width="32"
                height="32"
                className="w-[32px] h-[32px] rounded-full object-cover bg-gray-200"
              />
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#111827]">Alex Mercer</span>
                <span className="text-[10px] font-normal text-[#6B7280]">
                  Marketing Dir., TechFlow
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
