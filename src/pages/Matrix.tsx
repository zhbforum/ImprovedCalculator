import MatrixCalculator from "@/components/calculators/MatrixCalculator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Matrix = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4">
        <MatrixCalculator />
      </main>
      <Footer />
    </div>
  );
};

export default Matrix;
