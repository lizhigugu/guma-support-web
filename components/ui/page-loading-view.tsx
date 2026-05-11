"use client";

import { useLocale } from "next-intl";

export function PageLoadingView() {
  const locale = useLocale();
  const label = locale === "zh" ? "載入中…" : "Loading…";

  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-6 py-20"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex size-20 items-center justify-center">
        <span
          className="absolute inset-0 rounded-2xl bg-hle-orange/20 blur-xl motion-safe:animate-float-orb"
          aria-hidden
        />
        <GiftGlyph className="relative z-[1] size-14 text-hle-orange motion-safe:animate-gift-bob drop-shadow-md" />
      </div>
      <p className="text-sm font-medium tracking-wide text-neutral-600 motion-safe:animate-pulse-soft dark:text-neutral-300">
        {label}
      </p>
    </div>
  );
}

function GiftGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="6" y="14" width="20" height="14" rx="2" fill="currentColor" />
      <rect x="5" y="11" width="22" height="5" rx="1" fill="#FF9E00" />
      <rect x="14" y="11" width="4" height="17" rx="0.5" fill="#FFF5EB" />
      <rect x="5" y="11" width="22" height="2.5" rx="0.5" fill="#E65F00" />
      <circle cx="16" cy="10.5" r="2" fill="#E65F00" />
      <path
        fill="#FF9E00"
        d="M16 8.5c-2-1-4-.2-4.5 1.5.8-.6 2.2-.4 4.5-.3 2.3-.1 3.7-.3 4.5.3-.5-1.7-2.5-2.5-4.5-1.5Z"
      />
    </svg>
  );
}
