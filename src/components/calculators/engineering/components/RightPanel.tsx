import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Keyboard, RotateCcw } from "lucide-react";
import type { HistoryItem, RightPanelTab } from "../types";
import { tabBtnClass } from "../utils";
import { HistoryList } from "./HistoryList";
import { ShortcutsCard } from "./ShortcutsCard";
import { useTranslation } from "react-i18next";

type Props = {
  rightTab: RightPanelTab;
  setRightTab: (tab: RightPanelTab) => void;
  history: HistoryItem[];
  onPickHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
};

export const RightPanel = ({
  rightTab,
  setRightTab,
  history,
  onPickHistory,
  onClearHistory,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 md:border-l md:pl-8">
      <div className="grid grid-cols-[1fr_auto] items-start gap-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setRightTab("history")}
            className={tabBtnClass(rightTab === "history")}
          >
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <History className="h-4 w-4 shrink-0" />
              {t("engineering.rightPanel.tabs.history")}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRightTab("shortcuts")}
            className={tabBtnClass(rightTab === "shortcuts")}
          >
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <Keyboard className="h-4 w-4 shrink-0" />
              {t("engineering.rightPanel.tabs.shortcuts")}
            </span>
          </button>
        </div>

        {rightTab === "history" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="text-muted-foreground shrink-0 whitespace-nowrap"
          >
            <span className="hidden sm:inline">
              {t("engineering.rightPanel.actions.clear")}
            </span>
            <span className="sr-only">
              {t("engineering.rightPanel.actions.clear")}
            </span>
            <RotateCcw className="h-4 w-4 sm:ml-2" />
          </Button>
        )}
      </div>

      {rightTab === "history" ? (
        <ScrollArea className="h-[520px] pr-4">
          <HistoryList history={history} onPick={onPickHistory} />
        </ScrollArea>
      ) : (
        <ScrollArea className="h-[520px] pr-4">
          <div className="min-h-[520px]">
            <ShortcutsCard />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
