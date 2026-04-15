export default function ComingSoon({ title, hint }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-10 text-center">
      <p className="font-display text-cocoon-light text-2xl">{title}</p>
      {hint && (
        <p className="mt-3 max-w-xs font-body text-sm text-cocoon-ash leading-relaxed">{hint}</p>
      )}
    </div>
  );
}
