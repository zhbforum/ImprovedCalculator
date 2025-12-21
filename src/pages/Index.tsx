import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calculator,
  ChartCandlestick,
  ChartLine,
  CodeXml,
  DollarSign,
  Grid,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedGlowBackground from "@/components/backgrounds/AnimatedGlowBackground";
import { Card } from "@/components/ui/card";
import { glassCard } from "@/lib/styles";

type FeatureId =
  | "engineering"
  | "graph"
  | "finance"
  | "matrix"
  | "programming"
  | "crypto";

const Index = () => {
  const { t } = useTranslation();

  const features: Array<{
    id: FeatureId;
    icon: JSX.Element;
    link: string;
  }> = [
    {
      id: "engineering",
      icon: <Calculator className="h-8 w-8" />,
      link: "/engineering",
    },
    { id: "graph", icon: <ChartLine className="h-8 w-8" />, link: "/graph" },
    {
      id: "finance",
      icon: <DollarSign className="h-8 w-8" />,
      link: "/finance",
    },
    { id: "matrix", icon: <Grid className="h-8 w-8" />, link: "/matrix" },
    {
      id: "programming",
      icon: <CodeXml className="h-8 w-8" />,
      link: "/programming",
    },
    {
      id: "crypto",
      icon: <ChartCandlestick className="h-8 w-8" />,
      link: "/crypto",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <AnimatedGlowBackground
        className="flex-grow"
        contentClassName="flex-grow"
        variant="default"
      >
        <main className="flex-1 container py-10 px-4">
          <section className="text-center mb-12">
            <div className="relative block w-full max-w-3xl mx-auto">
              <div className="hero-title-glow">
                <h1 className="hero-title text-3xl sm:text-6xl md:text-6xl mb-4 leading-[1.15]">
                  {t("home.heroTitle")}
                </h1>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.heroSubtitle")}
            </p>
          </section>

          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {features.map((feature) => (
              <Link key={feature.id} to={feature.link} className="group">
                <Card
                  className={`${glassCard} p-6 h-full cursor-pointer transition hover:bg-background/45 hover:shadow-lg`}
                >
                  <div className="mb-4 text-primary">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t(`home.features.${feature.id}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`home.features.${feature.id}.description`)}
                  </p>
                </Card>
              </Link>
            ))}
          </section>

          <section className={`${glassCard} max-w-3xl mx-auto text-center p-6`}>
            <h2 className="text-2xl font-semibold mb-4">
              {t("home.howToUseTitle")}
            </h2>
            <div className="text-muted-foreground space-y-3">
              <p>{t("home.howToUse.step1")}</p>
              <p>{t("home.howToUse.step2")}</p>
              <p>{t("home.howToUse.step3")}</p>
            </div>
          </section>
        </main>
      </AnimatedGlowBackground>

      <Footer />
    </div>
  );
};

export default Index;
