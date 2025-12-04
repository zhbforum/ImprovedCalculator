import { createContext } from "react";
import type { ThemeId } from "./types";

export type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);
