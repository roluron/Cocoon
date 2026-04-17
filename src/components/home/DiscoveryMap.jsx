/**
 * Discovery Map
 *
 * A visual cartography of the user's inner landscape.
 * Not a progress bar. Not a level-up system. Not a collection.
 *
 * Anti-anxiety:
 *   - Undiscovered regions are fog. Tapping fog does nothing.
 *   - No percentages. No "X of 11 discovered."
 *   - Regions bloom with watercolor softness, not achievement pops.
 *   - The map is a meditation, not a scorecard.
 */

import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { REGIONS, detectDiscoveredRegions } from '../../utils/mapRegions.js';

function RegionBlob({ region, discovered, glow, onTap }) {
  const { x, y, size } = region.position
    ? { x: region.position.x, y: region.position.y, size: region.size }
    : { x: 50, y: 50, size: 30 };

  const r = size / 2;

  if (!discovered) {
    // Fog — subtle, barely visible, not clickable
    return (
      <circle
        cx={x}
        cy={y}
        r={r}
        fill="url(#fog)"
        opacity="0.15"
        style={{ filter: 'url(#watercolor)' }}
      />
    );
  }

  return (
    <g
      onClick={() => onTap(region)}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      aria-label={region.name}
    >
      {/* Outer glow */}
      <circle
        cx={x}
        cy={y}
        r={r + 4}
        fill="none"
        stroke={`${glow}22`}
        strokeWidth="0.3"
        style={{ filter: 'url(#watercolor)' }}
      />
      {/* Main bloom */}
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={`${glow}18`}
        stroke={`${glow}33`}
        strokeWidth="0.3"
        style={{
          filter: 'url(#watercolor)',
          animation: 'cocoon-sheet-fade 2s ease-out both',
        }}
      />
      {/* Inner light */}
      <circle
        cx={x - r * 0.15}
        cy={y - r * 0.15}
        r={r * 0.4}
        fill={`${glow}22`}
        style={{ filter: 'url(#softBlur)' }}
      />
      {/* Label — tiny, nearly invisible, just enough */}
      <text
        x={x}
        y={y + r + 5}
        textAnchor="middle"
        fill="var(--cocoon-ash)"
        fontSize="2.2"
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing="0.15"
        opacity="0.5"
        style={{ textTransform: 'uppercase' }}
      >
        {region.name.replace('The ', '')}
      </text>
    </g>
  );
}

function RegionCard({ region, onClose }) {
  if (!region) return null;
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-10 sheet-rise"
    >
      <div className="mx-4 mb-6 rounded-modal border border-cocoon-mist/40 bg-cocoon-deep/95 px-6 py-5 backdrop-blur-xl">
        <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-cocoon-ash/70">
          discovered
        </p>
        <h3 className="mt-2 font-display italic text-cocoon-light text-[22px] leading-tight">
          {region.name}
        </h3>
        <p className="mt-3 font-display italic text-[15px] text-cocoon-pearl/75 leading-relaxed">
          {region.meaning}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash/60 hover:text-cocoon-pearl transition"
        >
          close
        </button>
      </div>
    </div>
  );
}

export default function DiscoveryMap({ open, onClose }) {
  const { state } = useApp();
  const { glow } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState(null);

  const discovered = useMemo(
    () => detectDiscoveredRegions(state),
    [state],
  );

  if (!open) return null;

  const content = (
    <div
      className="fixed inset-0 z-40 flex flex-col bg-cocoon-void sheet-fade"
    >
      {/* header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash/70">
          your inner landscape
        </span>
        <button
          type="button"
          onClick={onClose}
          className="font-display italic text-[14px] text-cocoon-pearl/70 hover:text-cocoon-light transition"
        >
          return
        </button>
      </div>

      {/* map */}
      <div className="relative flex-1 flex items-center justify-center px-4">
        <svg
          viewBox="0 0 100 100"
          className="w-full max-w-[360px]"
          style={{ maxHeight: '65vh' }}
        >
          <defs>
            {/* Watercolor distortion filter */}
            <filter id="watercolor" x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04"
                numOctaves="4"
                seed="3"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="4"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <filter id="softBlur">
              <feGaussianBlur stdDeviation="2" />
            </filter>
            {/* Fog gradient */}
            <radialGradient id="fog">
              <stop offset="0%" stopColor="var(--cocoon-mist)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--cocoon-mist)" stopOpacity="0" />
            </radialGradient>
            {/* Subtle connecting lines between discovered regions */}
            <filter id="lineBlur">
              <feGaussianBlur stdDeviation="0.3" />
            </filter>
          </defs>

          {/* Connecting lines between discovered regions — like constellations */}
          {REGIONS.filter((r) => discovered.has(r.id)).map((r, i, arr) => {
            if (i === 0) return null;
            const prev = arr[i - 1];
            return (
              <line
                key={`line-${r.id}`}
                x1={prev.position.x}
                y1={prev.position.y}
                x2={r.position.x}
                y2={r.position.y}
                stroke={`${glow}15`}
                strokeWidth="0.3"
                strokeDasharray="1 2"
                style={{ filter: 'url(#lineBlur)' }}
              />
            );
          })}

          {/* Render regions */}
          {REGIONS.map((region) => (
            <RegionBlob
              key={region.id}
              region={region}
              discovered={discovered.has(region.id)}
              glow={glow}
              onTap={setSelectedRegion}
            />
          ))}
        </svg>
      </div>

      {/* region info card */}
      <RegionCard
        region={selectedRegion}
        onClose={() => setSelectedRegion(null)}
      />
    </div>
  );

  return createPortal(content, document.getElementById('root') ?? document.body);
}
