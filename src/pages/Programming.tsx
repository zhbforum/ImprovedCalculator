import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedGlowBackground from "@/components/backgrounds/AnimatedGlowBackground";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { glassCard } from "@/lib/styles";

const Programming = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <AnimatedGlowBackground
        className="flex-grow"
        contentClassName="flex-grow"
        variant="default"
      >
        <main className="container mx-auto flex flex-1 items-center px-4 py-10">
          <Card className={`${glassCard} mx-auto w-full max-w-3xl p-6 md:p-8`}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="destructive"
                  className="px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em]"
                >
                  {t("programming.page.statusLabel")}
                </Badge>
                <div className="text-sm font-medium text-muted-foreground">
                  {t("home.features.programming.title")}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
                  <AlertTriangle className="h-6 w-6" />
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {t("programming.page.title")}
                  </h1>
                  <p className="text-base leading-7 text-muted-foreground md:text-lg">
                    {t("programming.page.description")}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </AnimatedGlowBackground>

      <Footer />
    </div>
  );
};

export default Programming;
