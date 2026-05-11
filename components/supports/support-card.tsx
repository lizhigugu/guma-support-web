import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { SupportCardMedia } from "@/components/supports/support-card-media";
import type { routing } from "@/i18n/routing";
import type { SupportRow } from "@/types/database";

type Locale = (typeof routing.locales)[number];

function pickLocalized(
  locale: Locale,
  zh: string,
  en: string,
): string {
  if (locale === "zh") return zh;
  return en.trim() ? en : zh;
}

export type SupportCardProps = Readonly<{
  support: SupportRow;
  locale: Locale;
}>;

export async function SupportCard({ support, locale }: SupportCardProps) {
  const t = await getTranslations("SupportCard");
  const detailHref = `/supports/${support.id}`;

  const title = pickLocalized(locale, support.title_zh, support.title_en);
  const organizer = pickLocalized(
    locale,
    support.organizer_zh,
    support.organizer_en,
  );

  const pickupBits = [support.pickup_time, support.pickup_location].filter(
    (v) => typeof v === "string" && v.trim().length > 0,
  ) as string[];
  const pickupSummary = pickupBits.join(locale === "zh" ? " · " : " · ");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-hle-card transition hover:border-hle-orange/35 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-hle-orange/40">
      <div className="rounded-t-2xl ring-inset ring-hle-orange focus-within:ring-2">
        <SupportCardMedia
          images={support.image_urls}
          isAvailable={support.is_available}
          labelAvailable={t("available")}
          labelUnavailable={t("unavailable")}
          labelNoImage={t("noImage")}
        />
        <div className="border-t border-neutral-800/40 bg-neutral-950 px-2 py-1 text-center dark:border-neutral-700">
          <Link
            href={detailHref}
            className="text-xs font-medium text-hle-orange underline-offset-2 hover:underline dark:text-hle-orange-bright"
          >
            {t("viewDetail")}
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
            <Link
              href={detailHref}
              className="line-clamp-2 rounded-sm text-left outline-none ring-hle-orange focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
            >
              {title}
            </Link>
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {organizer}
          </p>
        </div>

        {support.organizer_url.length > 0 ? (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {support.organizer_url.slice(0, 3).map((href) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-full truncate text-hle-orange underline-offset-2 hover:underline dark:text-hle-orange-bright"
              >
                {href.replace(/^https?:\/\//, "")}
              </a>
            ))}
            {support.organizer_url.length > 3 ? (
              <span className="text-neutral-500">
                {t("moreLinks", { count: support.organizer_url.length - 3 })}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-hle-orange/10 px-2 py-0.5 text-xs font-medium text-hle-orange dark:bg-hle-orange/15 dark:text-hle-orange-bright">
            {support.category}
          </span>
          {support.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {tag}
            </span>
          ))}
          {support.tags.length > 4 ? (
            <span className="text-xs text-neutral-500">
              {t("moreTags", { count: support.tags.length - 4 })}
            </span>
          ) : null}
        </div>

        {pickupSummary ? (
          <p className="line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-medium text-neutral-600 dark:text-neutral-300">
              {t("pickup")}
            </span>{" "}
            {pickupSummary}
          </p>
        ) : null}

        <p className="mt-auto text-xs text-neutral-400 dark:text-neutral-500">
          {t("views", { count: support.view_count })}
        </p>
      </div>
    </article>
  );
}
