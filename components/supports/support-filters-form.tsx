import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import {
  FILTER_TAG_OPTIONS,
  SUPPORT_CATEGORIES,
  type SortOption,
  type SupportsListParams,
} from "@/lib/support-query";

const SORT_OPTIONS: SortOption[] = [
  "newest",
  "oldest",
  "popular",
  "hidden",
];

export type SupportFiltersFormProps = Readonly<{
  values: SupportsListParams;
}>;

export async function SupportFiltersForm({
  values,
}: SupportFiltersFormProps) {
  const t = await getTranslations("SupportFilters");

  const qDefault = values.q;
  const categoryDefault = values.category ?? "";
  const availabilityDefault = values.availability;
  const sortDefault = values.sort;
  const selectedTags = new Set(values.tags);

  return (
    <form
      method="get"
      className="w-full space-y-6 rounded-2xl border border-hle-orange/20 bg-white p-6 shadow-hle-card dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-span-3">
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={qDefault}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchInputAria")}
            className="w-full rounded-xl border-2 border-hle-orange/45 bg-white px-4 py-2.5 text-neutral-900 outline-none ring-hle-orange placeholder:text-neutral-400 focus:border-hle-orange focus:ring-2 focus:ring-hle-orange dark:border-hle-orange/50 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-hle-orange-bright"
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor="filter-category"
            className="mb-1.5 block text-sm font-medium text-neutral-800 dark:text-neutral-100"
          >
            {t("categoryLabel")}
          </label>
          <select
            id="filter-category"
            name="category"
            defaultValue={categoryDefault}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 outline-none focus:border-hle-orange/50 focus:ring-2 focus:ring-hle-orange dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-hle-orange/55"
          >
            <option value="">{t("categoryAll")}</option>
            {SUPPORT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`categories.${c}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-availability"
            className="mb-1.5 block text-sm font-medium text-neutral-800 dark:text-neutral-100"
          >
            {t("availabilityLabel")}
          </label>
          <select
            id="filter-availability"
            name="availability"
            defaultValue={availabilityDefault}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 outline-none focus:border-hle-orange/50 focus:ring-2 focus:ring-hle-orange dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-hle-orange/55"
          >
            <option value="all">{t("availabilityAll")}</option>
            <option value="available">{t("availabilityAvailable")}</option>
            <option value="soldout">{t("availabilitySoldout")}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-sort"
            className="mb-1.5 block text-sm font-medium text-neutral-800 dark:text-neutral-100"
          >
            {t("sortLabel")}
          </label>
          <select
            id="filter-sort"
            name="sort"
            defaultValue={sortDefault}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 outline-none focus:border-hle-orange/50 focus:ring-2 focus:ring-hle-orange dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-hle-orange/55"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {t(`sort.${opt}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="space-y-2 rounded-xl border border-neutral-100 p-4 dark:border-neutral-800">
        <legend className="px-1 text-sm font-medium text-neutral-800 dark:text-neutral-100">
          {t("tagsLabel")}
        </legend>
        <div className="flex flex-wrap gap-3">
          {FILTER_TAG_OPTIONS.map((tag) => (
            <label
              key={tag}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm has-[:checked]:border-hle-orange/45 has-[:checked]:bg-hle-orange/10 dark:border-neutral-700 dark:has-[:checked]:border-hle-orange/55 dark:has-[:checked]:bg-hle-orange/15"
            >
              <input
                type="checkbox"
                name="tag"
                value={tag}
                defaultChecked={selectedTags.has(tag)}
                className="size-4 rounded border-neutral-300 text-hle-orange focus:ring-hle-orange dark:border-neutral-600"
              />
              <span>{t(`tagLabels.${tag}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-xl bg-hle-orange px-5 py-2.5 text-sm font-medium text-white transition hover:bg-hle-orange-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-hle-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
        >
          {t("submit")}
        </button>
        <Link
          href="/"
          className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          {t("reset")}
        </Link>
      </div>
    </form>
  );
}
