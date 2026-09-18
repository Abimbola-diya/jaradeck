import React, { useState } from 'react';
import { ViewIcon, ViewOffSlashIcon } from 'hugeicons-react';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password';
  showEyeToggle?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  showEyeToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const effectiveType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-[8px] items-start">
      <label className="text-[14px] font-normal leading-[17px] text-[#0A0A0A]">
        {label}
      </label>
      <div className="w-full h-[50px] bg-[#FAFAFA] rounded-[10px] px-[16px] flex items-center justify-between border border-transparent focus-within:border-[#0048B3]/30 transition-all">
        <input
          type={effectiveType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent text-[14px] text-[#0A0A0A] placeholder-[#3D3D3D] outline-none font-normal leading-[15px]"
        />
        {showEyeToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[#3D3D3D] hover:text-[#0A0A0A] transition-colors p-1 ml-2 shrink-0 outline-none"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <ViewOffSlashIcon size={14} className="w-[14px] h-[14px]" />
            ) : (
              <ViewIcon size={14} className="w-[14px] h-[14px]" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
