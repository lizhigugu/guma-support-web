import { getTranslations } from "next-intl/server";

import { getSiteTotalViews } from "@/lib/get-site-total-views";

function envUrl(key: string): string | undefined {
  const v = process.env[key]?.trim();
  return v && v.length > 0 ? v : undefined;
}

export async function SiteFooter() {
  const t = await getTranslations("SiteFooter");
  const totalViews = await getSiteTotalViews();

  const formUrl = envUrl("NEXT_PUBLIC_GOOGLE_FORM_URL");
  const threadsUrl = envUrl("NEXT_PUBLIC_SOCIAL_THREADS_URL");
  const instagramUrl = envUrl("NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL");
  const discordUrl = envUrl("NEXT_PUBLIC_SOCIAL_DISCORD_URL");

  const socialItems = [
    { href: threadsUrl, label: t("socialThreads") },
    { href: instagramUrl, label: t("socialInstagram") },
    { href: discordUrl, label: t("socialDiscord") },
  ].filter((x): x is { href: string; label: string } => Boolean(x.href));

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3 md:gap-8">
        <section aria-labelledby="footer-founder">
          <h2
            id="footer-founder"
            className="text-sm font-semibold uppercase tracking-wide text-hle-orange"
          >
            {t("founderSectionTitle")}
          </h2>
          <p className="mt-3 text-sm text-neutral-800 dark:text-neutral-200">
            {t("founderLine")}
          </p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {t("teamLine")}
          </p>
          {socialItems.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-medium text-neutral-500">
                {t("socialHeading")}
              </p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {socialItems.map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-hle-orange underline-offset-2 hover:underline dark:text-hle-orange-bright"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section aria-labelledby="footer-submit">
          <h2
            id="footer-submit"
            className="text-sm font-semibold uppercase tracking-wide text-hle-orange"
          >
            {t("submissionTitle")}
          </h2>
          <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
            {t("submissionText")}
          </p>
          {formUrl ? (
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-xl bg-hle-orange px-4 py-2 text-sm font-medium text-white transition hover:bg-hle-orange-hover"
            >
              {t("submissionLink")}
            </a>
          ) : (
            <p className="mt-3 text-xs text-neutral-500">{t("formUrlMissing")}</p>
          )}
        </section>

        <section aria-labelledby="footer-legal">
          <h2
            id="footer-legal"
            className="text-sm font-semibold uppercase tracking-wide text-hle-orange"
          >
            {t("legalTitle")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>{t("legalLine1")}</li>
            <li>{t("legalLine2")}</li>
            <li>{t("legalLine3")}</li>
          </ul>
          {totalViews !== null ? (
            <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-500">
              {t("totalViews", { count: totalViews })}
            </p>
          ) : null}
        </section>
      </div>
    </footer>
  );
}
