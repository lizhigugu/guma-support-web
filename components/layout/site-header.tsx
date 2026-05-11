import { getTranslations } from "next-intl/server";

function envUrl(name: string): string {
  return process.env[name]?.trim() ?? "";
}

export async function SiteHeader() {
  const t = await getTranslations("SiteHeader");

  const desktopSrc = envUrl("NEXT_PUBLIC_HEADER_IMAGE_URL_DESKTOP");
  const tabletSrc = envUrl("NEXT_PUBLIC_HEADER_IMAGE_URL_TABLET");
  const mobileSrc = envUrl("NEXT_PUBLIC_HEADER_IMAGE_URL_MOBILE");
  const fallbackSrc = envUrl("NEXT_PUBLIC_HEADER_IMAGE_URL");

  const hasAnyBanner =
    desktopSrc !== "" ||
    tabletSrc !== "" ||
    mobileSrc !== "" ||
    fallbackSrc !== "";

  return (
    <header className="border-b border-orange-100/80 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="relative w-full bg-hle-gray/50 dark:bg-neutral-900/40">
        <div className="w-full">
          {hasAnyBanner ? (
            <picture>
              {mobileSrc ? (
                <source media="(max-width: 767px)" srcSet={mobileSrc} />
              ) : null}
              {tabletSrc ? (
                <source media="(max-width: 1279px)" srcSet={tabletSrc} />
              ) : null}
              {desktopSrc ? (
                <source media="(min-width: 1280px)" srcSet={desktopSrc} />
              ) : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={desktopSrc || tabletSrc || mobileSrc || fallbackSrc}
                alt={t("bannerAlt")}
                className="h-auto w-full bg-neutral-100 object-cover dark:bg-neutral-800"
              />
            </picture>
          ) : (
            <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 border-y border-dashed border-hle-orange/35 bg-gradient-to-br from-white to-hle-orange/5 px-6 py-10 text-center dark:border-hle-orange/25 dark:from-neutral-950 dark:to-hle-orange/10 sm:min-h-[180px]">
              <p className="text-sm font-medium text-hle-orange dark:text-hle-orange-bright">
                {t("bannerLabel")}
              </p>
              <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-400">
                {t("bannerPending")}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
