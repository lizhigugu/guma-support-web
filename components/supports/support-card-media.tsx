"use client";

import { OneToOneImageCarousel } from "@/components/supports/one-to-one-image-carousel";

type Props = Readonly<{
  images: string[];
  isAvailable: boolean;
  labelAvailable: string;
  labelUnavailable: string;
  labelNoImage: string;
}>;

export function SupportCardMedia({
  images,
  isAvailable,
  labelAvailable,
  labelUnavailable,
  labelNoImage,
}: Props) {
  return (
    <div className="relative">
      {images.length > 0 ? (
        <OneToOneImageCarousel
          images={images}
          fullBleed={false}
          className="rounded-t-2xl"
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-t-2xl bg-neutral-100 text-sm text-neutral-400 dark:bg-neutral-900">
          {labelNoImage}
        </div>
      )}
      <span
        className={`pointer-events-none absolute right-3 top-3 z-20 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isAvailable
            ? "bg-emerald-600/90 text-white"
            : "bg-neutral-700/90 text-white"
        }`}
      >
        {isAvailable ? labelAvailable : labelUnavailable}
      </span>
    </div>
  );
}
