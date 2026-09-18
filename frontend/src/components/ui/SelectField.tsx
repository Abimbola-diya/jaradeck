import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options?: (string | SelectOption)[];
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  defaultOpen?: boolean;
  isOpenControlled?: boolean;
  maxMenuHeight?: string;
}

export const DropdownChevronIcon: React.FC<{ className?: string; isOpen?: boolean }> = ({
  className = 'w-[20px] h-[20px]',
  isOpen = false,
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isOpen ? 'rotate-180' : 'rotate-0'
    } ${className}`}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.89873 14.0581C9.6971 14.151 9.51607 14.2833 9.36627 14.4471C9.21647 14.611 9.10091 14.8031 9.02639 15.0123C8.95187 15.2214 8.91988 15.4433 8.9323 15.665C8.94472 15.8866 9.00131 16.1036 9.09873 16.3031C9.22539 16.5564 10.3987 17.7664 14.1821 21.5431C18.9504 26.3047 19.1121 26.4581 19.4621 26.5597C19.6621 26.6181 19.9037 26.6664 20.0004 26.6664C20.0971 26.6664 20.3387 26.6181 20.5387 26.5597C20.8887 26.4581 21.0504 26.3047 25.8187 21.5431C29.6021 17.7664 30.7754 16.5564 30.9021 16.3031C30.9995 16.1036 31.0561 15.8866 31.0685 15.665C31.0809 15.4433 31.0489 15.2214 30.9744 15.0123C30.8999 14.8031 30.7843 14.611 30.6345 14.4471C30.4847 14.2833 30.3037 14.151 30.1021 14.0581C29.7354 13.8914 29.1204 13.8964 28.7337 14.0714C28.5037 14.1747 27.4487 15.1897 24.2171 18.4181L20.0004 22.6314L15.7837 18.4181C12.5521 15.1897 11.4971 14.1747 11.2671 14.0714C10.8804 13.8964 10.2654 13.8914 9.89873 14.0581Z"
      fill="#7B7B7B"
    />
  </svg>
);

export const SelectField: React.FC<SelectFieldProps> = ({
  label = 'Primary Skill',
  placeholder = 'What’s your strongest skill',
  value = '',
  options = [
    'Product Design',
    'Software Development',
    'Content Creation',
  ],
  onChange,
  className = '',
  disabled = false,
  defaultOpen = false,
  isOpenControlled,
  maxMenuHeight,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isOpenControlled !== undefined ? isOpenControlled : internalOpen;
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpenControlled === undefined) {
          setInternalOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpenControlled]);

  const handleToggle = () => {
    if (disabled) return;
    if (isOpenControlled === undefined) {
      setInternalOpen((prev) => !prev);
    }
  };

  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    onChange?.(optionValue);
    if (isOpenControlled === undefined) {
      setInternalOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col gap-[8px] items-start select-none ${className}`}
      data-node-id="1417:1456"
    >
      {/* Label (Figma Node 1417:1457) */}
      {label && (
        <label
          className="w-full text-[14px] font-medium leading-[30px] text-[#7B7B7B] tracking-normal block transition-colors duration-200"
          data-node-id="1417:1457"
        >
          {label}
        </label>
      )}

      {/* Frame 4465 (Figma Node 1417:1458) - Trigger + Menu Stack */}
      <div className="w-full flex flex-col items-start relative" data-node-id="1417:1458">
        {/* Select Box Frame 4422 (Figma Node 1417:1459) */}
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          tabIndex={disabled ? -1 : 0}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            } else if (e.key === 'Escape') {
              if (isOpenControlled === undefined) setInternalOpen(false);
            }
          }}
          className={`w-full h-[48px] bg-[#FDFDFD] rounded-[20px] px-[16px] flex items-center justify-between cursor-pointer outline-none transition-all duration-200 ease-out active:scale-[0.995] ${
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#F9F9F9] focus-visible:ring-2 focus-visible:ring-gray-200'
          }`}
          data-node-id="1417:1459"
        >
          {/* Placeholder / Selected Text (Figma Node 1417:1465) */}
          <span
            className={`text-[14px] font-medium leading-[30px] truncate pointer-events-none transition-colors duration-200 ${
              displayLabel ? 'text-[#0A0A0A]' : 'text-[#9E9E9E]'
            }`}
            data-node-id="1417:1465"
          >
            {displayLabel || placeholder}
          </span>

          {/* Dropdown Chevron Icon (Figma Node 1417:1466) */}
          <DropdownChevronIcon isOpen={isOpen} />
        </div>

        {/* Options Dropdown Menu Frame 4423 (Figma Node 1417:1469) with fluid CSS Grid accordion animation */}
        <div
          className={`grid w-full transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen
              ? 'grid-rows-[1fr] opacity-100 mt-[4px] pointer-events-auto'
              : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden">
            <ul
              role="listbox"
              className={`w-full bg-[#FDFDFD] rounded-[20px] p-[16px] flex flex-col gap-[16px] items-start select-none shadow-none transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                maxMenuHeight ? `${maxMenuHeight} overflow-y-auto` : ''
              }`}
              style={{
                transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.99)',
              }}
              data-node-id="1417:1469"
            >
              {normalizedOptions.map((opt, index) => {
                const isSelected = opt.value === value;
                const nodeId = index === 0 ? '1417:1471' : index === 1 ? '1417:1473' : '1417:1475';
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      transitionDelay: isOpen ? `${index * 35}ms` : '0ms',
                    }}
                    className={`w-full h-[30px] flex items-center px-2 -mx-2 rounded-[10px] text-[14px] font-medium leading-[30px] cursor-pointer transition-all duration-200 ease-out active:scale-[0.99] ${
                      isSelected
                        ? 'text-[#0A0A0A] bg-[#F2F4F7] font-medium'
                        : 'text-[#7B7B7B] hover:text-[#0A0A0A] hover:bg-[#F2F4F7]/50'
                    } ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
                    data-node-id={nodeId}
                  >
                    <span className="truncate">{opt.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
