import React from 'react';
import { StarIcon, MoneyBag02Icon } from 'hugeicons-react';

export interface CandidateCardProps {
  id: string;
  name: string;
  rating: number;
  role: string;
  skills: string[];
  hourlyRate: string;
  avatar: string;
  onViewProfile?: () => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  name,
  rating,
  role,
  skills,
  hourlyRate,
  avatar,
  onViewProfile,
}) => {
  return (
    <div className="w-full bg-[#FFFFFF] rounded-[20px] p-[8px] flex flex-col gap-[8px] text-left">
      {/* 1. Photo Container (Node 1062:1534 - 157x125px, rad: 14px) */}
      <div className="w-full h-[125px] rounded-[14px] overflow-hidden bg-gray-100 relative shrink-0">
        <img
          src={avatar}
          alt={name}
          width="157"
          height="125"
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* 2. Information Stack (Auto height hugging content with natural spacing) */}
      <div className="flex flex-col gap-[6px] px-[1px] w-full">
        {/* Name & Star Rating (Node 1062:1537) */}
        <div className="flex items-center justify-between gap-[2px] w-full">
          <span className="text-[12px] font-medium leading-[15px] text-[#000000] truncate">
            {name}
          </span>
          <div className="flex items-center gap-[2px] shrink-0">
            <StarIcon size={10} className="text-[#F59E0B] fill-[#F59E0B]" />
            <span className="text-[8.5px] font-medium text-[#272931]/90 leading-[10px]">
              {rating}
            </span>
          </div>
        </div>

        {/* Role Subtitle (Node 1062:1542) */}
        <p className="text-[9px] font-normal text-[#272931]/90 leading-[12px] line-clamp-1">
          {role}
        </p>

        {/* Skill Tag Badges (Node 1062:1518 - bg: #FCFCFC, rad: 2px, no border, gap: 2px) */}
        <div className="flex items-center gap-[2px] flex-wrap">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-[4px] py-[2px] rounded-[2px] bg-[#FCFCFC] text-[8px] font-medium text-[#0D0D0D] whitespace-nowrap leading-[10px]"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Hourly Rate (Node 1062:1550) */}
        <div className="flex items-center gap-[4px] mt-[1px]">
          <MoneyBag02Icon size={11} color="#0D0D0D" className="shrink-0" />
          <span className="text-[9px] font-medium text-[#0D0D0D] leading-[11px]">
            {hourlyRate}
          </span>
        </div>
      </div>

      {/* 3. Action Button (Node 1062:1555 - 157x25px, rad: 22px) */}
      <button
        type="button"
        onClick={onViewProfile}
        className="w-full h-[26px] rounded-[22px] bg-[#0048B3] text-white text-[9px] font-medium shadow-button-inset flex items-center justify-center cursor-pointer hover:opacity-95 active:scale-95 transition-all outline-none mt-[2px] shrink-0"
      >
        View Profile
      </button>
    </div>
  );
};
