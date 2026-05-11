"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

type Props = Readonly<{
  images: string[];
  /** 相對於內容區左右滿版（viewport 寬），主區為 1:1 正方形（邊長 = 100vw） */
  fullBleed?: boolean;
  /** 外層額外 class（例如卡片圓角） */
  className?: string;
}>;

export function OneToOneImageCarousel({
  images,
  fullBleed = false,
  className = "",
}: Props) {
  const t = useTranslations("ImageCarousel");
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (delta: number) => {
      if (images.length === 0) return;
      setIndex((i) => (i + delta + images.length) % images.length);
    },
    [images.length],
  );

  if (images.length === 0) {
    return null;
  }

  const outer = fullBleed
    ? "relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-neutral-900"
    : `overflow-hidden bg-neutral-900 ${className}`;

  return (
    <div
      className={outer}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("ariaLabel")}
    >
      <div className="flex flex-col">
        <div
          className={
            fullBleed
              ? "relative aspect-square w-screen max-w-none bg-neutral-900"
              : "relative aspect-square w-full max-w-full bg-neutral-900"
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 遠端圖 */}
          <img
            src={images[index]}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-neutral-800 shadow-md ring-1 ring-neutral-200 backdrop-blur hover:bg-white dark:bg-neutral-900/90 dark:text-neutral-100 dark:ring-neutral-600"
                aria-label={t("prev")}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-neutral-800 shadow-md ring-1 ring-neutral-200 backdrop-blur hover:bg-white dark:bg-neutral-900/90 dark:text-neutral-100 dark:ring-neutral-600"
                aria-label={t("next")}
              >
                ›
              </button>
            </>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div
            className={`flex justify-center gap-1 overflow-x-auto bg-neutral-950 px-2 py-1 ${
              fullBleed ? "w-screen max-w-none" : "w-full"
            }`}
          >
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`size-14 shrink-0 overflow-hidden rounded-md border-2 bg-neutral-900 p-0 transition sm:size-16 ${
                  i === index
                    ? "border-hle-orange ring-1 ring-hle-orange/50"
                    : "border-neutral-700 opacity-80 hover:opacity-100"
                }`}
                aria-label={t("goToSlide", { n: i + 1 })}
                aria-current={i === index}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
