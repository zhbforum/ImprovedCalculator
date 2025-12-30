import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedGlowBackground from "@/components/backgrounds/AnimatedGlowBackground";
import { EngineeringCalculator } from "@/components/calculators/engineering";
import { useTranslation } from "react-i18next";

const Engineering = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <AnimatedGlowBackground
        className="flex-grow"
        contentClassName="flex-grow"
        variant="engineering"
      >
        <div className="container mx-auto p-4 py-10">
          <div className="mb-8 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("engineering.page.title")}
            </h1>
          </div>

          <EngineeringCalculator />
        </div>
      </AnimatedGlowBackground>

      <Footer />
    </div>
  );
};

export default Engineering;
