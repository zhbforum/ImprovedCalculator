import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GraphCalculator from "@/components/calculators/GraphCalculator";

const Graph = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <GraphCalculator />
      </main>
      <Footer />
    </div>
  );
};

export default Graph;