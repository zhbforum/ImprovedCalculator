export type ThemeId = "light" | "dark" | "nord" | "monokai";

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "nord", label: "Nord" },
  { id: "monokai", label: "Monokai" },
];
