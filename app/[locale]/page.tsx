import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { SupportCard } from "@/components/supports/support-card";
import { SupportFiltersDropdown } from "@/components/supports/support-filters-dropdown";
import { SupportFiltersForm } from "@/components/supports/support-filters-form";
import { routing } from "@/i18n/routing";
import {
  getSupportsList,
  hasActiveListFilters,
  hasUrlSqlFilters,
  parseSupportsListSearchParams,
} from "@/lib/support-query";

type Props = Readonly<{
  params: { locale: string };
  searchParams?: Record<string, string | string[] | undefined>;
}>;

type Locale = (typeof routing.locales)[number];

export default async function HomePage({ params, searchParams = {} }: Props) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations("HomePage");

  const listParams = parseSupportsListSearchParams(searchParams);
  const { items: supports, matchedBeforeTextSearch } =
    await getSupportsList(listParams);
  const filteredOut =
    supports.length === 0 &&
    ((matchedBeforeTextSearch > 0 && listParams.q.trim() !== "") ||
      (matchedBeforeTextSearch === 0 && hasUrlSqlFilters(listParams)));

  return (
    <main className="mx-auto flex min-h-[60vh] w-full flex-col gap-10 px-6 py-16 md:w-[70%] md:px-0">
      <header className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-hle-orange sm:text-4xl">
          <span className="mr-2 inline-block motion-safe:animate-gift-bob">
            GUMA&apos;s
          </span>
          <span>{t("titleAfterBrand")}</span>
        </h1>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-base">
          {t("welcomeLine")}
        </p>
      </header>

      <SupportFiltersDropdown defaultOpen={hasActiveListFilters(listParams)}>
        <SupportFiltersForm values={listParams} />
      </SupportFiltersDropdown>

      <section aria-labelledby="supports-heading" className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="supports-heading"
            className="text-xl font-semibold text-neutral-900 dark:text-neutral-100"
          >
            {t("sectionTitle")}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("resultCount", { count: supports.length })}
          </p>
        </div>

        {supports.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400">
            {filteredOut ? t("emptyFiltered") : t("empty")}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {supports.map((support) => (
              <SupportCard
                key={support.id}
                support={support}
                locale={locale as Locale}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
