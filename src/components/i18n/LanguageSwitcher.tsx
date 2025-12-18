import { useTranslation } from "react-i18next";
import { setAppLanguage, type AppLang } from "@/i18n";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGS: { value: AppLang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
  { value: "uk", label: "UA" },
  { value: "de", label: "DE" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation("common");

  return (
    <Select
      value={i18n.language as AppLang}
      onValueChange={(lng) => setAppLanguage(lng as AppLang)}
    >
      <SelectTrigger className="w-[70px] h-9">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {LANGS.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
