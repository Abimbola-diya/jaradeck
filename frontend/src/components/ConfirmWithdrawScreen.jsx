import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft02Icon } from 'hugeicons-react';
import fromIconSvg from '../assets/from_icon.svg';
import toIconSvg from '../assets/to_icon.svg';
import feeIconSvg from '../assets/fee_icon.svg';
import { useApp } from '../context/AppContext';

export const ConfirmWithdrawScreen = () => {
  const { navigateTo, withdrawalAmount } = useApp();

  const amount = withdrawalAmount > 0 ? withdrawalAmount : 20000;
  const fee = amount > 0 ? Math.round(amount * 0.0175 * 100) / 100 : 350;

  const formattedAmount =
    '₦' +
    amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formattedFee =
    '₦' +
    fee.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleBack = () => {
    navigateTo('freelancer/withdraw-bank');
  };

  const handleConfirm = () => {
    navigateTo('freelancer/enter-pin');
  };

  return (
    <div
      className="w-full max-w-[430px] min-h-[844px] bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] relative overflow-hidden mx-auto"
      style={{ fontFamily: "'PP Neue Montreal', sans-serif" }}
    >
      {/* Physics Entrance Transition */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="w-full max-w-[358px] flex flex-col items-center"
      >
        {/* Top Row: Back Arrow Button on Left */}
        <div className="w-full flex items-center justify-start">
          <button
            type="button"
            onClick={handleBack}
            className="w-[40px] h-[40px] rounded-full bg-[#F5F5F7] flex items-center justify-center cursor-pointer hover:bg-[#EBEBEF] active:scale-95 transition-all outline-none border-none"
            aria-label="Go back"
          >
            <ArrowLeft02Icon size={20} color="#0D0D0D" className="w-[20px] h-[20px] shrink-0" />
          </button>
        </div>

        {/* Header Title (Beneath Arrow) */}
        <h1 className="text-[17px] font-medium leading-[22px] tracking-[-0.015em] text-[#0D0D0D] text-center mt-[14px]">
          Confirm withdrawal
        </h1>

        {/* Amount Display Block */}
        <div className="w-full flex flex-col items-center justify-center mt-[36px] mb-[40px]">
          <span className="text-[13px] font-normal text-[#8E8E93] text-center mb-[4px]">
            Amount
          </span>
          <span className="text-[34px] font-medium leading-[40px] tracking-[-0.015em] text-[#0D0D0D]">
            {formattedAmount}
          </span>
        </div>

        {/* Details List */}
        <div className="w-full flex flex-col">
          {/* Row 1: From */}
          <div className="w-full py-[16px] flex items-center justify-between border-b border-[#F0F0F2]">
            <div className="flex items-center gap-[10px]">
              <img src={fromIconSvg} alt="From" className="w-[19px] h-[15px] object-contain" />
              <span className="text-[14px] font-normal leading-[18px] text-[#8E8E93]">
                From
              </span>
            </div>
            <span className="text-[14px] font-medium leading-[18px] text-[#272931]">
              Jaradeck Wallet
            </span>
          </div>

          {/* Row 2: To */}
          <div className="w-full py-[16px] flex items-center justify-between border-b border-[#F0F0F2]">
            <div className="flex items-center gap-[10px]">
              <img src={toIconSvg} alt="To" className="w-[20px] h-[20px] object-contain" />
              <span className="text-[14px] font-normal leading-[18px] text-[#8E8E93]">
                To
              </span>
            </div>
            <span className="text-[14px] font-medium leading-[18px] text-[#272931]">
              Ali Mayo.......1234
            </span>
          </div>

          {/* Row 3: Fee */}
          <div className="w-full py-[16px] flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <img src={feeIconSvg} alt="Fee" className="w-[20px] h-[20px] object-contain" />
              <span className="text-[14px] font-normal leading-[18px] text-[#8E8E93]">
                Fee
              </span>
            </div>
            <span className="text-[14px] font-medium leading-[18px] text-[#272931]">
              {formattedFee}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full mt-[36px]">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full h-[44px] rounded-full bg-[#0048B3] text-white text-[14px] font-medium transition-all shadow-sm flex items-center justify-center cursor-pointer hover:bg-[#003EA3] active:scale-[0.98] outline-none border-none"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};
