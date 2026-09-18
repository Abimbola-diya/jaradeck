import React from 'react';
import { ArrowRight02Icon } from 'hugeicons-react';
import googleIcon from '../../assets/google-symbol.svg';

interface ActionButtonsProps {
  onSignUp: () => void;
  onGoogleSignIn: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSignUp,
  onGoogleSignIn,
}) => {
  return (
    <div className="w-full flex flex-col gap-[12px]">
      {/* Primary Sign Up Button (Figma Node 775:606) */}
      <button
        type="button"
        onClick={onSignUp}
        className="w-full h-[44px] rounded-[22px] bg-[#0048B3] shadow-button-inset flex items-center justify-center gap-[4px] cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all outline-none"
      >
        <span className="text-white text-[14px] font-medium leading-[15px] text-center">
          Sign up
        </span>
        <ArrowRight02Icon
          size={14}
          color="#FFFFFF"
          className="w-[14px] h-[14px] text-white shrink-0"
        />
      </button>

      {/* Secondary Continue with Google Button (Figma Node 775:611) */}
      <button
        type="button"
        onClick={onGoogleSignIn}
        className="w-full h-[44px] rounded-[22px] bg-[#FAFAFA] shadow-button-inset flex items-center justify-center gap-[8px] cursor-pointer hover:bg-[#F2F2F2] active:scale-[0.99] transition-all outline-none"
      >
        <img
          src={googleIcon}
          alt="Google logo"
          width="16"
          height="16"
          className="w-[16px] h-[16px] object-contain shrink-0"
        />
        <span className="text-[#0A0A0A] text-[14px] font-medium leading-[15px] text-center">
          Continue with Google
        </span>
      </button>
    </div>
  );
};
