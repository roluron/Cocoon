import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function SettingsPanel({ open, onClose, onOpenArchetype }) {
  const { state } = useApp();
  const { glow } = useTheme();

  if (!open) return null;

  const name = state.profile?.name;
  const archetypeEnabled = state.profile?.onboarding?.archetypeEnabled;
  const healthEnabled = state.profile?.onboarding?.healthEnabled;
  const intention = state.cycle?.intention;

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
        style={{ maxHeight: '80vh' }}
      >
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-cocoon-mist" />

        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-cocoon-ash">
            settings
          </span>
          <button
            type="button"
            onClick={onClose}
            className="font-display italic text-[14px] text-cocoon-pearl/80 hover:text-cocoon-light transition"
          >
            done
          </button>
        </div>

        {/* name */}
        {name && (
          <div className="mt-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/60">
              name
            </span>
            <p className="mt-1 font-display italic text-cocoon-light text-[22px]">{name}</p>
          </div>
        )}

        {/* intention */}
        {intention && (
          <div className="mt-5">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/60">
              this cycle's intention
            </span>
            <p className="mt-1 font-display italic text-cocoon-pearl/90 text-[16px] leading-snug">
              {intention}
            </p>
          </div>
        )}

        <div
          className="mt-6 h-px"
          style={{ background: `linear-gradient(to right, ${glow}33, transparent)` }}
        />

        {/* archetype profile link */}
        {archetypeEnabled && (
          <button
            type="button"
            onClick={() => onOpenArchetype?.()}
            className="mt-5 flex w-full items-center justify-between py-2 text-left"
          >
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/60">
                archetypal layer
              </span>
              <p className="mt-1 font-display italic text-cocoon-pearl text-[16px]">
                view your birth signature
              </p>
            </div>
            <span className="font-display italic text-[14px] text-cocoon-ash">→</span>
          </button>
        )}

        {/* health status */}
        <div className="mt-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-cocoon-ash/60">
            apple health
          </span>
          <p className="mt-1 font-display italic text-cocoon-pearl/80 text-[15px]">
            {healthEnabled ? 'connected' : 'not connected'}
          </p>
        </div>

        <div
          className="mt-6 h-px"
          style={{ background: `linear-gradient(to right, ${glow}33, transparent)` }}
        />

        {/* privacy note */}
        <p className="mt-5 font-body text-[11px] text-cocoon-ash/50 leading-relaxed">
          Everything in Cocoon is encrypted on your device. Your journal, moods, and
          reflections never leave this phone.
        </p>
      </div>

    </div>
  );

  return createPortal(content, document.getElementById('root') ?? document.body);
}
