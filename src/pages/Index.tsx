import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import {
  Calculator,
  ChartLine,
  CodeXml,
  DollarSign,
  Grid,
  ChartCandlestick,
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <Calculator className="h-8 w-8" />,
      title: "Engineering calculator",
      description:
        "Perform complex math calculations, including trigonometric functions",
      link: "/engineering",
    },
    {
      icon: <ChartLine className="h-8 w-8" />,
      title: "Graphing calculator",
      description:
        "Build function graphs with the ability to scale and customize",
      link: "/graph",
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Financial calculator",
      description: "Calculate loans, investments and convert currencies",
      link: "/finance",
    },
    {
      icon: <Grid className="h-8 w-8" />,
      title: "Matrix calculator",
      description:
        "Perform operations with matrices: addition, multiplication, transposition",
      link: "/matrix",
    },
    {
      icon: <CodeXml className="h-8 w-8" />,
      title: "Programmable calculator",
      description: "A calculator that accepts small programs",
      link: "/programming",
    },
    {
      icon: <ChartCandlestick className="h-8 w-8" />,
      title: "Cryptocurrency calculator",
      description: "A calculator which can show your crypto price in real time",
      link: "/crypto",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-700 to-indigo-950 bg-clip-text text-transparent">
            Multifunctional calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A powerful tool for mathematical, financial and engineering
            calculations
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="mb-4 text-primary">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </Link>
          ))}
        </section>

        <section className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">How to use</h2>
          <div className="text-muted-foreground space-y-4">
            <p>
              1. Select the desired type of calculator from the ones presented
              above
            </p>
            <p>2. Enter data in the appropriate fields</p>
            <p>3. Get instant calculation results</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
