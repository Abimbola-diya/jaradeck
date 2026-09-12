import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import { ArrowLeft02Icon, ArrowRight02Icon } from "hugeicons-react";
import verifiedBadge from "../assets/verified_badge.png";

export const WithdrawSuccessScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Preserve role query parameter if present
  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get("role");
  const roleQuery = roleParam ? `?role=${roleParam}` : "";

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create a confetti instance bound strictly to the mobile screen canvas
    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    });

    const end = Date.now() + 2000;
    const colors = [
      "#0048B3",
      "#2563EB",
      "#60A5FA",
      "#93C5FD",
      "#FBBF24",
      "#F59E0B",
      "#F43F5E",
    ];

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
    let targetPath = "/dashboard/wallet";
    if (location.pathname.includes("/freelancer")) {
      targetPath = "/dashboard/freelancer/wallet";
    } else if (location.pathname.includes("/customer")) {
      targetPath = "/dashboard/customer/wallet";
    }
    navigate(`${targetPath}${roleQuery}`);
  };

  const handleContinue = () => {
    let targetPath = "/dashboard/wallet";
    if (location.pathname.includes("/freelancer")) {
      targetPath = "/dashboard/freelancer/dashboard";
    } else if (location.pathname.includes("/customer")) {
      targetPath = "/dashboard/customer/dashboard";
    }
    navigate(`${targetPath}${roleQuery}`);
  };

  return (
    <div className="w-full max-w-[390px] min-h-screen bg-white flex flex-col items-center px-[16px] pt-[40px] pb-[100px] mx-auto relative overflow-x-hidden">
      {/* Canvas strictly clipped to mobile container */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Content Container (358px width) */}
      <div className="w-full max-w-[358px] flex flex-col items-center justify-between h-full min-h-[560px] relative z-20">
        {/* Header Navigation */}
        <div className="w-full flex items-center">
          <button
            type="button"
            onClick={handleBack}
            className="w-[40px] h-[40px] rounded-full bg-[#FCFCFC] border border-[#F3F4F5] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] active:scale-95 transition-all outline-none"
            aria-label="Go back"
          >
            <ArrowLeft02Icon
              size={20}
              color="#272931"
              className="w-[20px] h-[20px] shrink-0"
            />
          </button>
        </div>

        {/* Central Success Stack */}
        <div className="w-full flex flex-col items-center gap-[32px] my-auto">
          {/* 3D Blue Verified Rosette Badge */}
          <div className="w-[88px] h-[90px] flex items-center justify-center">
            <img
              src={verifiedBadge}
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
        <div className="w-full mt-auto">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full h-[44px] rounded-[22px] bg-[#0048B3] text-white text-[14px] font-medium transition-all shadow-button-inset flex items-center justify-center gap-[8px] cursor-pointer hover:opacity-95 active:scale-[0.99] outline-none"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight02Icon
              size={18}
              color="#FFFFFF"
              className="w-[18px] h-[18px] shrink-0"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawSuccessScreen;
