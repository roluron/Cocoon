import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { computeFullProfile } from '../../utils/archetypes.js';

const ELEMENT_COLORS = {
  fire: '#c2674a',
  earth: '#8a7a5c',
  air: '#6a8a9c',
  water: '#4a6a8a',
};

function SignCard({ label, sign, glyph, element, description, delay = 0 }) {
  if (!sign) return null;
  const color = ELEMENT_COLORS[element] ?? 'var(--cocoon-ash)';
  return (
    <div
      className="mt-6 opacity-0"
      style={{ animation: `cocoon-sheet-fade 0.8s ${delay}ms ease-out forwards` }}
    >
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash/70">
          {label}
        </span>
        <span className="text-[12px]" style={{ color, opacity: 0.8 }}>
          {element}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-3">
        <span style={{ color, fontSize: 28 }} aria-hidden="true">
          {glyph}
        </span>
        <span className="font-display italic text-cocoon-light text-[28px] leading-none">
          {sign}
        </span>
      </div>
      {description && (
        <p className="mt-2 max-w-[85%] font-display italic text-[14px] text-cocoon-pearl/70 leading-snug">
          {description}
        </p>
      )}
    </div>
  );
}

export default function ArchetypeProfile({ open, onClose }) {
  const { state } = useApp();
  const { glow } = useTheme();

  const birthData = state.profile?.onboarding?.birthData;

  const profile = useMemo(() => {
    if (!birthData?.birthDate) return null;
    return computeFullProfile(
      new Date(birthData.birthDate),
      birthData.birthTime ?? null,
    );
  }, [birthData]);

  if (!open || !profile) return null;

  const { sunSign: sun, moonSign: moon, risingSign: rising, chineseZodiac: chinese, lifePath } = profile;

  const content = (
    <div className="fixed inset-0 z-40 flex flex-col sheet-fade">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-cocoon-void/80 backdrop-blur-sm"
      />
      <div
        className="relative z-10 mt-auto w-full overflow-y-auto rounded-t-modal border-t border-cocoon-mist/60 bg-cocoon-deep/95 px-6 pb-10 pt-6 backdrop-blur-xl sheet-rise"
        style={{ maxHeight: '88vh' }}
      >
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-cocoon-mist" />

        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
            your birth signature
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-display italic text-[14px] text-cocoon-pearl/80 hover:text-cocoon-light transition"
          >
            done
          </button>
        </div>

        {/* sun sign — always present */}
        <SignCard
          label="sun"
          sign={sun.name}
          glyph={sun.glyph}
          element={sun.element}
          description={sun.description}
          delay={100}
        />

        {/* hairline */}
        <div
          className="mt-6 h-px"
          style={{ background: `linear-gradient(to right, ${glow}44, transparent)` }}
        />

        {/* moon sign */}
        <SignCard
          label="moon"
          sign={moon.name}
          glyph={moon.glyph}
          element={moon.element}
          description={moon.description}
          delay={200}
        />

        {/* rising sign — only if birth time was provided */}
        {rising && (
          <>
            <div
              className="mt-6 h-px"
              style={{ background: `linear-gradient(to right, ${glow}44, transparent)` }}
            />
            <SignCard
              label="rising"
              sign={rising.name}
              glyph={rising.glyph}
              element={rising.element}
              description={rising.description}
              delay={300}
            />
          </>
        )}

        {/* chinese zodiac */}
        <div
          className="mt-6 h-px"
          style={{ background: `linear-gradient(to right, ${glow}44, transparent)` }}
        />
        <div
          className="mt-6 opacity-0"
          style={{ animation: 'cocoon-sheet-fade 0.8s 400ms ease-out forwards' }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash/70">
            chinese zodiac
          </span>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display italic text-cocoon-light text-[28px] leading-none">
              {chinese.animal}
            </span>
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-cocoon-ash/60">
            {chinese.element} · {chinese.yin_yang}
          </p>
        </div>

        {/* life path */}
        <div
          className="mt-6 h-px"
          style={{ background: `linear-gradient(to right, ${glow}44, transparent)` }}
        />
        <div
          className="mt-6 opacity-0"
          style={{ animation: 'cocoon-sheet-fade 0.8s 500ms ease-out forwards' }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash/70">
            life path
          </span>
          <div className="mt-2 font-display italic text-cocoon-light text-[36px] leading-none">
            {lifePath}
          </div>
          <p className="mt-2 font-display italic text-[14px] text-cocoon-pearl/70 leading-snug">
            {lifePath === 1 && 'The Initiator — independence, leadership, original thought.'}
            {lifePath === 2 && 'The Mediator — sensitivity, partnership, intuitive harmony.'}
            {lifePath === 3 && 'The Creator — expression, joy, communication as art.'}
            {lifePath === 4 && 'The Builder — discipline, foundation, patient construction.'}
            {lifePath === 5 && 'The Explorer — freedom, change, sensory experience.'}
            {lifePath === 6 && 'The Nurturer — responsibility, love, beauty in service.'}
            {lifePath === 7 && 'The Seeker — introspection, wisdom, spiritual inquiry.'}
            {lifePath === 8 && 'The Powerhouse — ambition, authority, material mastery.'}
            {lifePath === 9 && 'The Humanitarian — compassion, completion, universal love.'}
            {lifePath === 11 && 'The Visionary — intuition, illumination, spiritual messenger.'}
            {lifePath === 22 && 'The Master Builder — turning vision into reality at scale.'}
            {lifePath === 33 && 'The Master Teacher — compassion as cosmic principle.'}
          </p>
        </div>

        {/* closing */}
        <div
          className="mt-8 opacity-0"
          style={{ animation: 'cocoon-sheet-fade 0.8s 600ms ease-out forwards' }}
        >
          <p className="font-body text-[12px] text-cocoon-ash/60 leading-relaxed">
            These patterns are mirrors, not prescriptions. Cocoon weaves them into your
            reflections when they resonate — never as diagnosis.
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.getElementById('root') ?? document.body);
}
