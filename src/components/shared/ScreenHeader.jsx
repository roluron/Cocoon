export default function ScreenHeader({ title, subtitle, right }) {
  return (
    <header className="flex items-end justify-between px-6 pt-8 pb-4">
      <div>
        <h1 className="font-display text-cocoon-light text-3xl leading-none">{title}</h1>
        {subtitle && (
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-cocoon-ash">
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </header>
  );
}
