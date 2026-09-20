import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft02Icon } from 'hugeicons-react';
import { useApp } from '../context/AppContext';
import noActiveProjectsSvg from '../assets/no_active_projects.svg';

export function EmptyMessagesScreen() {
  const { navigateTo, restoreConversations } = useApp();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateTo('/dashboard');
    }
  };

  return (
    <div
      className="w-full max-w-[430px] min-h-[844px] bg-white flex flex-col items-center px-[21px] pt-[40px] pb-[100px] relative overflow-hidden select-none mx-auto"
      style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      {/* Header */}
      <header className="w-full flex items-center justify-between pt-[8px] pb-[16px]">
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            onClick={handleBack}
            className="w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#F5F5F7] active:scale-95 transition-all shrink-0 border-none bg-transparent outline-none -ml-2"
            aria-label="Go back"
          >
            <ArrowLeft02Icon size={22} color="#12131A" className="w-[22px] h-[22px]" />
          </button>
          <h1 className="text-[20px] font-medium leading-[24px] tracking-[-0.01em] text-[#12131A]">
            Messages
          </h1>
        </div>
        {restoreConversations && (
          <button
            type="button"
            onClick={restoreConversations}
            className="text-[11px] text-[#0048B3] hover:underline font-medium px-2.5 py-1 rounded-md bg-[#0048B3]/5 hover:bg-[#0048B3]/10 transition-colors"
          >
            Show conversations
          </button>
        )}
      </header>

      {/* Empty Chat State Illustration & Text */}
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex-1 flex flex-col items-center justify-center -mt-[60px] px-[16px] text-center"
      >
        <div className="w-[180px] h-[170px] flex items-center justify-center mb-[20px]">
          <img
            src={noActiveProjectsSvg}
            alt="Quiet for now"
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        <h2 className="text-[20px] font-medium leading-[24px] tracking-[-0.01em] text-[#12131A] mb-[8px]">
          Quiet for now
        </h2>

        <p className="text-[14px] font-normal leading-[19px] text-[#747477] max-w-[260px]">
          Pitch a project or accept an offer to get things moving
        </p>
      </motion.div>
    </div>
  );
}

export default EmptyMessagesScreen;
