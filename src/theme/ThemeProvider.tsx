import { type ReactNode, useEffect, useState } from "react";
import type { ThemeId } from "./types";
import { ThemeContext } from "./ThemeContext";

const STORAGE_KEY = "improved-calculator-theme";
const DEFAULT_THEME: ThemeId = "light";

const applyTheme = (next: ThemeId) => {
  document.documentElement.dataset.theme = next;

  if (next === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next);
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const initial = stored ?? DEFAULT_THEME;

    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = (next: ThemeId) => {
    setThemeState(next);
    applyTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
