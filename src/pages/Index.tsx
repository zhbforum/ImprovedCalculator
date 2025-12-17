import { Link } from "react-router-dom";
import {
  Calculator,
  ChartCandlestick,
  ChartLine,
  CodeXml,
  DollarSign,
  Grid,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import AnimatedGlowBackground from "@/components/backgrounds/AnimatedGlowBackground";
import { Card } from "@/components/ui/card";

import { glassCard } from "@/lib/styles";

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

      <AnimatedGlowBackground
        className="flex-grow"
        contentClassName="flex-grow"
        variant="default"
      >
        <main className="flex-1 container py-10">
          <section className="text-center mb-12">
            <div className="relative inline-block">
              <div className="hero-title-glow">
                <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl mb-4">
                  Multifunctional calculator
                </h1>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A powerful tool for mathematical, financial and engineering
              calculations
            </p>
          </section>

          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="group">
                <Card
                  className={`${glassCard} p-6 h-full cursor-pointer transition
                              hover:bg-background/45 hover:shadow-lg`}
                >
                  <div className="mb-4 text-primary">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              </Link>
            ))}
          </section>

          <section className={`${glassCard} max-w-3xl mx-auto text-center p-6`}>
            <h2 className="text-2xl font-semibold mb-4">How to use</h2>
            <div className="text-muted-foreground space-y-3">
              <p>
                1. Select the desired type of calculator from the ones presented
                above
              </p>
              <p>2. Enter data in the appropriate fields</p>
              <p>3. Get instant calculation results</p>
            </div>
          </section>
        </main>
      </AnimatedGlowBackground>

      <Footer />
    </div>
  );
};

export default Index;
