import React from "react";
import { UI } from "../constants";
import { useTranslation } from "react-i18next";

export const ShortcutsCard = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-[320px] space-y-3 rounded-xl border bg-background/40 p-4 text-sm">
        <div className="text-sm font-semibold">
          {t("engineering.shortcuts.title")}
        </div>

        <div className="space-y-3 text-muted-foreground">
          <div className="flex items-center justify-between gap-3">
            <span>{t("engineering.shortcuts.items.calculate")}</span>
            <span className="flex items-center gap-2">
              <kbd className={UI.kbdClass}>Enter</kbd>
              <kbd className={UI.kbdClass}>=</kbd>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>{t("engineering.shortcuts.items.clear")}</span>
            <kbd className={UI.kbdClass}>Esc</kbd>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>{t("engineering.shortcuts.items.deleteLast")}</span>
            <kbd className={UI.kbdClass}>Backspace</kbd>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>{t("engineering.shortcuts.items.focusInput")}</span>
            <span className="flex items-center gap-2">
              <kbd className={UI.kbdClass}>Ctrl</kbd>
              <span className="text-xs">+</span>
              <kbd className={UI.kbdClass}>L</kbd>
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>{t("engineering.shortcuts.items.toggleRadDeg")}</span>
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
                <span className="text-xs">{t("engineering.shortcuts.or")}</span>
                <kbd className={UI.kbdClass}>√</kbd>
              </span>
            </div>
          </div>

          <div className="pt-2 text-xs">
            {t("engineering.shortcuts.alsoSupported")}{" "}
            <span className="font-mono text-foreground">
              0-9 + - * / ( ) . ^
            </span>
          </div>

          <div className="pt-2 text-xs text-muted-foreground">
            {t("engineering.shortcuts.tipPrefix")}{" "}
            <kbd className={UI.kbdClass}>Esc</kbd>{" "}
            {t("engineering.shortcuts.tipSuffix")}
          </div>
        </div>
      </div>
    </div>
  );
};
