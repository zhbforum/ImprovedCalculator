import { ArrowLeftRight, Landmark, Percent } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedGlowBackground from "@/components/backgrounds/AnimatedGlowBackground";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CompoundInterest from "@/components/calculators/finance/CompoundInterest";
import CurrencyConverter from "@/components/calculators/finance/CurrencyConverter";
import LoanCalculator from "@/components/calculators/finance/LoanCalculator";

import { glassCard } from "@/lib/styles";

const Finance = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <AnimatedGlowBackground
        className="flex-grow"
        contentClassName="flex-grow"
        variant="finance"
      >
        <div className="container mx-auto p-4 py-10">
          <div className="mb-8 max-w-3xl space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Finance Calculator
            </h1>
            <p className="text-muted-foreground">
              Currency conversion, compound growth, and loan payments — in one
              place.
            </p>
          </div>

          <Card className={`${glassCard} p-4 md:p-6`}>
            <Tabs defaultValue="currency" className="w-full">
              <TabsList className="w-full justify-start flex-wrap gap-1 rounded-xl bg-muted/30 p-1">
                <TabsTrigger
                  value="currency"
                  className="gap-2 rounded-lg data-[state=active]:bg-background/60 data-[state=active]:backdrop-blur"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Currency
                </TabsTrigger>

                <TabsTrigger
                  value="compound"
                  className="gap-2 rounded-lg data-[state=active]:bg-background/60 data-[state=active]:backdrop-blur"
                >
                  <Percent className="h-4 w-4" />
                  Compound
                </TabsTrigger>

                <TabsTrigger
                  value="loan"
                  className="gap-2 rounded-lg data-[state=active]:bg-background/60 data-[state=active]:backdrop-blur"
                >
                  <Landmark className="h-4 w-4" />
                  Loan
                </TabsTrigger>
              </TabsList>

              <div className="mt-5">
                <TabsContent value="currency" className="m-0">
                  <div className={`${glassCard} p-5 md:p-6`}>
                    <CurrencyConverter />
                  </div>
                </TabsContent>

                <TabsContent value="compound" className="m-0">
                  <div className={`${glassCard} p-5 md:p-6`}>
                    <CompoundInterest />
                  </div>
                </TabsContent>

                <TabsContent value="loan" className="m-0">
                  <div className={`${glassCard} p-5 md:p-6`}>
                    <LoanCalculator />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </Card>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Card className={`${glassCard} p-4`}>
              <div className="text-sm font-medium">Currency</div>
              <div className="text-sm text-muted-foreground mt-1">
                Rates refresh automatically (every 60s).
              </div>
            </Card>
            <Card className={`${glassCard} p-4`}>
              <div className="text-sm font-medium">Compound</div>
              <div className="text-sm text-muted-foreground mt-1">
                Compound supports monthly contribution.
              </div>
            </Card>
            <Card className={`${glassCard} p-4`}>
              <div className="text-sm font-medium">Loan</div>
              <div className="text-sm text-muted-foreground mt-1">
                Loan shows overpayment and full schedule.
              </div>
            </Card>
          </div>
        </div>
      </AnimatedGlowBackground>

      <Footer />
    </div>
  );
};

export default Finance;
