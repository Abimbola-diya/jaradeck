import React, { useState } from 'react';
import { ArrowRight02Icon } from 'hugeicons-react';
import { JaradeckLogo } from '../../components/ui/JaradeckLogo';
import { InputField } from '../../components/ui/InputField';
import { useApp } from '../../context/AppContext';

export const CustomerSignUpScreen: React.FC = () => {
  const { updateUser, navigateTo } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ fullName, email });
    navigateTo('shared/otp-verification');
  };

  const handleSignIn = () => {
    navigateTo('shared/role-selection');
  };

  return (
    <div className="w-full max-w-[390px] min-h-[844px] bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[40px] relative">
      {/* Frame 3 (358px Content Container) */}
      <form onSubmit={handleSubmit} className="w-full max-w-[358px] flex flex-col">
        {/* Frame 8 (Upper Section: Header + Form Inputs) */}
        <div className="w-full flex flex-col gap-[24px]">
          {/* Frame 1 (Header Block) */}
          <div className="w-full flex flex-col items-center gap-[32px]">
            {/* Logo I (Figma Node 775:391) */}
            <div className="w-[34px] h-[24px] flex items-center justify-center">
              <JaradeckLogo size="md" interactive={true} enableTilt={true} enableFloating={true} />
            </div>

            {/* Frame 892 (Title + Customer Subtitle) */}
            <div className="w-full flex flex-col gap-[16px] items-start text-left">
              <h1 className="w-full text-[34px] font-medium leading-[37px] tracking-[-0.02em] text-[#0A0A0A]">
                Let's set up your profile
              </h1>
              <p className="w-full text-[14px] font-normal leading-[17px] text-[#3D3D3D]">
                Enter a few details so we can manage your projects and send updates.
              </p>
            </div>
          </div>

          {/* Frame 7 (Form Fields Stack - 3 fields) */}
          <div className="w-full flex flex-col gap-[24px]">
            {/* Full Name (Figma Node 774:90) */}
            <InputField
              label="Full Name"
              placeholder="Your full name"
              value={fullName}
              onChange={setFullName}
              type="text"
            />

            {/* Email Address (Figma Node 774:94) */}
            <InputField
              label="Email Address"
              placeholder="example@gmail.com"
              value={email}
              onChange={setEmail}
              type="email"
              showEyeToggle={true}
            />

            {/* Password (Figma Node 774:111) */}
            <InputField
              label="Password"
              placeholder="example@gmail.com"
              value={password}
              onChange={setPassword}
              type="password"
              showEyeToggle={true}
            />
          </div>
        </div>

        {/* Frame 9 (Bottom Action Block with 120px offset) */}
        <div className="w-full mt-[120px] flex flex-col items-center gap-[16px]">
          {/* Primary Continue Button (Figma Node 774:102) */}
          <button
            type="submit"
            className="w-full h-[44px] rounded-[22px] bg-[#0048B3] shadow-button-inset flex items-center justify-center gap-[4px] cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all outline-none"
          >
            <span className="text-white text-[14px] font-medium leading-[15px] text-center">
              Continue to Jaradeck
            </span>
            <ArrowRight02Icon
              size={14}
              color="#FFFFFF"
              className="w-[14px] h-[14px] text-white shrink-0"
            />
          </button>

          {/* Footer Text Link (Figma Node 774:107) */}
          <div className="text-[14px] font-normal leading-[15px] text-center text-[#3D3D3D]">
            Already on Jaradeck?{' '}
            <button
              type="button"
              onClick={handleSignIn}
              className="text-[#0048B3] font-medium hover:underline cursor-pointer outline-none inline-block"
            >
              Sign in
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
