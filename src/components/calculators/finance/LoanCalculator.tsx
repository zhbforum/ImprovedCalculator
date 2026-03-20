import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentSchedule {
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

type LoanMode = "annuity" | "differential";

const isLoanMode = (v: string): v is LoanMode =>
  v === "annuity" || v === "differential";

const fmt = (n: number, locale?: string) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(n);

const safeNum = (s: string) => {
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

const LoanCalculator = () => {
  const { t, i18n } = useTranslation();
  const [amount, setAmount] = useState("1000000");
  const [rate, setRate] = useState("10");
  const [term, setTerm] = useState("12");

  const [schedule, setSchedule] = useState<PaymentSchedule[]>([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [mode, setMode] = useState<LoanMode>("annuity");

  const inputs = useMemo(() => {
    const p = safeNum(amount);
    const apr = safeNum(rate);
    const n = safeNum(term);
    const r = apr / 100 / 12;
    return { p, apr, n, r };
  }, [amount, rate, term]);

  const canCalc =
    Number.isFinite(inputs.p) &&
    inputs.p > 0 &&
    Number.isFinite(inputs.apr) &&
    inputs.apr >= 0 &&
    Number.isFinite(inputs.n) &&
    inputs.n >= 1;

  const calculate = () => {
    if (!canCalc) return;

    const p = inputs.p;
    const r = inputs.r;
    const n = Math.floor(inputs.n);

    const newSchedule: PaymentSchedule[] = [];
    let total = 0;

    if (mode === "annuity") {
      const monthlyPayment =
        r === 0
          ? p / n
          : (p * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);

      let balance = p;

      for (let i = 0; i < n; i++) {
        const interest = balance * r;
        const principal = monthlyPayment - interest;
        balance -= principal;

        newSchedule.push({
          payment: monthlyPayment,
          principal,
          interest,
          remainingBalance: Math.max(0, balance),
        });

        total += monthlyPayment;
      }
    } else {
      const principalPayment = p / n;
      let balance = p;

      for (let i = 0; i < n; i++) {
        const interest = balance * r;
        const payment = principalPayment + interest;
        balance -= principalPayment;

        newSchedule.push({
          payment,
          principal: principalPayment,
          interest,
          remainingBalance: Math.max(0, balance),
        });

        total += payment;
      }
    }

    setSchedule(newSchedule);
    setTotalPayment(total);
  };

  const overpayment = schedule.length ? totalPayment - safeNum(amount) : 0;

  return (
    <div>
      <div className="space-y-1">
        <div className="text-lg font-semibold">{t("finance.loan.title")}</div>
        <div className="text-sm text-muted-foreground">
          {t("finance.loan.description")}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("finance.loan.amount")}
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("finance.loan.apr")}
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
          <label className="text-sm font-medium">
            {t("finance.loan.term")}
          </label>
          <Input
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            min="1"
          />
        </div>
      </div>

      <div className="mt-4">
        <Tabs
          value={mode}
          onValueChange={(v) => {
            if (isLoanMode(v)) setMode(v);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/30 p-1">
            <TabsTrigger
              value="annuity"
              className="rounded-lg data-[state=active]:bg-background/60 data-[state=active]:backdrop-blur"
            >
              {t("finance.loan.tabs.annuity")}
            </TabsTrigger>
            <TabsTrigger
              value="differential"
              className="rounded-lg data-[state=active]:bg-background/60 data-[state=active]:backdrop-blur"
            >
              {t("finance.loan.tabs.differential")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="annuity" className="mt-3">
            <Button onClick={calculate} className="w-full" disabled={!canCalc}>
              {t("finance.loan.calculate")}
            </Button>
          </TabsContent>

          <TabsContent value="differential" className="mt-3">
            <Button onClick={calculate} className="w-full" disabled={!canCalc}>
              {t("finance.loan.calculate")}
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {schedule.length > 0 && (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border bg-background/30 backdrop-blur p-4">
              <div className="text-sm text-muted-foreground">
                {t("finance.loan.totalPayment")}
              </div>
              <div className="text-lg font-semibold">
                {fmt(totalPayment, i18n.language)}
              </div>
            </div>

            <div className="rounded-xl border bg-background/30 backdrop-blur p-4">
              <div className="text-sm text-muted-foreground">
                {t("finance.loan.overpayment")}
              </div>
              <div className="text-lg font-semibold">
                {fmt(overpayment, i18n.language)}
              </div>
            </div>

            <div className="rounded-xl border bg-background/30 backdrop-blur p-4">
              <div className="text-sm text-muted-foreground">
                {t("finance.loan.months")}
              </div>
              <div className="text-lg font-semibold">{schedule.length}</div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border bg-background/25 backdrop-blur">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/25">
                <tr className="border-b">
                  <th className="text-left p-2">
                    {t("finance.loan.table.number")}
                  </th>
                  <th className="text-left p-2">
                    {t("finance.loan.table.payment")}
                  </th>
                  <th className="text-left p-2">
                    {t("finance.loan.table.principal")}
                  </th>
                  <th className="text-left p-2">
                    {t("finance.loan.table.interest")}
                  </th>
                  <th className="text-left p-2">
                    {t("finance.loan.table.remaining")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{fmt(row.payment, i18n.language)}</td>
                    <td className="p-2">{fmt(row.principal, i18n.language)}</td>
                    <td className="p-2">{fmt(row.interest, i18n.language)}</td>
                    <td className="p-2">
                      {fmt(row.remainingBalance, i18n.language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
