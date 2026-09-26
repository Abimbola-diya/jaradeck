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
    <div className="w-full flex flex-col gap-[8px]" ref={containerRef}>
      {label && (
        <label className="text-[14px] font-medium leading-[20px] text-[#7B7B7B]">
          {label}
        </label>
      )}

      {!isOpen ? (
        /* Closed State */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`w-full min-h-[52px] bg-[#FDFDFD] border border-[#F3F4F6] ${rounded} px-[16px] py-[14px] flex items-center justify-between cursor-pointer outline-none hover:bg-gray-50 transition-colors`}
        >
          <span className="text-[14px] font-medium text-[#0D0D0D]">
            {value}
          </span>
          <ArrowDown01Icon
            size={18}
            color="#6B7280"
            className="transition-transform duration-200 shrink-0"
          />
        </button>
      ) : (
        /* Open Inline State (elongates downward inside natural DOM layout flow) */
        <div className={`w-full bg-[#FDFDFD] border border-[#F3F4F6] ${rounded} p-[12px] flex flex-col gap-[8px] transition-all duration-200`}>
          {/* Header Row when open */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full px-[4px] py-[4px] flex items-center justify-between cursor-pointer outline-none"
          >
            <span className="text-[14px] font-medium text-[#0D0D0D]">
              {value}
            </span>
            <ArrowDown01Icon
              size={18}
              color="#6B7280"
              className="rotate-180 transition-transform duration-200 shrink-0"
            />
          </button>

          {/* Inline Options List */}
          <div className="w-full flex flex-col gap-[4px] pt-[4px]">
            {options.map((opt) => {
              const isSelected = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (onChange) onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full px-[16px] py-[12px] text-left text-[14px] rounded-[16px] transition-colors cursor-pointer block ${
                    isSelected
                      ? 'font-medium text-[#0D0D0D] bg-[#F3F4F6]'
                      : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#0D0D0D]'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectField;

