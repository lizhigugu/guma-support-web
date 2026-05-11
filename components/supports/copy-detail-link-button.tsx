"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Props = Readonly<{
  /** 含語系路徑，例如 `/zh/supports/uuid` */
  path: string;
}>;

export function CopyDetailLinkButton({ path }: Props) {
  const t = useTranslations("DetailPage");
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function handleCopy() {
    try {
      const url = `${window.location.origin}${path}`;
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-hle-orange/40 hover:bg-hle-gray dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-hle-orange/50"
    >
      {state === "copied"
        ? t("copied")
        : state === "error"
          ? t("copyFailed")
          : t("copyLink")}
    </button>
  );
}
