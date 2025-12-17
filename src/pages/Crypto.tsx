import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedGlowBackground from "@/components/backgrounds/AnimatedGlowBackground";

import CryptoConverter from "@/components/calculators/finance/CryptoConverter";

const Crypto = () => {
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
              Crypto Converter
            </h1>
            <p className="mt-2 text-muted-foreground">
              Convert crypto instantly using USD-based rates (CoinGecko).
              Updates every 30 seconds.
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
