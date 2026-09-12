import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft02Icon } from "hugeicons-react";
import withdrawBankImg from "../assets/withdraw_bank_icon.png";
import withdrawStablecoinsImg from "../assets/withdraw_stablecoins_icon.png";

export const WithdrawOptionsScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Preserve role parameter or route subpath if present
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");
  const roleQuery = roleParam ? `?role=${roleParam}` : "";

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectBank = () => {
    if (location.pathname.includes("/freelancer")) {
      navigate(`/dashboard/freelancer/withdraw-bank${roleQuery}`);
    } else if (location.pathname.includes("/customer")) {
      navigate(`/dashboard/customer/withdraw-bank${roleQuery}`);
    } else {
      navigate(`/dashboard/wallet/withdraw-bank${roleQuery}`);
    }
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] mx-auto relative overflow-x-hidden">
      {/* Content Container (358px width) */}
      <div className="w-full max-w-[358px] flex flex-col gap-[24px]">
        {/* Header Navigation */}
        <div className="w-full flex items-center">
          <button
            type="button"
            onClick={handleBack}
            className="w-[40px] h-[40px] rounded-full bg-[#F3F4F5] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] active:scale-95 transition-all shrink-0 outline-none"
            aria-label="Go back"
          >
            <ArrowLeft02Icon
              size={20}
              color="#272931"
              className="w-[20px] h-[20px] shrink-0"
            />
          </button>
        </div>

        {/* Withdraw Options Stack */}
        <div className="w-full flex flex-col gap-[16px] mt-[8px]">
          {/* Option 1: Withdraw to your local bank */}
          <button
            type="button"
            onClick={handleSelectBank}
            className="w-full h-[85px] bg-[#FCFCFC] border border-[#FCFCFC] rounded-[15px] p-[15px] flex items-center justify-between text-left hover:bg-[#F7F7F7] active:scale-[0.99] transition-all outline-none cursor-pointer group"
          >
            <div className="flex flex-col gap-[4px] items-start">
              <h2 className="text-[16px] font-medium leading-[19px] text-[#272931] group-hover:text-[#0048B3] transition-colors">
                Withdraw to your local bank
              </h2>
              <p className="text-[13px] font-normal leading-[16px] text-[#272931]/50 max-w-[215px]">
                Send money directly into your local bank account
              </p>
            </div>

            <div className="w-[48px] h-[48px] rounded-full bg-[#FEFEFE] flex items-center justify-center shrink-0">
              <img
                src={withdrawBankImg}
                alt="Local bank withdrawal"
                width="48"
                height="48"
                className="w-[48px] h-[48px] object-contain"
              />
            </div>
          </button>

          {/* Option 2: Stablecoins */}
          <div className="w-full h-[78px] bg-[#FCFCFC] border border-[#FCFCFC] rounded-[15px] p-[15px] flex items-center justify-between text-left select-none opacity-80">
            <div className="flex flex-col gap-[4px] items-start">
              <h2 className="text-[16px] font-medium leading-[19px] text-[#272931]">
                Stablecoins
              </h2>
              <p className="text-[13px] font-normal leading-[16px] text-[#272931]/50">
                Coming soon
              </p>
            </div>

            <div className="w-[48px] h-[48px] rounded-full bg-[#FEFEFE] flex items-center justify-center shrink-0">
              <img
                src={withdrawStablecoinsImg}
                alt="Stablecoins withdrawal"
                width="48"
                height="48"
                className="w-[48px] h-[48px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawOptionsScreen;
