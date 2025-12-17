import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeftRight } from "lucide-react";

const CURRENCIES = [
  "USD",
  "EUR",
  "RUB",
  "GBP",
  "JPY",
  "CNY",
  "UAH",
  "KZT",
  "AED",
];

const fetchExchangeRates = async (base: string) => {
  const response = await fetch(
    `https://api.exchangerate-api.com/v4/latest/${base}`
  );
  if (!response.ok) throw new Error("Failed to fetch exchange rates");
  return response.json();
};

const clampNumberString = (v: string) => {
  if (v === "") return "";
  const cleaned = v.replace(",", ".");
  if (!/^\d*\.?\d*$/.test(cleaned)) return v;
  return cleaned;
};

const formatMoney = (n: number, digits = 2) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const { toast } = useToast();

  const {
    data: rates,
    isLoading,
    isFetching,
    error,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["exchangeRates", fromCurrency],
    queryFn: () => fetchExchangeRates(fromCurrency),
    refetchInterval: 60_000,
    staleTime: 55_000,
    retry: 2,
  });

  useEffect(() => {
    if (!error) return;
    toast({
      title: "Error",
      description: "Failed to load exchange rates",
      variant: "destructive",
    });
  }, [error, toast]);

  const amountNum = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const rate = rates?.rates?.[toCurrency] as number | undefined;

  const converted = useMemo(() => {
    if (!rate || !Number.isFinite(amountNum)) return null;
    return amountNum * rate;
  }, [amountNum, rate]);

  const onSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const updatedLabel = useMemo(() => {
    if (!dataUpdatedAt) return null;
    const d = new Date(dataUpdatedAt);
    return `Updated: ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }, [dataUpdatedAt]);

  const amountInvalid = amount !== "" && !Number.isFinite(amountNum);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="text-lg font-semibold">Currency converter</div>
          <div className="text-sm text-muted-foreground">
            Live rates. Quick swap. Clean result.
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {isLoading ? "Loading rates…" : updatedLabel}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(clampNumberString(e.target.value))}
            placeholder="e.g. 100"
            aria-invalid={amountInvalid}
          />
          {amountInvalid && (
            <p className="text-xs text-destructive">Enter a valid number.</p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {["1", "10", "100", "1000"].map((v) => (
              <Button
                key={v}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(v)}
                className="h-8 rounded-full bg-background/40 px-3 text-xs hover:bg-background transition"
              >
                {v}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onSwap}
              disabled={isLoading}
              title="Swap currencies"
              aria-label="Swap currencies"
              className="mb-1 h-11 w-11 rounded-full bg-background/70 p-0 hover:bg-background transition"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </Button>

            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border bg-background/30 backdrop-blur p-4">
            <div className="text-sm text-muted-foreground">
              {isLoading || isFetching ? "Calculating…" : "Result"}
            </div>

            <div className="mt-1 text-xl font-semibold">
              {converted == null || amountInvalid ? (
                "—"
              ) : (
                <>
                  {formatMoney(amountNum)} {fromCurrency} ={" "}
                  {formatMoney(converted)} {toCurrency}
                </>
              )}
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              {rate
                ? `1 ${fromCurrency} = ${rate} ${toCurrency}`
                : "Rate unavailable"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
