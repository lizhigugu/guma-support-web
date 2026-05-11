import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SupportDetailView } from "@/components/supports/support-detail-view";
import { Link } from "@/i18n/navigation";
import type { routing } from "@/i18n/routing";
import {
  getSupportById,
  recordSupportDetailView,
} from "@/lib/support-query";

type Locale = (typeof routing.locales)[number];

type Props = Readonly<{
  params: { locale: string; id: string };
}>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = params;
  const row = await getSupportById(id);
  if (!row) {
    return { title: "GUMAYUSI 應援物" };
  }
  const title =
    locale === "zh"
      ? row.title_zh
      : row.title_en.trim()
        ? row.title_en
        : row.title_zh;
  const desc = (row.description_zh ?? row.description_en ?? "").trim();
  return {
    title: `${title} | GUMAYUSI 應援物`,
    ...(desc ? { description: desc.slice(0, 160) } : {}),
  };
}

export default async function SupportDetailPage({ params }: Props) {
  const { locale, id } = params;
  setRequestLocale(locale);
  const t = await getTranslations("DetailPage");
  const loc = locale as Locale;

  const initial = await getSupportById(id);
  if (!initial) {
    notFound();
  }

  await recordSupportDetailView(id);
  const support = (await getSupportById(id)) ?? initial;

  const sharePath = `/${locale}/supports/${id}`;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm text-neutral-500">
        <Link href="/" className="text-hle-orange hover:underline">
          {t("backHome")}
        </Link>
      </p>
      <div className="mt-6">
        <SupportDetailView
          support={support}
          locale={loc}
          sharePath={sharePath}
        />
      </div>
    </main>
  );
}
