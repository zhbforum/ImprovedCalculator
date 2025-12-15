import { useEffect } from "react";
import { ALLOWED_KEY_CHARS } from "../constants";
import { isTypingInInputLike } from "../utils";
import type { RightPanelTab } from "../types";

type Params = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  rightTab: RightPanelTab;
  setRightTab: React.Dispatch<React.SetStateAction<RightPanelTab>>;
  setIsRadians: React.Dispatch<React.SetStateAction<boolean>>;
  appendValue: (value: string) => void;
  handleClear: () => void;
  handleDelete: () => void;
  handleCalculate: () => void;
};

export const useEngineeringKeyboard = ({
  inputRef,
  rightTab,
  setRightTab,
  setIsRadians,
  appendValue,
  handleClear,
  handleDelete,
  handleCalculate,
}: Params) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }

      const inInputLike = isTypingInInputLike(active);

      if (e.key === "Escape") {
        e.preventDefault();
        if (rightTab === "shortcuts") {
          setRightTab("history");
          return;
        }
        handleClear();
        return;
      }

      if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleCalculate();
        return;
      }

      if (e.key === "Backspace") {
        if (!inInputLike) {
          e.preventDefault();
          handleDelete();
        }
        return;
      }

      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        e.key.toLowerCase() === "r"
      ) {
        if (!inInputLike) {
          e.preventDefault();
          setIsRadians((prev) => !prev);
        }
        return;
      }

      if (inInputLike) return;

      if (e.key.length === 1 && ALLOWED_KEY_CHARS.includes(e.key)) {
        e.preventDefault();
        appendValue(e.key);
        return;
      }

      const k = e.key.toLowerCase();
      if (k === "s") return e.preventDefault(), appendValue("sin(");
      if (k === "c") return e.preventDefault(), appendValue("cos(");
      if (k === "t") return e.preventDefault(), appendValue("tan(");
      if (k === "l") return e.preventDefault(), appendValue("log(");
      if (k === "q") return e.preventDefault(), appendValue("sqrt(");

      if (e.key === "√") {
        e.preventDefault();
        appendValue("sqrt(");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    inputRef,
    rightTab,
    setRightTab,
    setIsRadians,
    appendValue,
    handleClear,
    handleDelete,
    handleCalculate,
  ]);
};
