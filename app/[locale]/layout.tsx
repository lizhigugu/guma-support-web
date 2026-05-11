import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { routing } from "@/i18n/routing";

type Props = Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const fontClass = locale === "en" ? "font-montserrat" : "font-noto-tc";
  const langAttr = locale === "en" ? "en" : "zh-Hant";

  return (
    <NextIntlClientProvider messages={messages}>
      <div
        className={`site-shell relative flex min-h-screen flex-col ${fontClass}`}
        lang={langAttr}
      >
        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -left-28 top-[18%] h-[min(22rem,50vw)] w-[min(22rem,50vw)] rounded-full bg-hle-orange/[0.13] blur-3xl motion-safe:animate-float-orb" />
          <div className="absolute -right-24 bottom-[22%] h-[min(24rem,55vw)] w-[min(24rem,55vw)] rounded-full bg-hle-orange-bright/[0.11] blur-3xl motion-safe:animate-float-orb-rev motion-safe:[animation-delay:-7s]" />
        </div>
        <SiteHeader />
        <div className="relative flex flex-1 flex-col motion-safe:animate-fade-rise motion-reduce:animate-none">
          {children}
        </div>
        <SiteFooter />
      </div>
    </NextIntlClientProvider>
  );
}
