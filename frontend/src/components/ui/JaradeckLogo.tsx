import React, { useState, useEffect, useRef, useCallback } from 'react';

export type JaradeckLogoSize = 'sm' | 'md' | 'lg' | 'hero' | number;

export interface JaradeckLogoProps {
  size?: JaradeckLogoSize;
  interactive?: boolean;
  enableTilt?: boolean;
  enableFloating?: boolean;
  className?: string;
  onClick?: () => void;
}

export const JaradeckLogo: React.FC<JaradeckLogoProps> = ({
  size = 'md',
  interactive = true,
  enableTilt = true,
  enableFloating = true,
  className = '',
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Compute pixel dimensions based on size prop (native viewBox 68:49)
  let width = 34;
  let height = 24;

  if (typeof size === 'number') {
    width = size;
    height = Math.round((size * 49) / 68);
  } else {
    switch (size) {
      case 'sm':
        width = 28;
        height = 20;
        break;
      case 'md':
        width = 34;
        height = 24;
        break;
      case 'lg':
        width = 44;
        height = 32;
        break;
      case 'hero':
        width = 54;
        height = 39;
        break;
    }
  }

  // Pointer move calculation for 3D magnetic tilt
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !enableTilt || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
      setTilt({ x: Number(x.toFixed(3)), y: Number(y.toFixed(3)) });
    },
    [interactive, enableTilt]
  );

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    setIsPressed(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseDown = () => {
    if (!interactive) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!interactive) return;
    setIsPressed(false);
    setClickCount((c) => c + 1);
    onClick?.();
  };

  // 3D perspective tilt calculations
  const rotateX = isHovered && enableTilt ? -tilt.y * 22 : 0;
  const rotateY = isHovered && enableTilt ? tilt.x * 22 : 0;
  const scale = isPressed ? 0.94 : isHovered ? 1.06 : 1;

  // Layer transforms for accordion fan-out and tactile press
  let topTransform = 'translate(0px, 0px)';
  let middleTransform = 'translate(0px, 0px)';
  let bottomTransform = 'translate(0px, 0px)';

  if (isPressed) {
    topTransform = 'translate(0px, 3px) scale(0.98)';
    middleTransform = 'translate(0px, 1.5px) scale(0.99)';
    bottomTransform = 'translate(0px, 0px)';
  } else if (isHovered) {
    topTransform = 'translate(1.5px, -7px)';
    middleTransform = 'translate(0.8px, -3.5px)';
    bottomTransform = 'translate(0px, 0px)';
  }

  const layerTransition = 'transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      role="img"
      aria-label="Jaradeck Logo"
      data-testid="jaradeck-logo"
      className={`relative inline-flex items-center justify-center select-none overflow-visible ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        perspective: '600px',
      }}
    >
      {/* 3D Tilt Container */}
      <div
        className="w-full h-full relative flex items-center justify-center transition-transform duration-150 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
          willChange: 'transform',
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox="0 -8 68 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* ========================================================== */}
          {/* BOTTOM DECK (Layer 1 - Base anchor)                         */}
          {/* ========================================================== */}
          <g className={!hasEntered ? 'animate-deck-entrance-bottom origin-bottom' : ''}>
            <g
              id="deck-bottom"
              style={{
                transform: bottomTransform,
                transition: layerTransition,
                willChange: 'transform',
              }}
            >
              {/* Front face */}
              <path
                d="M6.46901 35.647H67.9998V48.8859H6.46901V42.2664V35.647Z"
                fill="#0048B3"
              />
              {/* Top face */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M67.9998 35.647H6.46901L0 32.2386H61.3476L67.9998 35.647Z"
                fill="#487DCD"
              />
              {/* Left face */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.46901 35.647V42.2664V48.8859L0 44.9471V32.2386L6.46901 35.647Z"
                fill="#2F6BC4"
              />
            </g>
          </g>

          {/* ========================================================== */}
          {/* MIDDLE DECK (Layer 2 - Floats midway)                       */}
          {/* ========================================================== */}
          <g
            className={
              !hasEntered
                ? 'animate-deck-entrance-middle origin-center'
                : enableFloating && !isHovered && !isPressed
                ? 'animate-deck-float-middle origin-center'
                : ''
            }
          >
            <g
              id="deck-middle"
              style={{
                transform: middleTransform,
                transition: layerTransition,
                willChange: 'transform',
              }}
            >
              {/* Front face */}
              <path
                d="M6.46901 19.7416H67.9998V32.9805H6.46901V19.7416Z"
                fill="#0048B3"
              />
              {/* Top face */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M67.9998 19.7416H6.46901L0 16.3332H61.3476L67.9998 19.7416Z"
                fill="#487DCD"
              />
              {/* Left face */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.46901 19.7416V32.9805L0 29.0416V16.3332L6.46901 19.7416Z"
                fill="#2F6BC4"
              />
            </g>
          </g>

          {/* ========================================================== */}
          {/* TOP DECK (Layer 3 - Highest levitation & fan-out)          */}
          {/* ========================================================== */}
          <g
            className={
              !hasEntered
                ? 'animate-deck-entrance-top origin-top'
                : enableFloating && !isHovered && !isPressed
                ? 'animate-deck-float-top origin-top'
                : ''
            }
          >
            <g
              id="deck-top"
              style={{
                transform: topTransform,
                transition: layerTransition,
                willChange: 'transform',
              }}
            >
              {/* Front face */}
              <path
                d="M6.46901 3.40838H67.9998V16.6473H6.46901V3.40838Z"
                fill="#0048B3"
              />
              {/* Top face */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M67.9998 3.40838H6.46901L0 0H61.3476L67.9998 3.40838Z"
                fill="#487DCD"
              />
              {/* Left face */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.46901 3.40838V16.6473L0 12.7085V0L6.46901 3.40838Z"
                fill="#2F6BC4"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Secret Playful Easter Egg Badge on Multi-clicks */}
      {clickCount >= 5 && clickCount % 5 === 0 && (
        <span className="absolute -top-3 -right-3 bg-[#0048B3] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-bounce shadow-sm pointer-events-none">
          ✨ {clickCount}x!
        </span>
      )}
    </div>
  );
};

export default JaradeckLogo;
