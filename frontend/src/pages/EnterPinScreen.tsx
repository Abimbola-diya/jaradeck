import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft02Icon, CancelSquareIcon } from "hugeicons-react";

interface LocationState {
  withdrawalAmount?: number;
}

export const EnterPinScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [pin, setPin] = useState<string>("");
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);

  // Preserve role query parameter if present
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");
  const roleQuery = roleParam ? `?role=${roleParam}` : "";

  const handleBack = () => {
    navigate(-1);
  };

  const handleKeyPress = (digit: string) => {
    if (pin.length >= 4 || isAuthorizing) return;
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      setIsAuthorizing(true);
      setTimeout(() => {
        setIsAuthorizing(false);

        let targetPath = "/dashboard/wallet/withdraw-success";
        if (location.pathname.includes("/freelancer")) {
          targetPath = "/dashboard/freelancer/withdraw-success";
        } else if (location.pathname.includes("/customer")) {
          targetPath = "/dashboard/customer/withdraw-success";
        }

        navigate(`${targetPath}${roleQuery}`, {
          state: { withdrawalAmount: state?.withdrawalAmount },
        });
      }, 800);
    }
  };

  const handleDelete = () => {
    if (isAuthorizing) return;
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] mx-auto relative overflow-x-hidden">
      {/* Content Container (358px width) */}
      <div className="w-full max-w-[358px] flex flex-col items-center justify-between h-full min-h-[580px]">
        {/* Upper Stack (Header + Title + Subtitle + PIN Indicator) */}
        <div className="w-full flex flex-col items-start gap-[24px]">
          {/* Header Navigation */}
          <div className="w-full flex items-center">
            <button
              type="button"
              onClick={handleBack}
              className="w-[40px] h-[40px] rounded-full bg-[#FCFCFC] border border-[#F3F4F5] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] active:scale-95 transition-all outline-none"
              aria-label="Go back"
            >
              <ArrowLeft02Icon
                size={20}
                color="#272931"
                className="w-[20px] h-[20px] shrink-0"
              />
            </button>
          </div>

          {/* Heading & Subtitle Block */}
          <div className="w-full flex flex-col items-start gap-[8px] text-left">
            <h1 className="text-[20px] font-medium leading-[24px] tracking-[-0.01em] text-[#272931]">
              Enter your PIN
            </h1>
            <p className="text-[14px] font-normal leading-[18px] text-[#272931]/50">
              Please enter your 4 - digit security PIN to authorize this
              withdrawal
            </p>
          </div>

          {/* 4-Digit PIN Indicator Dots */}
          <div className="w-full flex items-center justify-center gap-[24px] py-[32px]">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = index < pin.length;
              return (
                <div
                  key={index}
                  className={`w-[16px] h-[16px] rounded-full transition-all duration-200 ${
                    isFilled
                      ? "bg-[#0048B3] scale-110"
                      : "border-2 border-[#CFCFCF] bg-transparent"
                  }`}
                />
              );
            })}
          </div>

          {/* Authorization Status Indicator */}
          {isAuthorizing && (
            <div className="w-full flex items-center justify-center text-[13px] font-medium text-[#0048B3] animate-pulse">
              Authorizing withdrawal...
            </div>
          )}
        </div>

        {/* Numeric Keypad Grid */}
        <div className="w-full max-w-[285px] grid grid-cols-3 gap-x-[24px] gap-y-[12px] mt-auto pb-[12px]">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="w-[79px] h-[58px] rounded-[12px] flex items-center justify-center text-[24px] font-medium text-[#0D0D0D] cursor-pointer hover:bg-gray-100/60 active:scale-90 active:bg-gray-200/80 transition-all outline-none"
            >
              {digit}
            </button>
          ))}

          {/* Empty Spacer */}
          <div className="w-[79px] h-[58px]" />

          {/* Zero Digit */}
          <button
            type="button"
            onClick={() => handleKeyPress("0")}
            className="w-[79px] h-[58px] rounded-[12px] flex items-center justify-center text-[24px] font-medium text-[#0D0D0D] cursor-pointer hover:bg-gray-100/60 active:scale-90 active:bg-gray-200/80 transition-all outline-none"
          >
            0
          </button>

          {/* Backspace / Delete Key */}
          <button
            type="button"
            onClick={handleDelete}
            className="w-[79px] h-[58px] rounded-[12px] flex items-center justify-center text-[#0D0D0D] cursor-pointer hover:bg-gray-100/60 active:scale-90 active:bg-gray-200/80 transition-all outline-none"
            aria-label="Delete last digit"
          >
            <CancelSquareIcon
              size={24}
              color="#0D0D0D"
              className="w-[24px] h-[24px]"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterPinScreen;
