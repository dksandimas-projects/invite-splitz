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
          transform-origin: 0px 800px;
          animation: botanicalSwayMain 18s ease-in-out infinite;
        }
        .botanical-branch-r1 {
          transform-origin: 1px 680px;
          animation: botanicalSwayR1 12s ease-in-out infinite;
        }
        .botanical-branch-l1 {
          transform-origin: -2px 580px;
          animation: botanicalSwayL1 10s ease-in-out infinite;
        }
        .botanical-branch-r2 {
          transform-origin: 1px 460px;
          animation: botanicalSwayR2 13s ease-in-out infinite;
        }
        .botanical-branch-l2 {
          transform-origin: 0px 350px;
          animation: botanicalSwayL2 9.5s ease-in-out infinite;
        }
        .botanical-branch-r3 {
          transform-origin: 3px 240px;
          animation: botanicalSwayR3 14s ease-in-out infinite;
        }
        .botanical-branch-l3 {
          transform-origin: 3px 130px;
          animation: botanicalSwayL3 8.5s ease-in-out infinite;
        }
        .botanical-filament {
          stroke-dasharray: 8 32;
          animation: botanicalGoldFlow 7s linear infinite, botanicalGoldPulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Main Vine Group */}
      <g className="botanical-sway-main">
        {/* Main stem (wispy but clear, shifted left to start at X=0) */}
        <path
          d="M 0 800 C 15 700, -5 580, 5 480 C 15 380, -2 280, 8 180 C 15 120, 0 70, 5 20"
          stroke="#2C2B28"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Glowing golden filament running along the stem */}
        <path
          d="M 0 800 C 15 700, -5 580, 5 480 C 15 380, -2 280, 8 180 C 15 120, 0 70, 5 20"
          stroke="#E8C800"
          strokeWidth="1.0"
          strokeLinecap="round"
          filter="url(#gold-glow)"
          className="botanical-filament"
        />

        {/* Top Stem Blossom Cluster */}
        {renderBlossomCluster(5, 20, "main-top")}

        {/* Branch A (Right, Lower) - Dichotomous Baby's Breath structure */}
        <g className="botanical-branch-r1">
          {/* Base branch */}
          <path d="M 1 680 C 15 660, 30 630, 25 590" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 1 680 C 15 660, 30 630, 25 590" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch A1 */}
          <path d="M 25 590 C 35 570, 45 550, 40 520" stroke="#2C2B28" strokeWidth="1.0" />
          {/* Twig A1a & A1b */}
          <path d="M 40 520 C 45 505, 55 495, 50 475" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 40 520 C 35 505, 30 495, 32 480" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch A2 */}
          <path d="M 25 590 C 15 570, 10 555, 12 540" stroke="#2C2B28" strokeWidth="1.0" />
          {/* Twig A2a & A2b */}
          <path d="M 12 540 C 18 525, 22 515, 20 500" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 12 540 C 5 525, 0 515, 2 495" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(50, 475, "a1a")}
          {renderBlossomCluster(32, 480, "a1b")}
          {renderBlossomCluster(20, 500, "a2a")}
          {renderBlossomCluster(2, 495, "a2b")}
        </g>

        {/* Branch B (Left, Lower) - Dichotomous Baby's Breath structure */}
        <g className="botanical-branch-l1">
          <path d="M -2 580 C -8 560, -15 535, -10 500" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M -2 580 C -8 560, -15 535, -10 500" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch B1 */}
          <path d="M -10 500 C -5 480, -2 460, -8 430" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M -8 430 C -4 415, 2 405, -2 390" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M -8 430 C -12 415, -18 405, -16 390" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch B2 */}
          <path d="M -10 500 C -15 480, -18 465, -16 450" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M -16 450 C -12 435, -8 425, -10 410" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M -16 450 C -20 435, -22 425, -20 410" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(-2, 390, "b1a")}
          {renderBlossomCluster(-16, 390, "b1b")}
          {renderBlossomCluster(-10, 410, "b2a")}
          {renderBlossomCluster(-20, 410, "b2b")}
        </g>

        {/* Branch C (Right, Middle) */}
        <g className="botanical-branch-r2">
          <path d="M 1 460 C 15 440, 30 410, 25 370" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 1 460 C 15 440, 30 410, 25 370" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch C1 */}
          <path d="M 25 370 C 35 350, 45 330, 40 300" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 40 300 C 45 285, 55 275, 50 255" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 40 300 C 35 285, 30 275, 32 260" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch C2 */}
          <path d="M 25 370 C 15 350, 10 335, 12 320" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 12 320 C 18 305, 22 295, 20 280" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 12 320 C 5 305, 0 295, 2 275" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(50, 255, "c1a")}
          {renderBlossomCluster(32, 260, "c1b")}
          {renderBlossomCluster(20, 280, "c2a")}
          {renderBlossomCluster(2, 275, "c2b")}
        </g>

        {/* Branch D (Left, Middle) */}
        <g className="botanical-branch-l2">
          <path d="M 0 350 C -6 330, -14 305, -8 270" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 0 350 C -6 330, -14 305, -8 270" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch D1 */}
          <path d="M -8 270 C -2 250, 2 230, -5 200" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M -5 200 C 0 185, 6 175, 2 160" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M -5 200 C -10 185, -15 175, -12 160" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch D2 */}
          <path d="M -8 270 C -14 250, -18 235, -15 220" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M -15 220 C -10 205, -6 195, -8 180" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M -15 220 C -20 205, -22 195, -20 180" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(2, 160, "d1a")}
          {renderBlossomCluster(-12, 160, "d1b")}
          {renderBlossomCluster(-8, 180, "d2a")}
          {renderBlossomCluster(-20, 180, "d2b")}
        </g>

        {/* Branch E (Right, Upper) */}
        <g className="botanical-branch-r3">
          <path d="M 3 240 C 17 220, 32 190, 27 150" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 3 240 C 17 220, 32 190, 27 150" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch E1 */}
          <path d="M 27 150 C 37 130, 47 110, 42 80" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 42 80 C 47 65, 57 55, 52 35" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 42 80 C 37 65, 32 55, 34 40" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch E2 */}
          <path d="M 27 150 C 17 130, 10 115, 12 100" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M 12 100 C 18 85, 22 75, 20 60" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M 12 100 C 5 85, 0 75, 2 55" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(52, 35, "e1a")}
          {renderBlossomCluster(34, 40, "e1b")}
          {renderBlossomCluster(20, 60, "e2a")}
          {renderBlossomCluster(2, 55, "e2b")}
        </g>

        {/* Branch F (Left, Upper) */}
        <g className="botanical-branch-l3">
          <path d="M 3 130 C -3 110, -10 85, -6 50" stroke="#2C2B28" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 3 130 C -3 110, -10 85, -6 50" stroke="#E8C800" strokeWidth="0.8" filter="url(#gold-glow)" className="botanical-filament" />
          
          {/* Sub-branch F1 */}
          <path d="M -6 50 C 0 30, 4 10, -2 -20" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M -2 -20 C 2 -35, 8 -45, 4 -60" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M -2 -20 C -6 -35, -12 -45, -9 -60" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Sub-branch F2 */}
          <path d="M -6 50 C -12 30, -16 15, -14 0" stroke="#2C2B28" strokeWidth="1.0" />
          <path d="M -14 0 C -9 -15, -5 -25, -7 -40" stroke="#2C2B28" strokeWidth="0.8" />
          <path d="M -14 0 C -19 -15, -23 -25, -20 -40" stroke="#2C2B28" strokeWidth="0.8" />

          {/* Blossoms */}
          {renderBlossomCluster(4, -60, "f1a")}
          {renderBlossomCluster(-9, -60, "f1b")}
          {renderBlossomCluster(-7, -40, "f2a")}
          {renderBlossomCluster(-20, -40, "f2b")}
        </g>
      </g>
    </svg>
  );
}
