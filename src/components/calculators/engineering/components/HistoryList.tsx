import React from "react";
import { ChevronRight } from "lucide-react";
import type { HistoryItem } from "../types";
import { useTranslation } from "react-i18next";

type Props = {
  history: HistoryItem[];
  onPick: (item: HistoryItem) => void;
};

export const HistoryList = ({ history, onPick }: Props) => {
  const { t } = useTranslation();

  if (history.length === 0) {
    return (
      <div className="rounded-xl border bg-background/40 p-3 text-sm text-muted-foreground">
        {t("engineering.history.empty")}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((item, index) => (
        <button
          key={`${item.expression}-${index}`}
          onClick={() => onPick(item)}
          className="group w-full rounded-xl border bg-background/40 p-3 text-left transition hover:bg-background"
        >
          <div className="text-sm text-muted-foreground">{item.expression}</div>
          <div className="mt-1 flex items-center justify-between">
            <div className="font-medium">{item.result}</div>
            <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </button>
      ))}
    </div>
  );
};
