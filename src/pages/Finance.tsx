import React, { useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

import CompoundInterest from "@/components/calculators/finance/CompoundInterest";
import CurrencyConverter from "@/components/calculators/finance/CurrencyConverter";
import LoanCalculator from "@/components/calculators/finance/LoanCalculator";

import { ArrowLeftRight, Percent, Landmark } from "lucide-react";

const glassCard =
  "rounded-2xl border bg-background/35 backdrop-blur-xl shadow-sm";

const Finance = () => {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;

    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media?.matches) return;

    const setVars = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      const cx = Math.min(1, Math.max(0, x));
      const cy = Math.min(1, Math.max(0, y));

      el.style.setProperty("--mx", `${Math.round(cx * 100)}%`);
      el.style.setProperty("--my", `${Math.round(cy * 100)}%`);

      const ox = (cx - 0.5) * 2;
      const oy = (cy - 0.5) * 2;
      el.style.setProperty("--ox", `${ox.toFixed(3)}`);
      el.style.setProperty("--oy", `${oy.toFixed(3)}`);
    };

    const onMove = (e: PointerEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setVars(e.clientX, e.clientY);
      });
    };

    const onLeave = () => {
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
      el.style.setProperty("--ox", "0");
      el.style.setProperty("--oy", "0");
    };

    onLeave();

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div ref={areaRef} className="relative flex-grow overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

          <div
            className="finance-blob-1 absolute -top-28 left-1/2 h-[520px] w-[min(920px,100vw)] -translate-x-1/2 rounded-full
                       bg-gradient-to-r from-primary/25 via-emerald-500/15 to-cyan-500/25 blur-3xl"
            style={{
              transform:
                "translateX(-50%) translateY(calc(var(--oy, 0) * 10px)) scale(calc(1 + (var(--ox, 0) * 0.03)))",
            }}
          />
          <div
            className="finance-blob-2 absolute -bottom-40 left-1/2 h-[520px] w-[min(920px,100vw)] -translate-x-1/2 rounded-full
                       bg-gradient-to-r from-purple-500/10 via-primary/10 to-emerald-500/10 blur-3xl"
            style={{
              transform:
                "translateX(-50%) translateY(calc(var(--oy, 0) * -12px)) scale(calc(1 + (var(--ox, 0) * 0.04)))",
            }}
          />

          <div
            className="finance-shimmer absolute inset-0 opacity-45 mix-blend-soft-light"
            style={{
              background:
                "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), hsl(var(--primary)/0.22), transparent 45%)," +
                "radial-gradient(circle at calc(var(--mx, 50%) + 18%) calc(var(--my, 50%) + 10%), rgba(16,185,129,0.14), transparent 50%)," +
                "radial-gradient(circle at calc(var(--mx, 50%) - 14%) calc(var(--my, 50%) + 22%), rgba(34,211,238,0.14), transparent 55%)",
            }}
          />
        </div>

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
              <div className="text-sm font-medium">Tip</div>
              <div className="text-sm text-muted-foreground mt-1">
                Rates refresh automatically (every 60s).
              </div>
            </Card>
            <Card className={`${glassCard} p-4`}>
              <div className="text-sm font-medium">Tip</div>
              <div className="text-sm text-muted-foreground mt-1">
                Compound supports monthly contribution.
              </div>
            </Card>
            <Card className={`${glassCard} p-4`}>
              <div className="text-sm font-medium">Tip</div>
              <div className="text-sm text-muted-foreground mt-1">
                Loan shows overpayment and full schedule.
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Finance;
