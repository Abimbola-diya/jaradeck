import React from 'react';

interface RoleCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  id,
  title,
  description,
  icon,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`w-full h-[120px] p-[12px] rounded-[12px] flex flex-col justify-between items-start text-left transition-all duration-150 outline-none select-none cursor-pointer touch-manipulation active:scale-[0.98] ${
        isSelected
          ? 'bg-[#0048B3] shadow-role-active text-white'
          : 'bg-[#FAFAFA] text-[#0A0A0A] hover:bg-[#F2F2F2] active:bg-[#ECECEC]'
      }`}
    >
      <div className="w-[24px] h-[24px] flex items-center justify-center">
        {icon}
      </div>

      <div className="w-full flex flex-col gap-[4px]">
        <h3
          className={`text-[16px] font-medium leading-[19px] tracking-[-0.01em] ${
            isSelected ? 'text-white' : 'text-[#0A0A0A]'
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-[12px] font-normal leading-[15px] ${
            isSelected ? 'text-white/80' : 'text-[#7B7B7B]'
          }`}
        >
          {description}
        </p>
      </div>
    </button>
  );
};
