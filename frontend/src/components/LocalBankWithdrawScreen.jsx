import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft02Icon,
  ArrowUpDownIcon,
  ViewOffSlashIcon,
} from 'hugeicons-react';
import zenithBankLogo from '../assets/zenith_bank.svg';
import eyeImg from '../assets/eye.svg';
import cancelButtonSvg from '../assets/cancel_button.svg';
import { useApp } from '../context/AppContext';

export const LocalBankWithdrawScreen = () => {
  const { navigateTo } = useApp();
  const [amountStr, setAmountStr] = useState('');
  const [isAvailableVisible, setIsAvailableVisible] = useState(true);

  // Hardcoded for frontend visualization per design specs
  const availableBalance = 19000;

  const handleBack = () => {
    navigateTo('freelancer/withdraw-options');
  };

  const handleKeyPress = (digit) => {
    if (amountStr.length >= 9) return;
    if (amountStr === '' && digit === '0') return;
    setAmountStr((prev) => prev + digit);
  };

  const handleDelete = () => {
    setAmountStr((prev) => prev.slice(0, -1));
  };

  const numericValue = Number(amountStr) || 0;
  const exceedsBalance = numericValue > availableBalance;
  const isValidAmount = numericValue > 0 && !exceedsBalance;

  const formattedAmount =
    amountStr === ''
      ? ''
      : '₦' +
        numericValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const handleConfirm = () => {
    if (!isValidAmount) return;
    navigateTo('freelancer/confirm-withdraw', { amount: numericValue });
  };

  return (
    <div
      className="w-full max-w-[390px] min-h-[844px] bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] relative overflow-hidden mx-auto"
      style={{ fontFamily: "'PP Neue Montreal', sans-serif" }}
    >
      {/* Physics Entrance Transition */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="w-full max-w-[358px] flex flex-col items-center justify-between min-h-[700px]"
      >
        {/* Upper Stack (Header + Directional Flow + Bank Card + Available Balance) */}
        <div className="w-full flex flex-col items-center gap-[14px]">
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
          <h1 className="text-[17px] font-medium leading-[22px] tracking-[-0.015em] text-[#0D0D0D] text-center mt-[2px]">
            Withdraw to local bank
          </h1>

          {/* Directional Transfer Indicator */}
          <div className="w-[24px] h-[24px] flex items-center justify-center text-[#0D0D0D] my-[2px]">
            <ArrowUpDownIcon size={20} color="#0D0D0D" className="shrink-0" />
          </div>

          {/* Bank Account Details Card */}
          <div className="bg-[#F8F9FA] rounded-[16px] px-[16px] py-[12px] flex items-center gap-[12px] shrink-0">
            <img
              src={zenithBankLogo}
              alt="Zenith Bank"
              className="w-[28px] h-[28px] object-contain shrink-0"
            />
            <div className="flex flex-col items-start text-left">
              <span className="text-[15px] font-medium leading-[19px] text-[#272931]">
                12321245472
              </span>
              <span className="text-[12px] font-normal leading-[15px] text-[#8E8E93]">
                Zenith Bank
              </span>
            </div>
          </div>

          {/* Available Balance Sub-card / Tag */}
          <div className="bg-[#F8F9FA] rounded-full px-[14px] py-[6px] flex items-center gap-[6px] mt-[4px] mb-[8px]">
            <span className="text-[11px] font-normal text-[#8E8E93]">Available Balance</span>
            <span className="text-[13px] font-medium text-[#272931]">
              {isAvailableVisible ? `₦${availableBalance.toLocaleString()}` : '••••••••'}
            </span>
            <button
              type="button"
              onClick={() => setIsAvailableVisible(!isAvailableVisible)}
              className="text-[#272931] hover:opacity-75 transition-opacity p-0.5 cursor-pointer outline-none bg-transparent border-none flex items-center"
              aria-label={isAvailableVisible ? 'Hide balance' : 'Show balance'}
            >
              {isAvailableVisible ? (
                <img src={eyeImg} alt="View" className="w-[14px] h-[14px]" />
              ) : (
                <ViewOffSlashIcon size={14} className="w-[14px] h-[14px] text-[#272931]" />
              )}
            </button>
          </div>
        </div>

        {/* Center Amount Input Display */}
        <div className="w-full flex flex-col items-center justify-center my-[16px] min-h-[64px]">
          {amountStr === '' ? (
            <span className="text-[34px] font-normal leading-[40px] text-[#8E8E93] animate-pulse">
              |
            </span>
          ) : (
            <div className="flex flex-col items-center gap-[4px]">
              <span className="text-[34px] font-medium leading-[40px] tracking-[-0.015em] text-[#0D0D0D]">
                {formattedAmount}
              </span>
              {exceedsBalance && (
                <span className="text-[12px] font-medium text-[#EF4444] animate-fadeIn">
                  Amount exceeds current balance
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button & Persistent Numeric Keypad Grid */}
        <div className="w-full flex flex-col gap-[24px] items-center">
          {/* Confirm Button */}
          <button
            type="button"
            disabled={!isValidAmount}
            onClick={handleConfirm}
            className={`w-full h-[44px] rounded-full flex items-center justify-center text-[14px] font-medium transition-all outline-none border-none ${
              isValidAmount
                ? 'bg-[#0048B3] text-white cursor-pointer hover:bg-[#003EA3] active:scale-[0.98] shadow-sm'
                : 'bg-[#CFCFCF] text-white cursor-not-allowed opacity-90'
            }`}
          >
            Confirm
          </button>

          {/* Numeric Keypad Grid (Always Visible per Figma Standard) */}
          <div className="w-full max-w-[280px] grid grid-cols-3 gap-x-[24px] gap-y-[14px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="w-[76px] h-[52px] rounded-[12px] flex items-center justify-center text-[22px] font-medium text-[#0D0D0D] cursor-pointer hover:bg-[#F4F4F6] active:scale-95 transition-all outline-none border-none bg-transparent"
              >
                {digit}
              </button>
            ))}

            {/* Empty Spacer */}
            <div className="w-[76px] h-[52px]" />

            {/* Zero Digit */}
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="w-[76px] h-[52px] rounded-[12px] flex items-center justify-center text-[22px] font-medium text-[#0D0D0D] cursor-pointer hover:bg-[#F4F4F6] active:scale-95 transition-all outline-none border-none bg-transparent"
            >
              0
            </button>

            {/* Backspace / Delete Key */}
            <button
              type="button"
              onClick={handleDelete}
              className="w-[76px] h-[52px] rounded-[12px] flex items-center justify-center cursor-pointer hover:bg-[#F4F4F6] active:scale-95 transition-all outline-none border-none bg-transparent"
              aria-label="Delete last digit"
            >
              <img src={cancelButtonSvg} alt="Delete" className="w-[54px] h-[44px] object-contain" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
