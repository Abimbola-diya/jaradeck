import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { motion, useAnimation, useReducedMotion } from 'motion/react';

// Exact component from @hugeicons-animated/arrow-left-02 registry
// Source: https://hugeicons-animated.com/r/arrow-left-02.json

function useIconAnimation({ controls, loops = false, onMouseEnter, onMouseLeave, ref }) {
  const shouldReduceMotion = useReducedMotion();
  const isControlledRef = useRef(false);
  const isPlayingRef = useRef(false);
  const runRef = useRef(0);

  const startAnimation = useCallback(() => {
    if (shouldReduceMotion || isPlayingRef.current) return;
    isPlayingRef.current = true;
    const run = ++runRef.current;
    controls.set('normal');
    void controls.start('animate').then(() => {
      if (runRef.current === run) isPlayingRef.current = false;
    });
  }, [controls, shouldReduceMotion]);

  const stopAnimation = useCallback(() => {
    if (!loops) return;
    runRef.current++;
    isPlayingRef.current = false;
    void controls.start('normal');
  }, [controls, loops]);

  useImperativeHandle(
    ref,
    () => {
      isControlledRef.current = true;
      return { startAnimation, stopAnimation };
    },
    [startAnimation, stopAnimation]
  );

  const handleMouseEnter = useCallback(
    (event) => {
      onMouseEnter?.(event);
      if (!isControlledRef.current) startAnimation();
    },
    [onMouseEnter, startAnimation]
  );

  const handleMouseLeave = useCallback(
    (event) => {
      onMouseLeave?.(event);
      if (!isControlledRef.current) stopAnimation();
    },
    [onMouseLeave, stopAnimation]
  );

  return { handleMouseEnter, handleMouseLeave };
}

const arrowVariants = {
  normal: { transform: 'translateX(0px) scaleY(1)' },
  animate: {
    transform: [
      'translateX(0px) scaleY(1)',
      'translateX(-2.6px) scaleY(0.94)',
      'translateX(0.3px) scaleY(1.02)',
      'translateX(-0.45px) scaleY(0.99)',
      'translateX(0px) scaleY(1)',
    ],
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
  },
};

const ArrowLeft02Icon = forwardRef(
  ({ onMouseEnter, onMouseLeave, className, size = 28, style, ...props }, ref) => {
    const controls = useAnimation();
    const { handleMouseEnter, handleMouseLeave } = useIconAnimation({
      controls,
      loops: false,
      onMouseEnter,
      onMouseLeave,
      ref,
    });

    return (
      <div
        className={className}
        style={{ display: 'inline-flex', alignItems: 'center', ...style }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          overflow="visible"
          style={{ pointerEvents: 'none' }}
        >
          <motion.g
            variants={arrowVariants}
            animate={controls}
            initial="normal"
            style={{ transformOrigin: '12px 12px' }}
          >
            <path d="M5.5 12.002H19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M10.9999 18.002C10.9999 18.002 4.99998 13.583 4.99997 12.002C4.99996 10.4208 11 6.00195 11 6.00195" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </motion.g>
        </svg>
      </div>
    );
  }
);

ArrowLeft02Icon.displayName = 'ArrowLeft02Icon';

export default ArrowLeft02Icon;
