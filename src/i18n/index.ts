import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en/common.json";
import ru from "@/locales/ru/common.json";
import uk from "@/locales/uk/common.json";
import de from "@/locales/de/common.json";

export type AppLang = "en" | "ru" | "uk" | "de";
const STORAGE_KEY = "lang";

const supported: AppLang[] = ["en", "ru", "uk", "de"];

function detectLang(): AppLang {
  const saved = localStorage.getItem(STORAGE_KEY) as AppLang | null;
  if (saved && supported.includes(saved)) return saved;

  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("uk")) return "uk";
  if (nav.startsWith("de")) return "de";
  return "en";
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      ru: { common: ru },
      uk: { common: uk },
      de: { common: de }
    },
    lng: detectLang(),
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false }
  });

export function setAppLanguage(lng: AppLang) {
  i18n.changeLanguage(lng);
  localStorage.setItem(STORAGE_KEY, lng);
}

export default i18n;
