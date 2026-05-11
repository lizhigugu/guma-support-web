"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = Readonly<{
  children: React.ReactNode;
  defaultOpen?: boolean;
}>;

export function SupportFiltersDropdown({
  children,
  defaultOpen = false,
}: Props) {
  const t = useTranslations("SupportFilters");
  const [open, setOpen] = useState(defaultOpen);
  const wrapRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, close]);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto flex w-full max-w-6xl flex-col"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="support-filters-panel"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-xl border border-hle-orange/35 bg-white px-6 py-3 text-left text-sm font-medium text-hle-orange shadow-sm transition hover:border-hle-orange/55 hover:bg-hle-orange/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-hle-orange focus-visible:ring-offset-2 dark:border-hle-orange/40 dark:bg-neutral-950 dark:text-hle-orange-bright dark:hover:bg-hle-orange/10 dark:focus-visible:ring-offset-neutral-950"
      >
        {t("openPanel")}
      </button>

      {open ? (
        <div
          id="support-filters-panel"
          className="absolute left-0 right-0 top-full z-50 mt-3 max-h-[min(85vh,calc(100vh-8rem))] overflow-y-auto"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
