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
    ? "relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
    : `overflow-hidden ${className}`;

  return (
    <div
      className={outer}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("ariaLabel")}
    >
      <div>
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
                className="absolute left-2 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/55 p-0 text-3xl font-black leading-none text-hle-orange shadow-md ring-1 ring-white/60 backdrop-blur hover:bg-white/70 dark:bg-white/20 dark:text-hle-orange-bright dark:ring-white/25 dark:hover:bg-white/30"
                aria-label={t("prev")}
              >
                <span className="-mt-1">‹</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                className="absolute right-2 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/55 p-0 text-3xl font-black leading-none text-hle-orange shadow-md ring-1 ring-white/60 backdrop-blur hover:bg-white/70 dark:bg-white/20 dark:text-hle-orange-bright dark:ring-white/25 dark:hover:bg-white/30"
                aria-label={t("next")}
              >
                <span className="-mt-1">›</span>
              </button>

              <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-2 px-3">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIndex(i);
                    }}
                    className={`size-2 rounded-full transition ${
                      i === index
                        ? "bg-hle-orange"
                        : "bg-white/70 hover:bg-white"
                    }`}
                    aria-label={t("goToSlide", { n: i + 1 })}
                    aria-current={i === index}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
