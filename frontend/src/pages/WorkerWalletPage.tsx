import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft02Icon,
  ViewIcon,
  ViewOffSlashIcon,
  SentIcon,
} from "hugeicons-react";
import logoImg from "../assets/logo_i.svg";
import WorkerBottomNav from "../components/WorkerBottomNav";

export const WorkerWalletScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [historyTab, setHistoryTab] = useState<"completed" | "pending">(
    "pending",
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleWithdraw = () => {
    navigate("/dashboard/wallet/withdraw");
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[110px] mx-auto relative overflow-x-hidden">
      {/* Content Container (358px width) */}
      <div className="w-full max-w-[358px] flex flex-col gap-[32px]">
        {/* Header Navigation */}
        <div className="w-full flex items-center gap-[16px]">
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

          <div className="flex flex-col gap-[2px] items-start text-left">
            <h1 className="text-[17px] font-medium leading-[22px] tracking-[-0.01em] text-[#272931]">
              Your Wallet
            </h1>
            <p className="text-[13px] font-normal leading-[16px] text-[#272931]/50">
              Your money, in safe hands
            </p>
          </div>
        </div>

        {/* Total Balance & Withdraw Block */}
        <div className="w-full flex flex-col items-center gap-[24px] pt-[12px]">
          {/* Balance Text & Amount */}
          <div className="flex flex-col items-center gap-[8px]">
            <span className="text-[16px] font-medium leading-[19px] text-[#6E6E6E]">
              Total Balance
            </span>

            <div className="flex items-center justify-center gap-[8px]">
              <span className="text-[36px] font-medium leading-[36px] tracking-[-0.02em] text-[#0D0D0D]">
                {isBalanceVisible ? "₦200,000" : "••••••••"}
              </span>
              <button
                type="button"
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="text-[#0D0D0D] hover:opacity-75 transition-opacity p-1 cursor-pointer outline-none"
                aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
              >
                {isBalanceVisible ? (
                  <ViewIcon size={20} className="w-[20px] h-[20px]" />
                ) : (
                  <ViewOffSlashIcon size={20} className="w-[20px] h-[20px]" />
                )}
              </button>
            </div>
          </div>

          {/* Withdraw Button */}
          <button
            type="button"
            onClick={handleWithdraw}
            className="h-[37px] px-[16px] rounded-[30px] bg-[#0048B3] flex items-center justify-center gap-[6px] text-white text-[14px] font-medium leading-none cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all outline-none"
          >
            <span className="leading-none flex items-center">Withdraw</span>
            <SentIcon
              size={14}
              color="#FFFFFF"
              className="w-[14px] h-[14px] shrink-0"
            />
          </button>
        </div>

        {/* Transaction History Section */}
        <div className="w-full flex flex-col gap-[32px] mt-[8px]">
          {/* Header Row: Title & Filter Tabs */}
          <div className="w-full flex items-center justify-between">
            <h2 className="text-[16px] font-medium leading-[19px] text-[#0D0D0D]">
              Transaction history
            </h2>

            {/* Segmented Filter Pill */}
            <div className="h-[38px] bg-[#FCFCFC] border border-[#F0F0F0] rounded-[30px] p-[3px] flex items-center gap-[2px]">
              <button
                type="button"
                onClick={() => setHistoryTab("completed")}
                className={`px-[12px] h-[32px] rounded-[26px] text-[12px] font-medium transition-all outline-none cursor-pointer flex items-center justify-center ${
                  historyTab === "completed"
                    ? "bg-white text-[#0A0A0A] shadow-sm"
                    : "text-[#9E9E9E] hover:text-[#0A0A0A]"
                }`}
              >
                Completed
              </button>
              <button
                type="button"
                onClick={() => setHistoryTab("pending")}
                className={`px-[12px] h-[32px] rounded-[26px] text-[12px] font-medium transition-all outline-none cursor-pointer flex items-center justify-center ${
                  historyTab === "pending"
                    ? "bg-white text-[#0A0A0A] shadow-sm"
                    : "text-[#9E9E9E] hover:text-[#0A0A0A]"
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Empty State Block */}
          <div className="w-full flex flex-col items-center justify-center gap-[12px] py-[32px]">
            <div className="w-[34px] h-[24px] opacity-40 grayscale flex items-center justify-center">
              <img
                src={logoImg}
                alt="Jaradeck Mark"
                width="34"
                height="24"
                className="w-[34px] h-[24px] object-contain"
              />
            </div>

            <p className="text-[14px] font-medium leading-[20px] text-[#272931]/50 text-center max-w-[220px]">
              {historyTab === "pending" ? (
                <>
                  You have no pending
                  <br />
                  transactions
                </>
              ) : (
                <>
                  You have no completed
                  <br />
                  transactions
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <WorkerBottomNav />
    </div>
  );
};

export default WorkerWalletScreen;
