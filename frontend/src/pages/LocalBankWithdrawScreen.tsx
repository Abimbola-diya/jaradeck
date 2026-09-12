import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft02Icon,
  ArrowUpDownIcon,
  CancelSquareIcon,
} from "hugeicons-react";
import zenithBankLogo from "../assets/zenith_bank_logo.png";

export const LocalBankWithdrawScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [amountStr, setAmountStr] = useState<string>("");
  const [isKeypadOpen, setIsKeypadOpen] = useState<boolean>(false);

  // Preserve role parameter or route prefix if present
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");
  const roleQuery = roleParam ? `?role=${roleParam}` : "";

  const handleBack = () => {
    navigate(-1);
  };

  const handleKeyPress = (digit: string) => {
    if (amountStr.length >= 9) return;
    if (amountStr === "" && digit === "0") return;
    setAmountStr((prev) => prev + digit);
  };

  const handleDelete = () => {
    setAmountStr((prev) => prev.slice(0, -1));
  };

  const formattedAmount =
    amountStr === "" ? "" : "₦" + Number(amountStr).toLocaleString("en-US");

  const isValidAmount = Number(amountStr) > 0;

  const handleConfirm = () => {
    if (!isValidAmount) return;

    // Build route based on role path structure
    let targetPath = "/dashboard/wallet/confirm-withdraw";
    if (location.pathname.includes("/freelancer")) {
      targetPath = "/dashboard/freelancer/confirm-withdraw";
    } else if (location.pathname.includes("/customer")) {
      targetPath = "/dashboard/customer/confirm-withdraw";
    }

    // Pass the withdrawal amount using router state
    navigate(`${targetPath}${roleQuery}`, {
      state: { withdrawalAmount: Number(amountStr) },
    });
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] mx-auto relative overflow-x-hidden">
      {/* Content Container (358px width) */}
      <div className="w-full max-w-[358px] flex flex-col items-center justify-between h-full min-h-[660px]">
        {/* Upper Stack (Header + Directional Flow + Bank Card) */}
        <div className="w-full flex flex-col items-center gap-[16px]">
          {/* Header Bar */}
          <div className="w-full relative flex items-center justify-center min-h-[40px]">
            <button
              type="button"
              onClick={handleBack}
              className="absolute left-0 w-[40px] h-[40px] rounded-full bg-[#FCFCFC] border border-[#F3F4F5] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] active:scale-95 transition-all outline-none"
              aria-label="Go back"
            >
              <ArrowLeft02Icon
                size={20}
                color="#272931"
                className="w-[20px] h-[20px] shrink-0"
              />
            </button>

            {/* Title */}
            <h1 className="text-[17px] font-medium leading-[22px] tracking-[-0.01em] text-[#272931] text-center">
              Withdraw to local bank
            </h1>
          </div>

          {/* Directional Transfer Indicator */}
          <div className="w-[24px] h-[24px] flex items-center justify-center text-[#272931] my-2">
            <ArrowUpDownIcon size={22} color="#272931" className="shrink-0" />
          </div>

          {/* Bank Account Details Card */}
          <div className="h-[49px] bg-[#FCFCFC] border border-[#F0F0F0] rounded-[12px] px-[12px] py-[5px] flex items-center gap-[12px]">
            <img
              src={zenithBankLogo}
              alt="Zenith Bank"
              width="24"
              height="24"
              className="w-[24px] h-[24px] object-contain shrink-0"
            />
            <div className="flex flex-col items-start text-left">
              <span className="text-[14px] font-medium leading-[17px] text-[#272931]">
                12321245472
              </span>
              <span className="text-[10px] font-normal leading-[12px] text-[#272931]/50">
                Zenith Bank
              </span>
            </div>
          </div>
        </div>

        {/* Amount Input Display */}
        <button
          type="button"
          onClick={() => setIsKeypadOpen(true)}
          className={`w-full flex flex-col items-center justify-center min-h-[64px] my-[16px] p-2 rounded-[16px] transition-all outline-none cursor-pointer ${
            isKeypadOpen
              ? "bg-gray-50/40"
              : "hover:bg-gray-50/80 active:scale-[0.99]"
          }`}
          aria-label="Tap to enter amount"
        >
          {amountStr === "" ? (
            <div className="flex items-center gap-1">
              <span className="text-[36px] font-medium leading-[43px] text-[#9E9E9E] animate-pulse">
                |
              </span>
              {!isKeypadOpen && (
                <span className="text-[14px] font-normal text-[#9E9E9E] ml-2">
                  Tap to enter amount
                </span>
              )}
            </div>
          ) : (
            <span className="text-[36px] font-medium leading-[43px] tracking-[-0.02em] text-[#0D0D0D]">
              {formattedAmount}
            </span>
          )}
        </button>

        {/* Action Button & Numeric Keypad Stack */}
        <div className="w-full flex flex-col gap-[20px] items-center">
          {/* Confirm Button */}
          <button
            type="button"
            disabled={!isValidAmount}
            onClick={handleConfirm}
            className={`w-full h-[44px] rounded-[22px] flex items-center justify-center text-[14px] font-medium transition-all shadow-button-inset outline-none ${
              isValidAmount
                ? "bg-[#0048B3] text-white cursor-pointer hover:opacity-95 active:scale-[0.99]"
                : "bg-[#CFCFCF] text-white cursor-not-allowed opacity-90"
            }`}
          >
            Confirm
          </button>

          {/* Numeric Keypad Grid */}
          {isKeypadOpen && (
            <div className="w-full max-w-[285px] grid grid-cols-3 gap-x-[24px] gap-y-[12px] animate-fadeIn transition-all">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalBankWithdrawScreen;
