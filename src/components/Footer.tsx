import { Github } from "lucide-react";
import { useTranslation } from "react-i18next";

const year = new Date().getFullYear();

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-3 py-4 md:h-16 md:flex-row">
        <p className="text-xs text-muted-foreground md:text-sm">
          {t("footer.copyrightPrefix", { year })}{" "}
          <a
            href="https://github.com/zhbforum"
            className="font-medium underline underline-offset-4 hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            zhbforum
          </a>
        </p>

        <a
          href="https://github.com/zhbforum/ImprovedCalculator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/60 hover:text-primary"
        >
          <Github className="h-4 w-4" />
          <span>{t("footer.viewOnGitHub")}</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
