import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown01Icon } from 'hugeicons-react';

export const SelectField = ({
  label,
  value,
  options = [],
  onChange,
  rounded = 'rounded-[20px]',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full flex flex-col gap-[8px] relative" ref={containerRef}>
      {label && (
        <label className="text-[14px] font-medium leading-[20px] text-[#7B7B7B]">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full min-h-[52px] bg-[#FDFDFD] border border-[#F3F4F6] ${rounded} px-[16px] py-[14px] flex items-center justify-between cursor-pointer outline-none hover:bg-gray-50 transition-colors`}
      >
        <span className="text-[14px] font-medium text-[#0D0D0D]">
          {value}
        </span>
        <ArrowDown01Icon
          size={18}
          color="#6B7280"
          className={`transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[100%] left-0 right-0 z-30 mt-[4px] bg-white border border-[#E5E7EB] rounded-[16px] shadow-lg max-h-[220px] overflow-y-auto py-1">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                if (onChange) onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full px-[16px] py-[12px] text-left text-[14px] hover:bg-[#F9FAFB] transition-colors cursor-pointer block ${
                value === opt ? 'font-medium text-[#0048B3] bg-[#EFF6FF]' : 'text-[#374151]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectField;
