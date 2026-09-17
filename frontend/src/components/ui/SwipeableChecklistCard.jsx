import React, { useState, useRef } from 'react';

function ChevronRightIcon({ color = '#141B34' }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DEFAULT_THEMES = {
  'verify-email': {
    faintBg: 'bg-[#FFF4F2]',
    deepBg: 'bg-[#FF3D00]',
    deepTextColor: 'text-white',
    deepSubtitleColor: 'text-white/80',
    checkBadgeBg: 'bg-white',
    checkIconColor: '#FF3D00',
  },
  'setup-profile': {
    faintBg: 'bg-[#F0F4FA]',
    deepBg: 'bg-[#0048B3]',
    deepTextColor: 'text-white',
    deepSubtitleColor: 'text-white/80',
    checkBadgeBg: 'bg-white',
    checkIconColor: '#0048B3',
  },
  'payout-details': {
    faintBg: 'bg-[#FFFBF4]',
    deepBg: 'bg-[#FEB943]',
    deepTextColor: 'text-[#1C1917]',
    deepSubtitleColor: 'text-[#57534E]',
    checkBadgeBg: 'bg-[#1C1917]',
    checkIconColor: '#FEB943',
  },
  'availability': {
    faintBg: 'bg-[#FFF2F5]',
    deepBg: 'bg-[#EC4899]',
    deepTextColor: 'text-white',
    deepSubtitleColor: 'text-white/80',
    checkBadgeBg: 'bg-white',
    checkIconColor: '#EC4899',
  },
};

export const SwipeableChecklistCard = ({
  id,
  isDone,
  bgColor,
  deepBgColor,
  title,
  subtitle,
  onClick,
  onDismiss,
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState('right');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);

  const theme = DEFAULT_THEMES[id] || {
    faintBg: bgColor || 'bg-[#F0F4FA]',
    deepBg: deepBgColor || 'bg-[#0048B3]',
    deepTextColor: 'text-white',
    deepSubtitleColor: 'text-white/80',
    checkBadgeBg: 'bg-white',
    checkIconColor: '#0048B3',
  };

  // If not completed, render faint non-swipeable interactive card
  if (!isDone) {
    return (
      <button
        type="button"
        data-checklist-id={id}
        onClick={onClick}
        className={`w-full ${theme.faintBg} rounded-[20px] px-[20px] py-[16px] flex items-center justify-between transition-all duration-300 hover:opacity-95 active:scale-[0.99] cursor-pointer outline-none text-left border border-transparent hover:border-black/5 shadow-sm`}
      >
        <div className="flex flex-col items-start justify-center min-w-0 pr-3">
          <span className="text-[15px] font-medium leading-[22px] text-[#0D0D0D]">
            {title}
          </span>
          <span className="text-[13px] font-normal leading-[19px] text-[#7B7B7B]">
            {subtitle}
          </span>
        </div>
        <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
          <ChevronRightIcon color="#141B34" />
        </div>
      </button>
    );
  }

  // If completed and fully collapsed, return null
  if (isCollapsed) {
    return null;
  }

  // Pointer event handlers for horizontal swipe
  const handlePointerDown = (e) => {
    if (e.button !== 0 || isExiting) return;

    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    setIsDragging(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    if (!hasMovedRef.current) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
        isDraggingRef.current = false;
        setIsDragging(false);
        setOffsetX(0);
        return;
      }
      if (Math.abs(dx) > 6) {
        hasMovedRef.current = true;
      }
    }

    if (hasMovedRef.current) {
      setOffsetX(dx);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const dx = offsetX;
    const threshold = 75;

    if (Math.abs(dx) > threshold) {
      const direction = dx > 0 ? 'right' : 'left';
      setIsExiting(true);
      setExitDirection(direction);

      setTimeout(() => {
        setIsCollapsed(true);
        if (onDismiss) onDismiss(id);
      }, 260);
    } else {
      if (!hasMovedRef.current && onClick) {
        onClick();
      }
      setOffsetX(0);
    }
  };

  const handlePointerCancel = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    setOffsetX(0);
  };

  const exitTransform = exitDirection === 'right' ? 'translateX(120%)' : 'translateX(-120%)';
  const currentTransform = isExiting ? exitTransform : `translateX(${offsetX}px)`;
  const currentOpacity = isExiting
    ? 0
    : isDragging
    ? Math.max(0.2, 1 - (Math.abs(offsetX) / 250) * 0.7)
    : 1;

  return (
    <div
      className={`w-full relative transition-all duration-300 ease-in-out ${
        isExiting ? 'max-h-0 mb-0 opacity-0 overflow-hidden' : 'max-h-[120px]'
      }`}
      style={{
        transitionProperty: isExiting ? 'max-height, margin, opacity' : 'none',
      }}
    >
      {/* Background container revealed ONLY when card is swiped */}
      <div
        className={`absolute inset-0 rounded-[20px] flex items-center px-[20px] transition-opacity duration-200 pointer-events-none ${
          offsetX > 0 ? 'justify-start bg-[#10B981]/20' : 'justify-end bg-[#10B981]/20'
        }`}
        style={{
          opacity: Math.abs(offsetX) > 5 ? Math.min(1, Math.abs(offsetX) / 30) : 0,
        }}
      >
        <span className="text-[13px] font-medium text-[#10B981] flex items-center gap-[6px] select-none">
          <span>✓</span>
          <span>Dismiss</span>
        </span>
      </div>

      {/* Swipeable Completed Card Foreground - DEEP COLOR WHEN COMPLETED */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{
          transform: currentTransform,
          opacity: currentOpacity,
          touchAction: 'pan-y',
          transition: isDragging
            ? 'none'
            : 'transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.26s ease',
        }}
        className={`w-full ${theme.deepBg} rounded-[20px] px-[20px] py-[16px] flex items-center justify-between cursor-grab active:cursor-grabbing outline-none select-none relative z-10 shadow-md`}
      >
        <div className="flex flex-col items-start justify-center min-w-0 pointer-events-none pr-3">
          <div className="flex items-center gap-[8px]">
            <span className={`text-[15px] font-semibold leading-[22px] ${theme.deepTextColor}`}>
              {title}
            </span>
            <span
              className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full ${theme.checkBadgeBg} text-[11px] font-extrabold shrink-0 shadow-sm`}
              style={{ color: theme.checkIconColor }}
            >
              ✓
            </span>
          </div>
          <span className={`text-[13px] font-normal leading-[19px] ${theme.deepSubtitleColor}`}>
            Completed • Swipe to remove
          </span>
        </div>
      </div>
    </div>
  );
};
