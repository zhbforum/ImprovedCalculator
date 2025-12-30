import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  result: string;
};

export const ResultCard = ({ result }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border bg-background/60 p-4 md:p-5">
      <div className="text-sm text-muted-foreground">
        {t("engineering.result.label")}
      </div>

      <div className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
        {result || "0"}
      </div>
    </div>
  );
};
