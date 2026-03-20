import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedGlowBackground from "@/components/backgrounds/AnimatedGlowBackground";
import { useTranslation } from "react-i18next";

import CryptoConverter from "@/components/calculators/finance/CryptoConverter";

const Crypto = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <AnimatedGlowBackground
        className="flex-grow"
        contentClassName="flex-grow"
        variant="crypto"
      >
        <div className="container mx-auto p-4 py-10">
          <div className="mb-8 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("crypto.page.title")}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t("crypto.page.description")}
            </p>
          </div>

          <CryptoConverter />
        </div>
      </AnimatedGlowBackground>

      <Footer />
    </div>
  );
};

export default Crypto;
