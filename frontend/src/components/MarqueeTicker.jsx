import React, { useState, useEffect, useRef } from 'react';

// ── 7 Vector Shape Icon Components with darker colors & larger size ─────

function SemiCircleShape({ fill = '#D84315', size = 44 }) {
  return (
    <svg width={size} height={Math.round(size * 0.57)} viewBox="0 0 74 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M33.3441 0.0802857C36.0225 -0.084269 39.0509 0.0212877 41.7352 0.241501C42.5192 0.305801 43.7565 0.791051 44.5537 0.953416C49.0794 1.87471 52.8727 3.79164 56.8024 6.12802C57.5265 6.55853 59.0967 7.96623 59.8157 8.56234C64.5021 12.4483 68.2411 17.3442 70.371 23.0785C70.9615 24.6682 71.8693 26.7882 72.1468 28.4975C72.5264 30.8365 74.0104 39.23 72.9066 40.9732C72.4367 41.3514 62.9625 41.1794 61.5078 41.1786L39.9808 41.1737L13.1338 41.1845L5.51424 41.1923C3.96192 41.1969 1.64156 41.1494 0.172088 41.4131C0.0499398 39.0205 -0.108738 34.7377 0.105482 32.3516C0.717262 26.4551 2.9936 20.5221 6.21775 15.5689C6.7242 14.7909 8.68295 12.2578 9.33115 11.5575C13.0713 7.58435 17.8149 4.45493 22.8509 2.36838C25.8808 1.11302 30.0841 0.250833 33.3441 0.0802857Z" fill={fill}/>
    </svg>
  );
}

function BumpyStarShape({ fill = '#C62828', size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M42.6058 57.5796C42.1316 58.4331 41.3693 59.1723 40.8757 60.1285C39.5249 62.7446 39.6308 66.0696 36.8683 67.7039C35.7057 68.3916 33.3673 68.4466 32.1794 68.104C28.7281 67.1086 28.2232 62.0184 26.7462 59.2535C25.3053 56.5562 21.969 56.7286 19.4925 57.6597C17.1971 58.5228 14.8485 60.5716 12.035 59.8278C10.7837 59.497 9.50978 58.5389 8.95216 57.4266C7.05333 53.6385 9.89915 49.9649 11.1345 46.5657C11.5146 45.5198 11.1712 44.4651 10.6958 43.5299C8.30788 38.8317 3.08304 40.7539 0.576809 37.0197C-0.1305 35.9659 -0.0974291 32.9452 0.198608 31.8456C0.915251 29.1839 6.44777 27.9553 8.67237 26.7474C9.56198 26.2643 10.273 25.5372 10.7283 24.6082C12.8615 20.2426 6.87759 16.051 8.49053 11.4732C10.0158 7.14418 15.0351 7.8539 18.124 9.75181C20.3556 11.123 22.3097 11.9579 24.7585 10.6211C26.753 9.53252 27.3651 7.83316 27.9111 5.773C28.464 3.96325 29.2735 1.53756 31.111 0.694623C32.2955 0.106121 34.8557 -0.258712 36.0409 0.222392C39.2665 1.53203 39.3717 4.98987 40.5883 7.62643C41.2169 8.98862 42.6652 10.6013 44.1001 11.031C46.4177 11.8424 48.1564 10.6105 50.1231 9.56467C53.4813 7.779 57.3194 7.34503 59.3075 11.3509C60.8818 14.5232 58.3622 17.1883 57.4284 20.1411C56.8905 21.842 56.7435 23.4192 57.5569 25.0774C58.5262 27.0302 59.9828 27.1274 61.6184 27.7888C63.615 28.5961 66.7443 29.4234 67.6595 31.4811C68.2182 32.7372 68.2965 35.0679 67.8364 36.3366C66.7313 39.2216 63.0531 39.388 60.575 40.5745C55.2582 43.12 56.8506 47.086 58.8575 51.2743C59.0724 51.8679 59.4684 53.0518 59.7316 53.5681C60.0343 54.7748 59.9275 55.5054 59.3558 56.6338C57.8736 59.9103 55.0219 60.8653 51.8029 59.1831C48.5385 57.4773 46.4078 56.4084 42.6058 57.5796Z" fill={fill}/>
    </svg>
  );
}

function TriangleShape({ fill = '#BF360C', size = 38 }) {
  return (
    <svg width={size} height={Math.round(size * 0.78)} viewBox="0 0 61 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30.3125 0L60.6234 48H0.00161171L30.3125 0Z" fill={fill}/>
    </svg>
  );
}

function PinkSemiCircleShape({ fill = '#C2185B', size = 44 }) {
  return (
    <svg width={size} height={Math.round(size * 0.57)} viewBox="0 0 73 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.53575 27.8954C2.68464 18.5189 8.48174 10.3854 16.644 5.29493C20.7942 2.71219 25.2176 1.02619 30.0904 0.22151C31.4704 -0.00642392 34.1475 0.0475056 35.5865 0.0153552C39.0322 -0.0618518 41.9062 0.132894 45.2493 1.04094C46.596 1.40669 47.4435 1.77786 48.7419 2.27383C49.8626 2.70193 50.9085 2.97238 52.0422 3.46939C53.3913 4.061 54.2769 4.84702 55.4532 5.54476C60.1389 8.32398 63.8555 11.8823 66.7157 16.5309C68.9311 20.1317 70.5386 23.3802 71.4461 27.5595C71.5774 28.1988 72.0571 29.1104 72.1248 29.7369C72.3517 31.8357 72.4678 34.0111 72.5747 36.1191C72.6055 36.7261 72.8379 39.6728 72.7199 39.9974C72.4181 40.405 72.3061 40.8545 71.8638 40.8734C69.4159 40.9775 66.8501 40.8659 64.4006 40.8889L42.21 40.904L13.2294 40.905C10.8549 40.9005 8.45316 40.872 6.08186 40.8867C4.54107 40.8961 3.3825 41.105 1.75862 40.9932C1.4968 40.7191 1.54578 40.643 1.18152 40.4741L1.38261 41.2086C0.965228 41.1956 0.554302 41.2368 0.228765 40.9965C-0.330582 40.0876 0.279814 29.3076 0.53575 27.8954Z" fill={fill}/>
    </svg>
  );
}

function MultiPointStarShape({ fill = '#00838F', size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M33.3121 0.0397992C34.0153 0.0162914 35.0514 -0.0641418 35.7254 0.104677C41.5553 1.56516 38.6039 9.45283 44.5213 10.8581C48.3294 11.7625 50.9528 8.48083 54.545 8.01264C55.9186 7.83356 57.4211 8.71476 58.4173 9.57637C60.0088 10.6659 60.4983 13.7929 59.7075 15.5479C58.5774 17.9212 57.0221 20.4506 57.3011 23.2237C57.9444 29.6189 67.999 26.5408 68.5217 33.5369C68.7491 36.5803 66.5886 38.4965 63.9757 39.441C61.0991 40.4806 57.9551 40.8504 57.3436 44.527C56.5759 48.3224 59.6518 50.5991 60.0398 54.092C60.1768 55.3264 59.9457 56.7645 59.0726 57.7058C54.3682 63.1203 50.7855 56.4576 45.1127 57.0612C38.184 57.7986 42.0948 67.4322 35.3475 67.964C33.424 68.053 32.7117 68.1798 30.9187 67.4717C30.0535 66.3693 29.4322 65.3902 28.8888 64.083C28.0871 62.1546 27.7254 59.1793 25.9308 57.8698C23.1726 55.8914 19.3648 57.6772 16.6337 58.885C14.5006 59.8285 12.8607 60.644 10.7087 58.9792C9.9463 58.3781 9.35031 57.5919 8.97764 56.6954C6.76802 51.3257 13.8652 47.5124 10.4378 42.633C7.67929 38.7059 0.924025 40.46 0.101943 34.9231C-1.005 27.4672 7.1975 29.2825 10.4291 25.4584C13.2369 22.1359 9.08066 17.5656 8.6475 14.1275C8.30502 11.6702 9.20661 9.64527 11.5106 8.54479C15.7615 6.51447 18.8497 11.5713 23.2395 11.036C30.4165 10.1609 26.2044 0.901868 33.3121 0.0397992Z" fill={fill}/>
    </svg>
  );
}

function SparkleStarShape({ fill = '#FF1744', size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 0C24 13.2548 13.2548 24 0 24C13.2548 24 24 34.7452 24 48C24 34.7452 34.7452 24 48 24C34.7452 24 24 13.2548 24 0Z" fill={fill}/>
    </svg>
  );
}

function FourPointStarShape({ fill = '#1B5E20', size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 63 63" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M27.7553 3.04288C28.3504 2.22564 27.9562 -0.00287807 28.8236 2.79049e-06C29.781 0.668247 29.5169 1.86185 30.1261 2.57399C31.2696 9.08462 35.7225 16.1551 40.6591 20.6161C42.0784 21.8987 44.2005 23.1464 45.7311 24.427C46.8733 25.3827 48.7533 26.0648 49.9491 27.1125C51.2694 27.6416 52.7846 28.2521 54.1252 28.6862C54.9305 28.9469 56.0311 29.5278 56.7268 29.6714C58.6914 30.077 60.4364 30.8262 62.3157 31.4034C60.6238 31.9518 59.1998 31.7799 57.7936 32.2301C55.4258 33.0299 52.9819 33.7268 50.6705 34.6783C49.5222 35.151 48.3276 36.0529 47.2006 36.6198C40.2078 40.1376 35.7161 46.0262 32.2 52.8397C30.7653 55.62 30.1303 59.3125 29.0772 62.2875C28.9943 62.5334 28.9191 62.7035 28.6988 62.8357C27.6196 62.7389 27.61 59.7813 27.2087 58.974C26.0562 56.6561 25.3731 53.3807 24.2174 51.1795C18.9948 41.2314 10.8999 34.8714 0.120979 31.9321C0.0584071 31.6178 0.0192285 31.2992 0.00390228 30.979C-0.0143047 30.5953 0.024183 30.305 0.270554 30.03C1.54055 29.7497 2.48547 29.0914 3.59046 28.7678C10.5318 26.7353 16.4043 22.7799 20.7529 17.0031C23.9941 12.6973 26.3461 8.28317 27.7553 3.04288Z" fill={fill}/>
    </svg>
  );
}

function DiamondShape({ fill = '#FFD700', size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,2 38,20 20,38 2,20" fill={fill} />
    </svg>
  );
}

function PillShape({ fill = '#00E5FF', size = 38 }) {
  return (
    <svg width={size} height={Math.round(size * 0.55)} viewBox="0 0 50 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="50" height="28" rx="14" fill={fill} />
    </svg>
  );
}

function CrossStarShape({ fill = '#FF3366', size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0L24 16L40 20L24 24L20 40L16 24L0 20L16 16Z" fill={fill} />
    </svg>
  );
}

function ArchShape({ fill = '#00E676', size = 38 }) {
  return (
    <svg width={size} height={Math.round(size * 0.75)} viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 30V15C0 6.71573 6.71573 0 15 0H25C33.2843 0 40 6.71573 40 15V30H0Z" fill={fill} />
    </svg>
  );
}

function RingCircleShape({ fill = '#FFFFFF', size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0ZM20 28C15.5817 28 12 24.4183 12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28Z" fill={fill} />
    </svg>
  );
}

function HexBadgeShape({ fill = '#FF6D00', size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="20,2 37,11 37,29 20,38 3,29 3,11" fill={fill} />
    </svg>
  );
}

// Helper to render icon by shape name with large size
function DynamicIcon({ shape, color }) {
  switch (shape) {
    case 'sparkle':
      return <SparkleStarShape fill={color} size={36} />;
    case 'semi':
      return <SemiCircleShape fill={color} size={38} />;
    case 'bumpy':
      return <BumpyStarShape fill={color} size={36} />;
    case 'triangle':
      return <TriangleShape fill={color} size={32} />;
    case 'pink_semi':
      return <PinkSemiCircleShape fill={color} size={38} />;
    case 'multi_star':
      return <MultiPointStarShape fill={color} size={36} />;
    case 'four_star':
      return <FourPointStarShape fill={color} size={36} />;
    case 'diamond':
      return <DiamondShape fill={color} size={36} />;
    case 'pill':
      return <PillShape fill={color} size={36} />;
    case 'cross_star':
      return <CrossStarShape fill={color} size={36} />;
    case 'arch':
      return <ArchShape fill={color} size={36} />;
    case 'ring_circle':
      return <RingCircleShape fill={color} size={36} />;
    case 'hex_badge':
      return <HexBadgeShape fill={color} size={36} />;
    default:
      return <SparkleStarShape fill={color} size={36} />;
  }
}

// ── 15 Phrases for Row 1 (Right to Left) ──────────────────────────────────────

const ALL_PHRASES_ROW1 = [
  { text: "Photographer to pepper them\non your birthday shoot", shape: 'sparkle', color: '#FF3B30' },
  { text: "Videographer for that\n3-day non-stop Owambe", shape: 'semi', color: '#FF6B00' },
  { text: "Ghostwriter for the book\nyou keep talking about", shape: 'four_star', color: '#059669' },
  { text: "Brand strategist who\nunderstands the culture", shape: 'pink_semi', color: '#EC4899' },
  { text: "Brand designer who won't\njust copy Pinterest templates", shape: 'bumpy', color: '#E086FF' },
  { text: "Content creator so your brand\nstops posting generic quotes", shape: 'triangle', color: '#E65100' },
  { text: "Motion designer for a\nproper, slick product launch", shape: 'multi_star', color: '#00E5FF' },
  { text: "Voiceover artist with\nzero fake oyinbo accent", shape: 'four_star', color: '#10B981' },
  { text: "Scriptwriter for skits\nthat are genuinely funny", shape: 'four_star', color: '#D946EF' },
  { text: "3D artist for renders\nthat blow minds", shape: 'bumpy', color: '#D97706' },
  { text: "Copywriter to kill corporate\nbuzzwords and AI slop", shape: 'semi', color: '#FFFFFF' },
  { text: "Frontend dev who actually\ntests on mobile screens", shape: 'sparkle', color: '#FF1744' },
  { text: "Web3 builder who writes\ntight smart contracts", shape: 'pink_semi', color: '#E11D48' },
  { text: "Landing page dev to convert\ntraffic into signups day one", shape: 'triangle', color: '#059669' },
  { text: "Backend dev whose APIs won’t\ncollapse at 100 users", shape: 'multi_star', color: '#E086FF' },
];

// ── 12 Phrases for Row 2 (Left to Right) ──────────────────────────────────────

const ALL_PHRASES_ROW2 = [
  { text: "UI/UX Designer so your web app\ndoesn’t look like Inec's IREV portal", shape: 'semi', color: '#FFD700' },
  { text: "Social Media Manager so your business\npage finally stops replying \"DM for price\"", shape: 'four_star', color: '#00E5FF' },
  { text: "Video Editor to turn raw phone clips\ninto snappy Reels before the trend dies", shape: 'sparkle', color: '#FF3366' },
  { text: "Graphic Designer for flyers that\ndon’t look like a church crusade banner", shape: 'pink_semi', color: '#00E676' },
  { text: "Photographer to capture your birthday\ndrip before the sweat ruins the look", shape: 'multi_star', color: '#FFFFFF' },
  { text: "DM Closer / VA to attend to customers\nbefore they take their money to competitor", shape: 'triangle', color: '#FF6D00' },
  { text: "Content Creator who can hold a mic\non the street without sounding awkward", shape: 'bumpy', color: '#D500F9' },
  { text: "Instagram Ads Expert who won't burn\nyour last ₦50k budget on zero conversions", shape: 'sparkle', color: '#FFD700' },
  { text: "Event MC who can hype up your\nguests without making tacky jokes", shape: 'pink_semi', color: '#FF3366' },
  { text: "Makeup Artist for a clean facebeat\nthat can actually survive Lagos heat", shape: 'four_star', color: '#00E5FF' },
  { text: "Mobile App Dev whose app won't consume\n200MB data just to open login screen", shape: 'semi', color: '#00E676' },
  { text: "Pitch Deck Designer to get straight to\nthe point before investors close tab", shape: 'bumpy', color: '#FFFFFF' },
];

export default function MarqueeTicker({ onSelectPhrase }) {
  // Row 1 Cards (Right to Left)
  const [cardsRow1] = useState(() => {
    const initial = [];
    let lastIdx = -1;
    for (let i = 0; i < 25; i++) {
      let nextIdx = Math.floor(Math.random() * ALL_PHRASES_ROW1.length);
      while (nextIdx === lastIdx) {
        nextIdx = Math.floor(Math.random() * ALL_PHRASES_ROW1.length);
      }
      initial.push({ ...ALL_PHRASES_ROW1[nextIdx], id: `r1-${i}` });
      lastIdx = nextIdx;
    }
    return initial;
  });

  // Row 2 Cards (Left to Right)
  const [cardsRow2] = useState(() => {
    const initial = [];
    let lastIdx = -1;
    for (let i = 0; i < 25; i++) {
      let nextIdx = Math.floor(Math.random() * ALL_PHRASES_ROW2.length);
      while (nextIdx === lastIdx) {
        nextIdx = Math.floor(Math.random() * ALL_PHRASES_ROW2.length);
      }
      initial.push({ ...ALL_PHRASES_ROW2[nextIdx], id: `r2-v3-${i}` });
      lastIdx = nextIdx;
    }
    return initial;
  });

  const trackRefRow1 = useRef(null);
  const trackRefRow2 = useRef(null);
  const xOffsetRow1 = useRef(0);
  const xOffsetRow2 = useRef(0);
  const isInitializedRow2 = useRef(false);
  const requestRef = useRef(null);

  useEffect(() => {
    const speed = 1.35; // Pixels per frame

    // Pre-fill Row 2's left off-screen buffer so cards roll in from the far left edge immediately
    if (trackRefRow2.current && !isInitializedRow2.current) {
      let initialLeftBufferOffset = 0;
      const children = trackRefRow2.current.children;
      const count = Math.min(12, children.length);
      for (let i = 0; i < count; i++) {
        initialLeftBufferOffset += children[i].offsetWidth;
      }
      xOffsetRow2.current = -initialLeftBufferOffset;
      isInitializedRow2.current = true;
    }

    const animate = () => {
      // ── Row 1: Right to Left ──────────────────────────────────────────────
      xOffsetRow1.current -= speed;
      if (trackRefRow1.current && trackRefRow1.current.firstElementChild) {
        const firstChild = trackRefRow1.current.firstElementChild;
        const firstChildWidth = firstChild.offsetWidth;

        if (Math.abs(xOffsetRow1.current) >= firstChildWidth) {
          xOffsetRow1.current += firstChildWidth;
          trackRefRow1.current.appendChild(firstChild);
        }
        trackRefRow1.current.style.transform = `translate3d(${xOffsetRow1.current}px, 0, 0)`;
      }

      // ── Row 2: Left to Right ──────────────────────────────────────────────
      xOffsetRow2.current += speed;
      if (trackRefRow2.current && trackRefRow2.current.lastElementChild) {
        const lastChild = trackRefRow2.current.lastElementChild;
        const lastChildWidth = lastChild.offsetWidth;

        if (xOffsetRow2.current >= lastChildWidth) {
          xOffsetRow2.current -= lastChildWidth;
          trackRefRow2.current.insertBefore(lastChild, trackRefRow2.current.firstElementChild);
        }
        trackRefRow2.current.style.transform = `translate3d(${xOffsetRow2.current}px, 0, 0)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="marquee-single-container" aria-label="Jaradeck Talent Services Ticker">
      {/* Row 1: Right to Left */}
      <div className="marquee-row marquee-row-left">
        <div className="marquee-track" ref={trackRefRow1}>
          {cardsRow1.map((item) => (
            <div key={item.id} className="marquee-card-wrapper">
              <div 
                className="marquee-glass-card"
                onClick={() => onSelectPhrase && onSelectPhrase(item.text.replace('\n', ' '))}
              >
                <span className="marquee-card-icon">
                  <DynamicIcon shape={item.shape} color={item.color} />
                </span>
                <span className="marquee-card-text">{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Left to Right */}
      <div className="marquee-row marquee-row-right">
        <div className="marquee-track" ref={trackRefRow2}>
          {cardsRow2.map((item) => (
            <div key={item.id} className="marquee-card-wrapper">
              <div 
                className="marquee-glass-card"
                onClick={() => onSelectPhrase && onSelectPhrase(item.text.replace('\n', ' '))}
              >
                <span className="marquee-card-icon">
                  <DynamicIcon shape={item.shape} color={item.color} />
                </span>
                <span className="marquee-card-text">{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
