import React, { useState, useRef } from 'react';
import rightRegularIcon from '../../assets/right_regular.svg';

export interface SwipeableChecklistCardProps {
  id: string;
  isDone: boolean;
  bgColor: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  onDismiss: (id: string) => void;
}

export const SwipeableChecklistCard: React.FC<SwipeableChecklistCardProps> = ({
  id,
  isDone,
  bgColor,
  title,
  subtitle,
  onClick,
  onDismiss,
}) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right'>('right');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const hasMovedRef = useRef<boolean>(false);

  // If not completed, standard non-swipeable action card
  if (!isDone) {
    return (
      <button
        type="button"
        data-checklist-id={id}
        onClick={onClick}
        className={`w-full ${bgColor} rounded-[20px] px-[20px] py-[16px] flex items-center justify-between transition-all duration-300 hover:opacity-90 active:scale-[0.99] cursor-pointer outline-none text-left`}
      >
        <div className="flex flex-col items-start justify-center min-w-0">
          <span className="text-[15px] font-medium leading-[22px] text-[#0D0D0D]">
            {title}
          </span>
          <span className="text-[13px] font-normal leading-[19px] text-[#7B7B7B]">
            {subtitle}
          </span>
        </div>
        <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
          <img
            src={rightRegularIcon}
            alt="Go to step"
            className="w-[24px] h-[24px] object-contain"
          />
        </div>
      </button>
    );
  }

  // If completed and fully collapsed, do not render
  if (isCollapsed) {
    return null;
  }

  // Pointer event handlers for horizontal swipe
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    // Distinguish horizontal swipe vs vertical scroll
    if (!hasMovedRef.current) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
        // Vertical scroll dominant, abort horizontal swipe
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

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const dx = offsetX;
    const threshold = 75; // swipe distance threshold in px

    if (Math.abs(dx) > threshold) {
      // Swiped away successfully!
      const direction = dx > 0 ? 'right' : 'left';
      setIsExiting(true);
      setExitDirection(direction);

      // Trigger collapse and dismissal
      setTimeout(() => {
        setIsCollapsed(true);
        onDismiss(id);
      }, 260);
    } else {
      // Tap without drag (< 6px) -> trigger normal onClick
      if (!hasMovedRef.current) {
        onClick();
      }
      // Snap back smoothly
      setOffsetX(0);
    }
  };

  const handlePointerCancel = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    setOffsetX(0);
  };

  // Drag transform & opacity calculations
  const exitTransform =
    exitDirection === 'right' ? 'translateX(120%)' : 'translateX(-120%)';
  const currentTransform = isExiting
    ? exitTransform
    : `translateX(${offsetX}px)`;

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
      {/* Background container revealed ONLY when card is actively swiped */}
      <div
        className={`absolute inset-0 rounded-[20px] flex items-center px-[20px] transition-opacity duration-200 pointer-events-none ${
          offsetX > 0 ? 'justify-start bg-[#10B981]/15' : 'justify-end bg-[#10B981]/15'
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

      {/* Swipeable Completed Card Foreground */}
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
        className={`w-full ${bgColor} rounded-[20px] px-[20px] py-[16px] flex items-center justify-between cursor-grab active:cursor-grabbing outline-none select-none relative z-10`}
      >
        <div className="flex flex-col items-start justify-center min-w-0 pointer-events-none">
          <div className="flex items-center gap-[6px]">
            <span className="text-[15px] font-medium leading-[22px] text-[#0D0D0D]">
              {title}
            </span>
            <span className="inline-flex items-center justify-center w-[16px] h-[16px] rounded-full bg-[#10B981] text-white text-[10px] font-bold shrink-0">
              ✓
            </span>
          </div>
          <span className="text-[13px] font-normal leading-[19px] text-[#7B7B7B]">
            Completed • Swipe to remove
          </span>
        </div>
      </div>
    </div>
  );
};
