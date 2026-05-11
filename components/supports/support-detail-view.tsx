import { getTranslations } from "next-intl/server";

import type { routing } from "@/i18n/routing";
import {
  SUPPORT_CATEGORIES,
  type SupportCategory,
} from "@/lib/support-query";
import type { SupportRow } from "@/types/database";

import { CopyDetailLinkButton } from "./copy-detail-link-button";
import { OneToOneImageCarousel } from "./one-to-one-image-carousel";

type Locale = (typeof routing.locales)[number];

function pickLocalized(locale: Locale, zh: string, en: string): string {
  if (locale === "zh") return zh;
  return en.trim() ? en : zh;
}

function formatPublishedAt(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-TW" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export type SupportDetailViewProps = Readonly<{
  support: SupportRow;
  locale: Locale;
  sharePath: string;
}>;

export async function SupportDetailView({
  support,
  locale,
  sharePath,
}: SupportDetailViewProps) {
  const t = await getTranslations("DetailPage");
  const tCat = await getTranslations("DetailPage.categories");

  const title = pickLocalized(locale, support.title_zh, support.title_en);
  const organizer = pickLocalized(
    locale,
    support.organizer_zh,
    support.organizer_en,
  );
  const description = pickLocalized(
    locale,
    support.description_zh ?? "",
    support.description_en ?? "",
  ).trim();

  const categoryLabel = SUPPORT_CATEGORIES.includes(
    support.category as SupportCategory,
  )
    ? tCat(support.category as SupportCategory)
    : support.category;

  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>

        {support.image_urls.length > 0 ? (
          <section aria-labelledby="detail-gallery-heading" className="space-y-2">
            <h2
              id="detail-gallery-heading"
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
            >
              {t("galleryHeading")}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 shadow-hle-card dark:border-neutral-800">
              <OneToOneImageCarousel
                images={support.image_urls}
                fullBleed={false}
                className="rounded-2xl"
              />
            </div>
          </section>
        ) : (
          <p className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-12 text-center text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/40">
            {t("noImage")}
          </p>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {organizer}
            </p>
            <p className="text-sm text-neutral-500">
              {t("publishedAt")}：{formatPublishedAt(support.created_at, locale)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                support.is_available
                  ? "bg-hle-orange text-white"
                  : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
              }`}
            >
              {support.is_available ? t("available") : t("soldout")}
            </span>
            <span className="rounded-full bg-hle-orange/15 px-3 py-1 text-sm font-medium text-hle-orange dark:bg-hle-orange/20 dark:text-hle-orange-bright">
              {categoryLabel}
            </span>
            <span className="text-sm text-neutral-500">
              {t("views", { count: support.view_count })}
            </span>
          </div>
        </div>
        <CopyDetailLinkButton path={sharePath} />
      </header>

      {support.tags.length > 0 ? (
        <section aria-labelledby="detail-tags-heading" className="space-y-2">
          <h2
            id="detail-tags-heading"
            className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
          >
            {t("tagsHeading")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {support.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-hle-gray px-3 py-1 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {support.organizer_url.length > 0 ? (
        <section aria-labelledby="detail-links-heading" className="space-y-2">
          <h2
            id="detail-links-heading"
            className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
          >
            {t("organizerLinksHeading")}
          </h2>
          <ul className="list-inside list-disc space-y-1 text-hle-orange">
            {support.organizer_url.map((href) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline dark:text-hle-orange-bright"
                >
                  {href.replace(/^https?:\/\//, "")}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section
        aria-labelledby="detail-pickup-heading"
        className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-hle-card dark:border-neutral-800 dark:bg-neutral-950"
      >
        <h2
          id="detail-pickup-heading"
          className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
        >
          {t("pickupHeading")}
        </h2>
        <dl className="mt-4 space-y-3 text-neutral-700 dark:text-neutral-300">
          {(support.pickup_time ?? "").trim() ? (
            <div>
              <dt className="text-sm font-medium text-neutral-500">
                {t("pickupTime")}
              </dt>
              <dd className="mt-0.5 whitespace-pre-wrap">{support.pickup_time}</dd>
            </div>
          ) : null}
          {(support.pickup_location ?? "").trim() ? (
            <div>
              <dt className="text-sm font-medium text-neutral-500">
                {t("pickupLocation")}
              </dt>
              <dd className="mt-0.5 whitespace-pre-wrap">
                {support.pickup_location}
              </dd>
            </div>
          ) : null}
          {!(support.pickup_time ?? "").trim() &&
          !(support.pickup_location ?? "").trim() ? (
            <p className="text-sm text-neutral-500">{t("pickupEmpty")}</p>
          ) : null}
        </dl>
      </section>

      {description ? (
        <section aria-labelledby="detail-desc-heading" className="space-y-2">
          <h2
            id="detail-desc-heading"
            className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
          >
            {t("descriptionHeading")}
          </h2>
          <div className="whitespace-pre-wrap rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-800 shadow-hle-card dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
            {description}
          </div>
        </section>
      ) : null}
    </article>
  );
}
