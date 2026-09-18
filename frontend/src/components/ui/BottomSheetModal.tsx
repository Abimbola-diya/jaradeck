import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialSnap?: 'default' | 'expanded';
  maxHeightVh?: number; // default 96vh (filling screen)
  className?: string;
  contentClassName?: string;
  preventDismissOnDrag?: boolean;
}

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  isOpen,
  onClose,
  children,
  initialSnap = 'default',
  maxHeightVh = 96,
  className = '',
  contentClassName = '',
  preventDismissOnDrag = false,
}) => {
  const [snapState, setSnapState] = useState<'default' | 'expanded'>(initialSnap);
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);

  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);
  const movedRef = useRef<boolean>(false);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setSnapState(initialSnap);
      setDragHeight(null);
      setIsDragging(false);
    }
  }, [isOpen, initialSnap]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset snap/drag state on step/children change so modal adapts immediately
  useEffect(() => {
    if (isOpen) {
      setSnapState(initialSnap);
      setDragHeight(null);
    }
  }, [isOpen, initialSnap, children]);

  // Measure natural content height
  useEffect(() => {
    if (!isOpen) return;

    const measure = () => {
      if (contentRef.current) {
        const headerH = headerRef.current ? headerRef.current.offsetHeight : 34;
        let intrinsicContentH = 0;
        if (contentRef.current.children.length > 0) {
          Array.from(contentRef.current.children).forEach((child) => {
            const h = (child as HTMLElement).offsetHeight || (child as HTMLElement).scrollHeight || 0;
            intrinsicContentH += h;
          });
        } else {
          intrinsicContentH = contentRef.current.scrollHeight;
        }
        const style = window.getComputedStyle(contentRef.current);
        const paddingY = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
        const total = headerH + intrinsicContentH + paddingY;
        if (total > 50) {
          setNaturalHeight(total);
        }
      }
    };

    measure();
    const timer = setTimeout(measure, 50);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && contentRef.current) {
      ro = new ResizeObserver(() => {
        measure();
      });
      ro.observe(contentRef.current);
      if (contentRef.current.firstElementChild) {
        ro.observe(contentRef.current.firstElementChild);
      }
    }

    return () => {
      clearTimeout(timer);
      if (ro) ro.disconnect();
    };
  }, [isOpen, children]);

  // Handle pointer down on drag pill
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    dragStartYRef.current = e.clientY;
    movedRef.current = false;
    setIsDragging(true);

    if (sheetRef.current) {
      startHeightRef.current = sheetRef.current.getBoundingClientRect().height;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaY = e.clientY - dragStartYRef.current;
    if (Math.abs(deltaY) > 4) {
      movedRef.current = true;
    }

    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 844;
    const maxPx = (windowHeight * maxHeightVh) / 100;
    const minPx = Math.min(180, windowHeight * 0.2);

    // Continuous dynamic height tracking:
    // deltaY < 0 (drag up) -> height increases towards fill screen
    // deltaY > 0 (drag down) -> height decreases, shrinking the modal
    const rawHeight = startHeightRef.current - deltaY;
    let newHeight = rawHeight;
    if (rawHeight > maxPx) {
      // Elastic resistance above max height
      newHeight = maxPx + Math.pow(rawHeight - maxPx, 0.7);
    } else if (rawHeight < minPx) {
      // Elastic resistance below min height
      newHeight = minPx - Math.pow(minPx - rawHeight, 0.7);
    }

    setDragHeight(newHeight);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const deltaY = e.clientY - dragStartYRef.current;
    setIsDragging(false);

    // 1. Quick tap / click without significant dragging (< 6px) -> toggle expanded / default
    if (!movedRef.current) {
      setSnapState((prev) => (prev === 'expanded' ? 'default' : 'expanded'));
      setDragHeight(null);
      return;
    }

    // 2. Dragged upward by > 30px -> Fill Screen (expanded)
    if (deltaY < -30) {
      setSnapState('expanded');
      setDragHeight(null);
      return;
    }

    // 3. Dragged downward by > 30px:
    if (deltaY > 30) {
      if (snapState === 'expanded') {
        // Shrink back to default
        setSnapState('default');
        setDragHeight(null);
      } else {
        // Dragged down from default:
        // If pulled down far (> 85px) and not prevented -> dismiss
        if (deltaY > 85 && !preventDismissOnDrag) {
          onClose();
        } else {
          // Snap back to default
          setSnapState('default');
          setDragHeight(null);
        }
      }
      return;
    }

    // Fallback: restore
    setDragHeight(null);
  };

  if (!isOpen || typeof document === 'undefined') return null;

  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 844;
  const maxPx = (windowHeight * maxHeightVh) / 100;
  const isExpanded = snapState === 'expanded';

  // Compute target height:
  // When dragging: active dragHeight
  // When expanded: maxPx (fills screen)
  // When default: naturalHeight (if known) capped at maxPx, or undefined for auto
  let heightStyle: string | undefined;
  if (dragHeight !== null) {
    heightStyle = `${Math.round(dragHeight)}px`;
  } else if (isExpanded) {
    heightStyle = `${maxHeightVh}vh`;
  } else if (naturalHeight !== null) {
    heightStyle = `${Math.min(naturalHeight, maxPx)}px`;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto select-none">
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-[4px] animate-fadeIn transition-opacity cursor-pointer"
        aria-label="Close modal backdrop"
      />

      {/* Bottom Sheet Container (Full Width per Figma Node 1589:1581) */}
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          height: heightStyle,
          maxHeight: `${maxHeightVh}vh`,
          transition: isDragging
            ? 'none'
            : 'height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`w-full bg-white rounded-t-[30px] flex flex-col items-center shadow-[0_-8px_32px_rgba(0,0,0,0.14)] relative z-10 animate-slide-up-sheet overflow-hidden ${
          !dragHeight && !isExpanded && !naturalHeight ? 'h-auto' : ''
        } ${className}`}
      >
        {/* Anchored Sticky Top Handle Bar (Line 3 per Figma Node 1589:1603) */}
        <div
          ref={headerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="sticky top-0 left-0 right-0 w-full bg-white z-30 pt-[12px] pb-[10px] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none shrink-0 group"
          title={isExpanded ? 'Drag down to shrink modal (or tap)' : 'Drag up to fill screen (or tap)'}
        >
          <div className="w-[50px] h-[4.5px] bg-[#7A7A7A] group-hover:bg-[#444444] rounded-full transition-colors pointer-events-none" />
        </div>

        {/* Scrollable Modal Content Stack */}
        <div
          ref={contentRef}
          className={`w-full flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-[20px] pb-[max(32px,env(safe-area-inset-bottom))] flex flex-col items-center gap-[20px] ${contentClassName}`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
