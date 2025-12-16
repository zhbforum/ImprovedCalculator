import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fmt = (n: number, digits = 2) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);

const safeNum = (s: string) => {
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

const CompoundInterest = () => {
  const [principal, setPrincipal] = useState("1000");
  const [monthlyContribution, setMonthlyContribution] = useState("0");
  const [rate, setRate] = useState("5");
  const [time, setTime] = useState("5");
  const [frequency, setFrequency] = useState("12");

  const [calculated, setCalculated] = useState(false);

  const result = useMemo(() => {
    const P = safeNum(principal);
    const PMT = safeNum(monthlyContribution);
    const r = safeNum(rate) / 100;
    const t = safeNum(time);
    const n = safeNum(frequency);

    if (![P, PMT, r, t, n].every(Number.isFinite)) return null;
    if (P < 0 || PMT < 0 || r < 0 || t < 0 || n <= 0) return null;

    const i = r / n;
    const periods = n * t;
    const fvPrincipal = P * Math.pow(1 + i, periods);

    const months = Math.round(t * 12);
    const im = r / 12;
    let fvContrib = 0;

    for (let m = 1; m <= months; m++) {
      fvContrib += PMT * Math.pow(1 + im, months - m);
    }

    const total = fvPrincipal + fvContrib;
    const invested = P + PMT * months;
    const income = total - invested;

    return { total, invested, income, months };
  }, [principal, monthlyContribution, rate, time, frequency]);

  const canCalc = result !== null;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-lg font-semibold">Compound interest</div>
          <div className="text-sm text-muted-foreground">
            Growth with optional monthly contributions.
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {result ? `${result.months} months` : "—"}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Initial amount</label>
          <Input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Monthly contribution</label>
          <Input
            type="number"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Annual interest rate (%)
          </label>
          <Input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            min="0"
            step="0.1"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration (years)</label>
          <Input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            min="0"
            step="0.5"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Compounding frequency</label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Annually</SelectItem>
              <SelectItem value="2">Semi-annually</SelectItem>
              <SelectItem value="4">Quarterly</SelectItem>
              <SelectItem value="12">Monthly</SelectItem>
              <SelectItem value="365">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Button
            className="w-full"
            onClick={() => setCalculated(true)}
            disabled={!canCalc}
          >
            Calculate
          </Button>
        </div>
      </div>

      <div className="mt-5 rounded-xl border bg-background/30 backdrop-blur p-4">
        <div className="text-sm text-muted-foreground">Result</div>

        {!calculated || !result ? (
          <div className="mt-2 text-sm text-muted-foreground">
            Enter values and press calculate.
          </div>
        ) : (
          <div className="mt-2 space-y-1">
            <div className="text-xl font-semibold">
              Total: {fmt(result.total)}
            </div>
            <div className="text-sm text-muted-foreground">
              Invested: {fmt(result.invested)} · Income: {fmt(result.income)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompoundInterest;
