import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft02Icon } from 'hugeicons-react';
import dollarSvg from '../assets/dollar.svg';
import stableCoinsSvg from '../assets/stable_coins.svg';
import { useApp } from '../context/AppContext';

export const WithdrawOptionsScreen = () => {
  const { navigateTo } = useApp();

  const handleBack = () => {
    navigateTo('freelancer/wallet');
  };

  return (
    <div
      className="w-full max-w-[430px] min-h-[844px] bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] relative overflow-hidden mx-auto"
      style={{ fontFamily: "'PP Neue Montreal', sans-serif" }}
    >
      {/* Morphing Blue Origin Expanding Pulse (Connecting from Withdraw Button) */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0.7, y: 120 }}
        animate={{ scale: 2.2, opacity: 0, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[180px] w-[120px] h-[40px] rounded-full bg-[#0048B3]/25 blur-xl pointer-events-none z-0"
      />

      {/* Main Content Container with Physics Spring Transition */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 28,
          mass: 0.7,
        }}
        className="w-full max-w-[358px] flex flex-col gap-[24px] relative z-10"
      >
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.04, duration: 0.25 }}
          className="w-full flex items-center"
        >
          <button
            type="button"
            onClick={handleBack}
            className="w-[40px] h-[40px] rounded-full bg-[#F5F5F7] flex items-center justify-center cursor-pointer hover:bg-[#EBEBEF] active:scale-95 transition-all shrink-0 outline-none border-none"
            aria-label="Go back"
          >
            <ArrowLeft02Icon size={20} color="#0D0D0D" className="w-[20px] h-[20px] shrink-0" />
          </button>
        </motion.div>

        {/* Withdraw Options Stack */}
        <div className="w-full flex flex-col gap-[16px] mt-[12px]">
          {/* Option 1: Withdraw to your local bank */}
          <motion.button
            type="button"
            onClick={() => navigateTo('freelancer/withdraw-bank')}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.08,
              type: 'spring',
              stiffness: 400,
              damping: 26,
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#F8F9FA] rounded-[20px] p-[20px] flex items-center gap-[16px] text-left hover:bg-[#F3F4F6] transition-all outline-none border-none cursor-pointer group shadow-none"
          >
            <div className="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <img
                src={dollarSvg}
                alt="Local bank withdrawal"
                className="w-[28px] h-[14px] object-contain"
              />
            </div>

            <div className="flex flex-col gap-[3px] items-start">
              <h2 className="text-[15px] font-medium leading-[20px] text-[#0D0D0D] group-hover:text-[#0048B3] transition-colors">
                Withdraw to your local bank
              </h2>
              <p className="text-[13px] font-normal leading-[16px] text-[#8E8E93] max-w-[215px]">
                Send money directly into your local bank account
              </p>
            </div>
          </motion.button>

          {/* Option 2: Stablecoins */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.14,
              type: 'spring',
              stiffness: 400,
              damping: 26,
            }}
            className="w-full bg-[#F8F9FA] rounded-[20px] p-[20px] flex items-center gap-[16px] text-left select-none opacity-80"
          >
            <div className="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <img
                src={stableCoinsSvg}
                alt="Stablecoins withdrawal"
                className="w-[26px] h-[26px] object-contain"
              />
            </div>

            <div className="flex flex-col gap-[3px] items-start">
              <h2 className="text-[15px] font-medium leading-[20px] text-[#8E8E93]">
                Stablecoins
              </h2>
              <p className="text-[13px] font-normal leading-[16px] text-[#8E8E93]/80">
                Coming soon
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
