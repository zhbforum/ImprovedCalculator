import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CryptoConverter from "@/components/calculators/finance/CryptoConverter";

const Crypto = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Crypto Converter</h1>
        <CryptoConverter />
      </div>
      <Footer />
    </div>
  );
};

export default Crypto;