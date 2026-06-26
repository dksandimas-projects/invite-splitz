import * as React from "react";

interface BotanicalVinesProps {
  className?: string;
  isRightSide?: boolean;
}

// Render a single delicate baby's breath blossom with a soft outline and yellow center
function renderBlossom(x: number, y: number, key: string, scale = 1.0) {
  const r1 = 1.8 * scale;
  const r2 = 2.0 * scale;
  const r3 = 1.9 * scale;
  const r4 = 1.7 * scale;
  const r5 = 1.6 * scale;
  const rBase = 2.2 * scale;
  const rCenter = 0.8 * scale;

  return (
    <g key={key} className="botanical-blossom">
      {/* Blossom green base sepals for depth and visual separation */}
      <circle cx={x} cy={y} r={rBase} fill="#B5CC6E" opacity="0.65" />
      {/* Surrounding white petals with a very thin outline to pop against the off-white page background */}
      <circle cx={x - 1.8 * scale} cy={y - 1.3 * scale} r={r1} fill="#FFFFFF" stroke="#8E928A" strokeWidth={0.2 * scale} opacity="0.95" />
      <circle cx={x + 1.8 * scale} cy={y - 1.7 * scale} r={r2} fill="#FFFFFF" stroke="#8E928A" strokeWidth={0.2 * scale} opacity="0.98" />
      <circle cx={x - 1.3 * scale} cy={y + 1.7 * scale} r={r3} fill="#FFFFFF" stroke="#8E928A" strokeWidth={0.2 * scale} opacity="0.95" />
      <circle cx={x + 1.3 * scale} cy={y + 1.3 * scale} r={r4} fill="#FFFFFF" stroke="#8E928A" strokeWidth={0.2 * scale} opacity="0.92" />
      <circle cx={x} cy={y - 2.2 * scale} r={r5} fill="#FFFFFF" stroke="#8E928A" strokeWidth={0.2 * scale} opacity="0.95" />
      {/* Golden center pollen point */}
      <circle cx={x} cy={y} r={rCenter} fill="#E8C800" />
    </g>
  );
}

// Render a cluster of blossoms (representing the fluffy cloud structure of baby's breath)
function renderBlossomCluster(x: number, y: number, key: string) {
  return (
    <g key={key}>
      {/* Main Blossom */}
      {renderBlossom(x, y, `${key}-main`, 1.6)}
      {/* Offset secondary blossom */}
      {renderBlossom(x + 5.0, y - 3.5, `${key}-sec1`, 1.3)}
      {/* Offset tertiary blossom */}
      {renderBlossom(x - 4.5, y - 4.0, `${key}-sec2`, 1.0)}
    </g>
  );
}

export function BotanicalVines({ className = "", isRightSide = false }: BotanicalVinesProps) {
  return (
    <svg
      className={`${className} ${isRightSide ? "-scale-x-100" : ""}`}
      viewBox="0 0 100 800"
      width="100"
      height="800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        {/* Soft golden glow */}
        <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <style>{`
        @keyframes botanicalSwayMain {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(0.6deg); }
        }
        @keyframes botanicalSwayR1 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.5deg); }
        }
        @keyframes botanicalSwayL1 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-1.5deg); }
        }
        @keyframes botanicalSwayR2 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes botanicalSwayL2 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-2deg); }
        }
        @keyframes botanicalSwayR3 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2.5deg); }
        }
        @keyframes botanicalSwayL3 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-2.5deg); }
        }
        @keyframes botanicalGoldFlow {
          0% { stroke-dashoffset: 160; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes botanicalGoldPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.85; }
        }
        
        .botanical-sway-main {
          transform-origin: 20px 800px;
          animation: botanicalSwayMain 18s ease-in-out infinite;
        }
        .botanical-branch-r1 {
          transform-origin: 21px 680px;
          animation: botanicalSwayR1 12s ease-in-out infinite;
        }
        .botanical-branch-l1 {
          transform-origin: 18px 580px;
          animation: botanicalSwayL1 10s ease-in-out infinite;
        }
        .botanical-branch-r2 {
          transform-origin: 21px 460px;
          animation: botanicalSwayR2 13s ease-in-out infinite;
        }
        .botanical-branch-l2 {
          transform-origin: 20px 350px;
          animation: botanicalSwayL2 9.5s ease-in-out infinite;
        }
        .botanical-branch-r3 {
          transform-origin: 23px 240px;
          animation: botanicalSwayR3 14s ease-in-out infinite;
        }
        .botanical-branch-l3 {
          transform-origin: 23px 130px;
          animation: botanicalSwayL3 8.5s ease-in-out infinite;
        }
        .botanical-filament {
          stroke-dasharray: 8 32;
          animation: botanicalGoldFlow 7s linear infinite, botanicalGoldPulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Main Vine Group */}
      <g className="botanical-sway-main">
        {/* Main stem (wispy but clear) */}
        <path
          d="M 20 800 C 35 700, 15 580, 25 480 C 35 380, 18 280, 28 180 C 35 120, 20 70, 25 20"
          stroke="#2C2B28"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Glowing golden filament running along the stem */}
        <path
          d="M 20 800 C 35 700, 15 580, 25 480 C 35 380, 18 280, 28 180 C 35 120, 20 70, 25 20"
          stroke="#E8C800"
          strokeWidth="1.0"
          strokeLinecap="round"
          filter="url(#gold-glow)"
          className="botanical-filament"
        />

        {/* Top Stem Blossom Cluster */}
        {renderBlossomCluster(25, 20, "main-top")}

        {/* Branch A (Right, Lower) - Dichotomous Baby's Breath structure */}
        <g className="botanical-branch-r1">
          {/* Base branch */}
          <path d="M 21 680 C 35 660, 50 630, 45 590" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 21 680 C 35 660, 50 630, 45 590" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch A1 */}
          <path d="M 45 590 C 55 570, 65 550, 60 520" stroke="#2C2B28" strokeWidth="1.0" />
          {/* Twig A1a & A1b */}
          <path d="M 60 520 C 65 505, 75 495, 70 475" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 60 520 C 55 505, 50 495, 52 480" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch A2 */}
          <path d="M 45 590 C 35 570, 30 555, 32 540" stroke="#2C2B28" strokeWidth="1.0" />
          {/* Twig A2a & A2b */}
          <path d="M 32 540 C 38 525, 42 515, 40 500" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 32 540 C 25 525, 20 515, 22 495" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(70, 475, "a1a")}
          {renderBlossomCluster(52, 480, "a1b")}
          {renderBlossomCluster(40, 500, "a2a")}
          {renderBlossomCluster(22, 495, "a2b")}
        </g>

        {/* Branch B (Left, Lower) - Dichotomous Baby's Breath structure */}
        <g className="botanical-branch-l1">
          <path d="M 18 580 C 12 560, 5 535, 10 500" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 18 580 C 12 560, 5 535, 10 500" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch B1 */}
          <path d="M 10 500 C 15 480, 18 460, 12 430" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 12 430 C 16 415, 22 405, 18 390" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 12 430 C 8 415, 2 405, 4 390" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch B2 */}
          <path d="M 10 500 C 5 480, 2 465, 4 450" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 4 450 C 8 435, 12 425, 10 410" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 4 450 C 0 435, -2 425, 0 410" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(18, 390, "b1a")}
          {renderBlossomCluster(4, 390, "b1b")}
          {renderBlossomCluster(10, 410, "b2a")}
          {renderBlossomCluster(0, 410, "b2b")}
        </g>

        {/* Branch C (Right, Middle) */}
        <g className="botanical-branch-r2">
          <path d="M 21 460 C 35 440, 50 410, 45 370" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 21 460 C 35 440, 50 410, 45 370" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch C1 */}
          <path d="M 45 370 C 55 350, 65 330, 60 300" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 60 300 C 65 285, 75 275, 70 255" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 60 300 C 55 285, 50 275, 52 260" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch C2 */}
          <path d="M 45 370 C 35 350, 30 335, 32 320" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 32 320 C 38 305, 42 295, 40 280" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 32 320 C 25 305, 20 295, 22 275" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(70, 255, "c1a")}
          {renderBlossomCluster(52, 260, "c1b")}
          {renderBlossomCluster(40, 280, "c2a")}
          {renderBlossomCluster(22, 275, "c2b")}
        </g>

        {/* Branch D (Left, Middle) */}
        <g className="botanical-branch-l2">
          <path d="M 20 350 C 14 330, 6 305, 12 270" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 20 350 C 14 330, 6 305, 12 270" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch D1 */}
          <path d="M 12 270 C 18 250, 22 230, 15 200" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 15 200 C 20 185, 26 175, 22 160" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 15 200 C 10 185, 5 175, 8 160" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch D2 */}
          <path d="M 12 270 C 6 250, 2 235, 5 220" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 5 220 C 10 205, 14 195, 12 180" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 5 220 C 0 205, -2 195, 0 180" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(22, 160, "d1a")}
          {renderBlossomCluster(8, 160, "d1b")}
          {renderBlossomCluster(12, 180, "d2a")}
          {renderBlossomCluster(0, 180, "d2b")}
        </g>

        {/* Branch E (Right, Upper) */}
        <g className="botanical-branch-r3">
          <path d="M 23 240 C 37 220, 52 190, 47 150" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 23 240 C 37 220, 52 190, 47 150" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch E1 */}
          <path d="M 47 150 C 57 130, 67 110, 62 80" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 62 80 C 67 65, 77 55, 72 35" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 62 80 C 57 65, 52 55, 54 40" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch E2 */}
          <path d="M 47 150 C 37 130, 30 115, 32 100" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 32 100 C 38 85, 42 75, 40 60" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 32 100 C 25 85, 20 75, 22 55" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(72, 35, "e1a")}
          {renderBlossomCluster(54, 40, "e1b")}
          {renderBlossomCluster(40, 60, "e2a")}
          {renderBlossomCluster(22, 55, "e2b")}
        </g>

        {/* Branch F (Left, Upper) */}
        <g className="botanical-branch-l3">
          <path d="M 23 130 C 17 110, 10 85, 14 50" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 23 130 C 17 110, 10 85, 14 50" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch F1 */}
          <path d="M 14 50 C 20 30, 24 10, 18 -20" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 18 -20 C 22 -35, 28 -45, 24 -60" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 18 -20 C 14 -35, 8 -45, 11 -60" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch F2 */}
          <path d="M 14 50 C 8 30, 4 15, 6 0" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 6 0 C 11 -15, 15 -25, 13 -40" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 6 0 C 1 -15, -3 -25, 0 -40" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(24, -60, "f1a")}
          {renderBlossomCluster(11, -60, "f1b")}
          {renderBlossomCluster(13, -40, "f2a")}
          {renderBlossomCluster(0, -40, "f2b")}
        </g>
      </g>
    </svg>
  );
}
