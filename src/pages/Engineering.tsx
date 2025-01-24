import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EngineeringCalculator from "@/components/calculators/EngineeringCalculator";

const Engineering = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <EngineeringCalculator />
      </main>
      <Footer />
    </div>
  );
};

export default Engineering;