import React from 'react';
import { motion } from 'framer-motion';
import { CheckmarkCircle02Icon } from 'hugeicons-react';
import { useApp } from '../context/AppContext';

export const WithdrawSuccessScreen = () => {
  const { navigateTo, withdrawalAmount } = useApp();

  const amount = withdrawalAmount > 0 ? withdrawalAmount : 20000;
  const formattedAmount =
    '₦' +
    amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleDone = () => {
    navigateTo('freelancer/wallet');
  };

  return (
    <div
      className="w-full max-w-[390px] min-h-[844px] bg-white flex flex-col items-center px-[16px] pt-[60px] pb-[100px] relative overflow-hidden mx-auto"
      style={{ fontFamily: "'PP Neue Montreal', sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full max-w-[358px] flex flex-col items-center justify-between min-h-[600px] my-auto"
      >
        <div className="w-full flex flex-col items-center text-center my-auto">
          {/* Animated Success Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
            className="w-[80px] h-[80px] rounded-full bg-[#EBF3FF] flex items-center justify-center mb-[24px]"
          >
            <CheckmarkCircle02Icon size={48} color="#0048B3" className="w-[48px] h-[48px]" />
          </motion.div>

          <h1 className="text-[22px] font-medium leading-[28px] tracking-[-0.015em] text-[#0D0D0D] mb-[8px]">
            Withdrawal Initiated
          </h1>
          <p className="text-[14px] font-normal leading-[20px] text-[#8E8E93] max-w-[280px]">
            Your withdrawal of <span className="font-medium text-[#0D0D0D]">{formattedAmount}</span> to Zenith Bank (12321245472) is being processed.
          </p>
        </div>

        {/* Done Button */}
        <div className="w-full mt-auto">
          <button
            type="button"
            onClick={handleDone}
            className="w-full h-[44px] rounded-full bg-[#0048B3] text-white text-[14px] font-medium transition-all shadow-sm flex items-center justify-center cursor-pointer hover:bg-[#003EA3] active:scale-[0.98] outline-none border-none"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
