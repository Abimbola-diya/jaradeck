import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft02Icon,
  Wallet02Icon,
  BankIcon,
  Invoice01Icon,
} from "hugeicons-react";

interface LocationState {
  withdrawalAmount?: number;
}

export const ConfirmWithdrawScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // Retrieve the passed amount, or default to 20000 if directly navigated
  const amount =
    state?.withdrawalAmount && state.withdrawalAmount > 0
      ? state.withdrawalAmount
      : 20000;

  const fee = amount * 0.035;

  const formattedAmount =
    "₦" +
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formattedFee =
    "₦" +
    fee.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Preserve query parameters (e.g., ?role=freelancer)
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");
  const roleQuery = roleParam ? `?role=${roleParam}` : "";

  const handleBack = () => {
    navigate(-1);
  };

  const handleConfirm = () => {
    let targetPath = "/dashboard/wallet/enter-pin";
    if (location.pathname.includes("/freelancer")) {
      targetPath = "/dashboard/freelancer/enter-pin";
    } else if (location.pathname.includes("/customer")) {
      targetPath = "/dashboard/customer/enter-pin";
    }

    // Pass the withdrawal amount forward to the PIN screen
    navigate(`${targetPath}${roleQuery}`, {
      state: { withdrawalAmount: amount },
    });
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] mx-auto relative overflow-x-hidden">
      {/* Content Container (358px width) */}
      <div className="w-full max-w-[358px] flex flex-col items-center justify-between h-full min-h-[540px]">
        {/* Upper Stack (Header + Amount Summary + Details List) */}
        <div className="w-full flex flex-col items-center gap-[40px]">
          {/* Header Navigation */}
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

            {/* Centered Title */}
            <h1 className="text-[17px] font-medium leading-[22px] tracking-[-0.01em] text-[#272931] text-center">
              Confirm withdrawal
            </h1>
          </div>

          {/* Amount Display Block */}
          <div className="flex flex-col items-center gap-[8px] mt-[8px]">
            <span className="text-[14px] font-medium leading-[17px] text-[#272931]">
              Amount
            </span>
            <span className="text-[36px] font-medium leading-[43px] tracking-[-0.02em] text-[#0D0D0D]">
              {formattedAmount}
            </span>
          </div>

          {/* Details List */}
          <div className="w-full flex flex-col">
            {/* Row 1: From */}
            <div className="w-full h-[52px] px-[4px] flex items-center justify-between border-b border-[#E5E7EB]">
              <div className="flex items-center gap-[12px]">
                <Wallet02Icon
                  size={20}
                  color="#6B7280"
                  className="w-[20px] h-[20px] shrink-0"
                />
                <span className="text-[14px] font-medium leading-[24px] text-[#6B7280]">
                  From
                </span>
              </div>
              <span className="text-[14px] font-medium leading-[24px] text-[#000000]">
                Jaradeck Wallet
              </span>
            </div>

            {/* Row 2: To */}
            <div className="w-full h-[52px] px-[4px] flex items-center justify-between border-b border-[#E5E7EB]">
              <div className="flex items-center gap-[12px]">
                <BankIcon
                  size={20}
                  color="#6B7280"
                  className="w-[20px] h-[20px] shrink-0"
                />
                <span className="text-[14px] font-medium leading-[24px] text-[#6B7280]">
                  To
                </span>
              </div>
              <span className="text-[14px] font-medium leading-[24px] text-[#272931]">
                Ali Mayo........1234
              </span>
            </div>

            {/* Row 3: Fee (3.5%) */}
            <div className="w-full h-[52px] px-[4px] flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <Invoice01Icon
                  size={20}
                  color="#6B7280"
                  className="w-[20px] h-[20px] shrink-0"
                />
                <span className="text-[14px] font-medium leading-[24px] text-[#6B7280]">
                  Fee (3.5%)
                </span>
              </div>
              <span className="text-[14px] font-medium leading-[24px] text-[#6E6E6E]">
                {formattedFee}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full mt-[40px]">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full h-[44px] rounded-[22px] bg-[#0048B3] text-white text-[14px] font-medium transition-all shadow-button-inset flex items-center justify-center cursor-pointer hover:opacity-95 active:scale-[0.99] outline-none"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmWithdrawScreen;
