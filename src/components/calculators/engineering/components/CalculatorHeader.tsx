import React from "react";
import { Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";

export const CalculatorHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calculator className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">
          {t("engineering.calculator.title")}
        </h2>
      </div>
    </div>
  );
};
