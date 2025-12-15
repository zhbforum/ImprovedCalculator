import React from "react";
import { UI } from "../constants";

export const ShortcutsCard = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-[320px] space-y-3 rounded-xl border bg-background/40 p-4 text-sm">
        <div className="text-sm font-semibold">Keyboard shortcuts</div>

        <div className="space-y-3 text-muted-foreground">
          <div className="flex items-center justify-between gap-3">
            <span>Calculate</span>
            <span className="flex items-center gap-2">
              <kbd className={UI.kbdClass}>Enter</kbd>
              <kbd className={UI.kbdClass}>=</kbd>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>Clear</span>
            <kbd className={UI.kbdClass}>Esc</kbd>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>Delete last</span>
            <kbd className={UI.kbdClass}>Backspace</kbd>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>Focus input</span>
            <span className="flex items-center gap-2">
              <kbd className={UI.kbdClass}>Ctrl</kbd>
              <span className="text-xs">+</span>
              <kbd className={UI.kbdClass}>L</kbd>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>Toggle rad/deg</span>
            <kbd className={UI.kbdClass}>r</kbd>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-2 md:grid-cols-2">
            <div className="flex items-center justify-between gap-3">
              <span>sin(</span>
              <kbd className={UI.kbdClass}>s</kbd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>cos(</span>
              <kbd className={UI.kbdClass}>c</kbd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>tan(</span>
              <kbd className={UI.kbdClass}>t</kbd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>log(</span>
              <kbd className={UI.kbdClass}>l</kbd>
            </div>
            <div className="flex items-center justify-between gap-3 md:col-span-2">
              <span>sqrt(</span>
              <span className="flex items-center gap-2">
                <kbd className={UI.kbdClass}>q</kbd>
                <span className="text-xs">or</span>
                <kbd className={UI.kbdClass}>√</kbd>
              </span>
            </div>
          </div>

          <div className="pt-2 text-xs">
            Also supported:{" "}
            <span className="font-mono text-foreground">
              0-9 + - * / ( ) . ^
            </span>
          </div>

          <div className="pt-2 text-xs text-muted-foreground">
            Tip: press <kbd className={UI.kbdClass}>Esc</kbd> to return to
            History.
          </div>
        </div>
      </div>
    </div>
  );
};
