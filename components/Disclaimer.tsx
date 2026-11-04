"use client";
import { FC } from "react";
import { useTranslations } from "next-intl";

/** Lời nhắc "Kết quả mang tính tham khảo và giải trí" — đặt trong chân trang đỏ rượu */
export const Disclaimer: FC = () => {
   const t = useTranslations("Disclaimer");

   return (
      <div className="pyra-footer__note" role="note">
         <strong>{t("title")}</strong>
         <br />
         {t("content")}
      </div>
   );
};
