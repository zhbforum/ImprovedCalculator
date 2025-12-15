import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Keyboard, RotateCcw } from "lucide-react";
import type { HistoryItem, RightPanelTab } from "../types";
import { tabBtnClass } from "../utils";
import { HistoryList } from "./HistoryList";
import { ShortcutsCard } from "./ShortcutsCard";

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
  return (
    <div className="space-y-4 md:border-l md:pl-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRightTab("history")}
            className={tabBtnClass(rightTab === "history")}
          >
            <span className="inline-flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRightTab("shortcuts")}
            className={tabBtnClass(rightTab === "shortcuts")}
          >
            <span className="inline-flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              Shortcuts
            </span>
          </button>
        </div>

        {rightTab === "history" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="text-muted-foreground"
          >
            Clear
            <RotateCcw className="ml-2 h-4 w-4" />
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
