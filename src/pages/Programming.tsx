import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgrammingCalculator from "@/components/calculators/ProgrammingCalculator";

const Programming = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProgrammingCalculator />
      </main>
      <Footer />
    </div>
  );
};

export default Programming;