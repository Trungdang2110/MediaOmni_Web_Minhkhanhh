"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Tooltip } from "@chakra-ui/react";

/** Nút kính tròn đổi ngôn ngữ Việt ⇄ Anh (nằm trên thanh công cụ kính) */
export const LanguageSwitcher = ({ isHeader = false }: { isHeader?: boolean }) => {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const nextLocale = locale === "vi" ? "en" : "vi";
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${nextLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`);
  };

  const label = locale === "vi" ? t("switchLocaleEn") : t("switchLocaleVi");

  return (
    <Tooltip label={label} hasArrow>
      <button
        type="button"
        onClick={switchLocale}
        className="pr-gbtn pr-gbtn--round"
        aria-label={label}
      >
        {locale === "vi" ? "EN" : "VI"}
      </button>
    </Tooltip>
  );
};
