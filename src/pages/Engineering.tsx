import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { EngineeringCalculator } from "@/components/calculators/engineering";

const Engineering = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="relative flex-grow">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
          <div className="absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/20 via-purple-500/15 to-cyan-500/20 blur-3xl" />
        </div>

        <div className="container mx-auto p-4 py-10">
          <div className="mb-8 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Engineering Calculator
            </h1>
          </div>

          <EngineeringCalculator />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Engineering;
