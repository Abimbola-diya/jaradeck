import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft02Icon } from 'hugeicons-react';
import cancelButtonSvg from '../assets/cancel_button.svg';
import { useApp } from '../context/AppContext';

export const EnterPinScreen = () => {
  const { navigateTo } = useApp();
  const [pin, setPin] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleBack = () => {
    navigateTo('freelancer/confirm-withdraw');
  };

  const handleKeyPress = (digit) => {
    if (pin.length >= 4 || isAuthorizing) return;
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === 4) {
      setIsAuthorizing(true);
      setTimeout(() => {
        setIsAuthorizing(false);
        navigateTo('freelancer/withdraw-success');
      }, 800);
    }
  };

  const handleDelete = () => {
    if (isAuthorizing) return;
    setPin((prev) => prev.slice(0, -1));
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
        {/* Upper Stack (Header + Title + Subtitle + PIN Indicator) */}
        <div className="w-full flex flex-col items-start">
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

          {/* Title & Subtitle Block */}
          <div className="w-full flex flex-col items-start gap-[6px] text-left mt-[20px]">
            <h1 className="text-[20px] font-medium leading-[26px] tracking-[-0.015em] text-[#0D0D0D]">
              Enter your PIN
            </h1>
            <p className="text-[13px] font-normal leading-[18px] text-[#8E8E93]">
              Please enter your 4-digit security PIN to authorize this
              <br />
              withdrawal
            </p>
          </div>

          {/* 4-Digit PIN Indicator Dots */}
          <div className="w-full flex items-center justify-center gap-[24px] mt-[52px] mb-[40px]">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = index < pin.length;
              return (
                <div
                  key={index}
                  className={`w-[18px] h-[18px] rounded-full transition-all duration-200 ${
                    isFilled
                      ? 'bg-[#0048B3] scale-105'
                      : 'border-[2px] border-[#D0D0D0] bg-transparent'
                  }`}
                />
              );
            })}
          </div>

          {/* Authorization Status Indicator */}
          {isAuthorizing && (
            <div className="w-full flex items-center justify-center text-[13px] font-medium text-[#0048B3] animate-pulse mb-[16px]">
              Authorizing withdrawal...
            </div>
          )}
        </div>

        {/* Numeric Keypad Grid */}
        <div className="w-full max-w-[280px] grid grid-cols-3 gap-x-[24px] gap-y-[14px] mt-[36px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="w-[76px] h-[52px] rounded-[12px] flex items-center justify-center text-[25px] font-medium text-[#0D0D0D] cursor-pointer hover:bg-[#F4F4F6] active:scale-95 transition-all outline-none border-none bg-transparent"
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
            className="w-[76px] h-[52px] rounded-[12px] flex items-center justify-center text-[25px] font-medium text-[#0D0D0D] cursor-pointer hover:bg-[#F4F4F6] active:scale-95 transition-all outline-none border-none bg-transparent"
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
            <img src={cancelButtonSvg} alt="Delete" className="w-[58px] h-[46px] object-contain" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
