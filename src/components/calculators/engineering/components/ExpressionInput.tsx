import React from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

type Props = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
};

export const ExpressionInput = ({ inputRef, value, onChange }: Props) => {
  const { t } = useTranslation();

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t("engineering.input.placeholder")}
      className="h-11 text-base font-medium"
    />
  );
};
