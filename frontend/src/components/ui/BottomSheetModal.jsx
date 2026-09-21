import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const BottomSheetModal = ({ isOpen, onClose, children }) => {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-center px-0">
          {/* Backdrop Overlay with Gaussian Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/35 cursor-pointer z-0"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />

          {/* Bottom Sheet Drawer Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-[430px] bg-white rounded-t-[36px] p-[24px] pb-[36px] shadow-2xl z-10 flex flex-col items-center overflow-hidden"
          >
            {/* Darker Grab handle bar */}
            <div className="w-[48px] h-[4px] rounded-full bg-[#3F3F46] mb-[20px] shrink-0" />
            <div className="w-full flex flex-col items-center">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BottomSheetModal;

