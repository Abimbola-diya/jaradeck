import React from 'react';

export default function StadiumIllustration() {
  return (
    <div className="stadium-wrapper">
      <svg 
        viewBox="0 0 1200 580" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="stadium-svg"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="skyGradient" x1="600" y1="0" x2="600" y2="350" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0048CC" stopOpacity="0" />
            <stop offset="100%" stopColor="#0035A0" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="roofGrad" x1="600" y1="190" x2="600" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D5DFEA" />
          </linearGradient>

          <linearGradient id="bowlGrad" x1="600" y1="230" x2="600" y2="420" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A3038" />
            <stop offset="50%" stopColor="#1E232A" />
            <stop offset="100%" stopColor="#14181D" />
          </linearGradient>

          <linearGradient id="grassGrad" x1="600" y1="410" x2="600" y2="580" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4D8A31" />
            <stop offset="100%" stopColor="#376822" />
          </linearGradient>

          <linearGradient id="plazaGrad" x1="600" y1="400" x2="600" y2="440" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6C7A89" />
            <stop offset="100%" stopColor="#4A5563" />
          </linearGradient>

          <linearGradient id="walkwayGrad" x1="700" y1="430" x2="850" y2="580" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7E8B9B" />
            <stop offset="100%" stopColor="#55606E" />
          </linearGradient>

          <filter id="archShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        <rect x="0" y="0" width="1200" height="350" fill="url(#skyGradient)" />

        <g id="stadium-body">
          <path 
            d="M 120 330 C 120 220, 300 200, 600 200 C 900 200, 1080 220, 1080 330 C 1080 380, 950 420, 600 420 C 250 420, 120 380, 120 330 Z" 
            fill="url(#bowlGrad)" 
          />

          <path d="M 170 310 Q 600 240 1030 310 L 1020 325 Q 600 255 180 325 Z" fill="#3F4752" opacity="0.8" />
          <path d="M 150 340 Q 600 270 1050 340 L 1040 358 Q 600 288 160 358 Z" fill="#333A44" />
          <path d="M 135 370 Q 600 300 1065 370 L 1055 390 Q 600 320 145 390 Z" fill="#262C34" />

          {Array.from({ length: 24 }).map((_, i) => {
            const x = 180 + i * 36;
            const y1 = 285 + Math.sin((i / 23) * Math.PI) * -35;
            return (
              <rect key={`slit-${i}`} x={x} y={y1} width="14" height="22" rx="3" fill="#55606E" opacity="0.65" />
            );
          })}

          <path 
            d="M 100 310 C 100 210, 280 180, 600 180 C 920 180, 1100 210, 1100 310 Q 600 220 100 310 Z" 
            fill="url(#roofGrad)" 
            filter="url(#archShadow)"
          />
          <path d="M 150 290 Q 600 210 1050 290 Q 600 235 150 290 Z" fill="#FFFFFF" />

          <g id="stadium-arches" filter="url(#archShadow)">
            <path d="M 115 315 Q 150 210 160 210 L 170 215 Q 160 310 140 375 Z" fill="#606C7B" />
            <path d="M 125 315 Q 155 210 160 210 L 165 212 Q 155 310 135 375 Z" fill="#7D8A9C" />

            <path d="M 210 325 Q 260 200 275 200 L 285 205 Q 270 315 240 395 Z" fill="#525E6D" />
            <path d="M 220 325 Q 265 200 275 200 L 280 202 Q 265 315 230 395 Z" fill="#748293" />

            <path d="M 330 335 Q 380 190 400 190 L 412 195 Q 390 320 360 410 Z" fill="#4B5664" />
            <path d="M 340 335 Q 385 190 400 190 L 406 192 Q 385 320 350 410 Z" fill="#6B7888" />

            <path d="M 460 340 Q 510 185 530 185 L 542 190 Q 520 325 490 418 Z" fill="#434E5B" />
            <path d="M 470 340 Q 515 185 530 185 L 536 187 Q 515 325 480 418 Z" fill="#637080" />

            <path d="M 660 185 Q 680 185 730 340 L 705 418 Q 675 325 653 190 Z" fill="#3D4753" />
            <path d="M 660 185 Q 675 185 715 340 L 705 418 Q 670 325 650 187 Z" fill="#586574" />

            <path d="M 790 190 Q 810 190 860 335 L 830 410 Q 805 320 783 195 Z" fill="#45505C" />
            <path d="M 790 190 Q 805 190 845 335 L 830 410 Q 795 320 780 192 Z" fill="#606D7C" />

            <path d="M 915 200 Q 935 200 985 325 L 950 395 Q 925 315 905 205 Z" fill="#4E5967" />
            <path d="M 915 200 Q 930 200 970 325 L 950 395 Q 915 315 900 202 Z" fill="#6B7787" />

            <path d="M 1030 210 Q 1045 210 1080 315 L 1055 375 Q 1035 310 1020 215 Z" fill="#586473" />
            <path d="M 1030 210 Q 1040 210 1070 315 L 1055 375 Q 1025 310 1015 212 Z" fill="#758292" />
          </g>

          <path d="M 60 410 L 1140 410 L 1200 440 L 0 440 Z" fill="url(#plazaGrad)" />
          <path d="M 100 422 L 1100 422 L 1130 432 L 70 432 Z" fill="#3A434E" opacity="0.6" />
        </g>

        <g id="walkway">
          <path d="M 710 430 L 780 430 L 980 580 L 720 580 Z" fill="url(#walkwayGrad)" />
          <path d="M 710 430 L 725 430 L 740 580 L 720 580 Z" fill="#9FB0C3" opacity="0.3" />
        </g>

        <g id="foreground-grass">
          <path d="M -50 580 L -50 430 Q 150 410 350 450 Q 550 490 680 440 L 730 580 Z" fill="url(#grassGrad)" />
          <path d="M 760 580 L 770 435 Q 950 420 1250 430 L 1250 580 Z" fill="url(#grassGrad)" />
        </g>

        <g id="trees">
          <g transform="translate(110, 410)">
            <rect x="35" y="40" width="10" height="40" fill="#2E2419" rx="2" />
            <circle cx="20" cy="30" r="32" fill="#3D6A23" />
            <circle cx="45" cy="20" r="35" fill="#4B812C" />
            <circle cx="65" cy="32" r="28" fill="#345B1E" />
            <circle cx="40" cy="12" r="26" fill="#589634" />
          </g>

          <g transform="translate(10, 420)">
            <rect x="25" y="30" width="8" height="35" fill="#2E2419" rx="2" />
            <circle cx="15" cy="25" r="24" fill="#345B1E" />
            <circle cx="32" cy="18" r="26" fill="#457629" />
            <circle cx="45" cy="28" r="20" fill="#3D6A23" />
          </g>

          <g transform="translate(380, 425)">
            <rect x="65" y="35" width="12" height="45" fill="#2B2117" rx="3" />
            <circle cx="35" cy="25" r="35" fill="#365E20" />
            <circle cx="70" cy="10" r="42" fill="#4E872E" />
            <circle cx="105" cy="25" r="38" fill="#3F6F25" />
            <circle cx="70" cy="-5" r="30" fill="#5CA037" />
          </g>

          <g transform="translate(980, 415)">
            <rect x="45" y="35" width="9" height="40" fill="#2E2419" rx="2" />
            <circle cx="25" cy="25" r="28" fill="#396322" />
            <circle cx="50" cy="15" r="32" fill="#4E872E" />
            <circle cx="72" cy="28" r="26" fill="#345B1E" />
          </g>
        </g>
      </svg>
    </div>
  );
}
