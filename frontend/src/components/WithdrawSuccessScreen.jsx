import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft02Icon, ArrowRight02Icon } from 'hugeicons-react';
import blueTickImg from '../assets/blue_tick.png';
import { useApp } from '../context/AppContext';

export const WithdrawSuccessScreen = () => {
  const { navigateTo } = useApp();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create a confetti instance bound strictly to the mobile screen canvas
    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });

    const end = Date.now() + 2000;
    const colors = ['#0048B3', '#2563EB', '#60A5FA', '#93C5FD', '#FBBF24', '#F59E0B', '#F43F5E'];

    const frame = () => {
      myConfetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.3 },
        colors: colors,
        disableForReducedMotion: true,
      });
      myConfetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.3 },
        colors: colors,
        disableForReducedMotion: true,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handleBack = () => {
    navigateTo('freelancer/wallet');
  };

  const handleContinue = () => {
    navigateTo('freelancer/wallet');
  };

  return (
    <div
      className="w-full max-w-[390px] min-h-[844px] bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] relative overflow-hidden mx-auto"
      style={{ fontFamily: "'PP Neue Montreal', sans-serif" }}
    >
      {/* Canvas strictly clipped to mobile container */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full max-w-[358px] flex flex-col items-center relative z-20"
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

        {/* Central Success Stack */}
        <div className="w-full flex flex-col items-center gap-[24px] mt-[100px]">
          {/* 3D Blue Verified Rosette Badge */}
          <div className="w-[88px] h-[90px] flex items-center justify-center">
            <img
              src={blueTickImg}
              alt="Withdrawal Success"
              width="88"
              height="90"
              className="w-[88px] h-[90px] object-contain drop-shadow-md"
            />
          </div>

          {/* Heading & Subtitle */}
          <div className="w-full flex flex-col items-center gap-[12px] text-center">
            <h1 className="text-[34px] font-medium leading-[41px] tracking-[-0.02em] text-[#0A0A0A]">
              Succesful!
            </h1>
            <p className="text-[14px] font-normal leading-[20px] text-[#7B7B7B] max-w-[271px]">
              The funds should arrive in the receiving bank within 5 minutes.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full mt-[120px]">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full h-[44px] rounded-full bg-[#0048B3] text-white text-[14px] font-medium transition-all shadow-sm flex items-center justify-center gap-[8px] cursor-pointer hover:bg-[#003EA3] active:scale-[0.98] outline-none border-none"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight02Icon size={18} color="#FFFFFF" className="w-[18px] h-[18px] shrink-0" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
