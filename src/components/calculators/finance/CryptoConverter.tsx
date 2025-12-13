import React, { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeftRight,
  RefreshCcw,
  Copy,
  Star,
  StarOff,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const CRYPTO_CURRENCIES = [
  "BTC",
  "ETH",
  "USDT",
  "BNB",
  "XRP",
  "ADA",
  "DOGE",
  "SOL",
];
const REFRESH_SECONDS = 30;

const POPULAR = [
  { symbol: "BTC", id: "bitcoin" },
  { symbol: "ETH", id: "ethereum" },
  { symbol: "SOL", id: "solana" },
  { symbol: "XRP", id: "ripple" },
] as const;

const LS_RECENT = "crypto_converter_recent_pairs_v1";
const LS_FAVS = "crypto_converter_favorite_pairs_v1";

type Pair = { from: string; to: string };

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

const getCoinId = (symbol: string) => {
  const coinMap: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    BNB: "binancecoin",
    XRP: "ripple",
    ADA: "cardano",
    DOGE: "dogecoin",
    SOL: "solana",
  };
  return coinMap[symbol] || symbol.toLowerCase();
};

const fetchUsdRatesFor = async (symbols: string[]) => {
  const ids = symbols.map(getCoinId).join(",");

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );

    if (!res.ok) {
      throw new ApiError("Failed to fetch crypto rates", res.status);
    }

    return res.json();
  } catch {
    throw new ApiError("Network/CORS error while fetching rates");
  }
};

const fetchPopularRates = async () => {
  const ids = POPULAR.map((p) => p.id).join(",");

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );

    if (!res.ok) {
      throw new ApiError("Failed to fetch popular crypto rates", res.status);
    }

    return res.json();
  } catch {
    throw new ApiError("Network/CORS error while fetching popular rates");
  }
};

const fmt = (v: number, max = 8) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: max }).format(v);

const safeParse = (value: string) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, n);
};

const readPairs = (key: string): Pair[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x) =>
          x &&
          typeof x === "object" &&
          typeof x.from === "string" &&
          typeof x.to === "string"
      )
      .slice(0, 12);
  } catch {
    return [];
  }
};

const safeLocalStorageSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
};

const writePairs = (key: string, pairs: Pair[]) => {
  safeLocalStorageSet(key, JSON.stringify(pairs.slice(0, 12)));
};

const pairKey = (p: Pair) => `${p.from}->${p.to}`;

const getStatus = (err: unknown) =>
  err instanceof ApiError ? err.status : undefined;

const CryptoConverter = () => {
  const [amount, setAmount] = useState<string>("1");
  const [fromCrypto, setFromCrypto] = useState("BTC");
  const [toCrypto, setToCrypto] = useState("ETH");

  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const [recentPairs, setRecentPairs] = React.useState<Pair[]>(() => []);
  const [favoritePairs, setFavoritePairs] = React.useState<Pair[]>(() => []);

  React.useEffect(() => {
    setRecentPairs(readPairs(LS_RECENT));
    setFavoritePairs(readPairs(LS_FAVS));
  }, []);

  const popularQuery = useQuery({
    queryKey: ["popularCryptoRates"],
    queryFn: fetchPopularRates,
    refetchInterval: 30000,
    retry: 1,
  });

  const ratesQuery = useQuery({
    queryKey: ["cryptoRatesPair", fromCrypto, toCrypto],
    queryFn: () => fetchUsdRatesFor([fromCrypto, toCrypto]),
    refetchInterval: 30000,
    retry: (count, err) => {
      const s = getStatus(err);
      if (s === 429) return count < 1;
      return count < 2;
    },
  });

  const isLoading = ratesQuery.isLoading || popularQuery.isLoading;

  const fromUsd = ratesQuery.data?.[getCoinId(fromCrypto)]?.usd ?? 0;
  const toUsd = ratesQuery.data?.[getCoinId(toCrypto)]?.usd ?? 0;

  const numericAmount = safeParse(amount);

  const converted = useMemo(() => {
    if (!fromUsd || !toUsd) return 0;
    return (numericAmount * fromUsd) / toUsd;
  }, [numericAmount, fromUsd, toUsd]);

  const hasRates = fromUsd > 0 && toUsd > 0;

  const lastUpdated = Math.max(
    ratesQuery.dataUpdatedAt || 0,
    popularQuery.dataUpdatedAt || 0
  );

  const secondsAgo = lastUpdated
    ? Math.floor((now - lastUpdated) / 1000)
    : null;
  const progress = lastUpdated
    ? Math.min(1, (now - lastUpdated) / 1000 / REFRESH_SECONDS)
    : 0;

  const prevFromUsd = useRef<number>(0);
  const prevToUsd = useRef<number>(0);

  const [flashFrom, setFlashFrom] = useState<"up" | "down" | null>(null);
  const [flashTo, setFlashTo] = useState<"up" | "down" | null>(null);

  React.useEffect(() => {
    if (!fromUsd) return;
    const prev = prevFromUsd.current;
    if (prev && prev !== fromUsd) {
      setFlashFrom(fromUsd > prev ? "up" : "down");
      window.setTimeout(() => setFlashFrom(null), 650);
    }
    prevFromUsd.current = fromUsd;
  }, [fromUsd]);

  React.useEffect(() => {
    if (!toUsd) return;
    const prev = prevToUsd.current;
    if (prev && prev !== toUsd) {
      setFlashTo(toUsd > prev ? "up" : "down");
      window.setTimeout(() => setFlashTo(null), 650);
    }
    prevToUsd.current = toUsd;
  }, [toUsd]);

  const [isSwapping, setIsSwapping] = useState(false);
  const swap = () => {
    setIsSwapping(true);
    window.setTimeout(() => setIsSwapping(false), 180);
    setFromCrypto(toCrypto);
    setToCrypto(fromCrypto);
  };

  const saveRecent = (p: Pair) => {
    setRecentPairs((prev) => {
      const next = [p, ...prev.filter((x) => pairKey(x) !== pairKey(p))].slice(
        0,
        8
      );
      writePairs(LS_RECENT, next);
      return next;
    });
  };

  const isFavorite = useMemo(
    () => favoritePairs.some((p) => p.from === fromCrypto && p.to === toCrypto),
    [favoritePairs, fromCrypto, toCrypto]
  );

  const toggleFavorite = () => {
    const p = { from: fromCrypto, to: toCrypto };
    setFavoritePairs((prev) => {
      const exists = prev.some((x) => pairKey(x) === pairKey(p));
      const next = exists
        ? prev.filter((x) => pairKey(x) !== pairKey(p))
        : [p, ...prev];
      writePairs(LS_FAVS, next);
      return next;
    });
  };

  React.useEffect(() => {
    if (!fromCrypto || !toCrypto) return;
    saveRecent({ from: fromCrypto, to: toCrypto });
  }, [fromCrypto, toCrypto]);

  const err = (ratesQuery.error as unknown) ?? (popularQuery.error as unknown);

  const lastToastKeyRef = useRef<string | null>(null);

  React.useEffect(() => {
    if (!err) return;

    const status = getStatus(err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    const key = `${status ?? "no-status"}:${msg}`;

    if (lastToastKeyRef.current === key) return;
    lastToastKeyRef.current = key;

    if (status === 429) {
      toast.warning("Rate limit reached", {
        description:
          "CoinGecko is throttling requests. Please wait 30–60 seconds and try again.",
      });
      return;
    }

    toast.error("Request failed", {
      description:
        status === undefined
          ? "Blocked by CORS / network error. Consider using a backend proxy for CoinGecko."
          : "Failed to load crypto rates. Please try again later.",
    });
  }, [err]);

  const copyResult = async () => {
    const text = `${fmt(numericAmount)} ${fromCrypto} = ${fmt(
      converted,
      8
    )} ${toCrypto}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied", { description: text });
    } catch {
      toast.error("Copy failed");
    }
  };

  const amountPresets = useMemo(() => {
    if (fromCrypto === "USDT" || fromCrypto === "BNB")
      return ["10", "50", "100", "500", "1000"];
    if (fromCrypto === "BTC" || fromCrypto === "ETH")
      return ["0.01", "0.05", "0.1", "0.5", "1"];
    return ["1", "2", "5", "10", "25"];
  }, [fromCrypto]);

  const applyPair = (p: Pair) => {
    setFromCrypto(p.from);
    setToCrypto(p.to);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {POPULAR.map((p) => {
          const usd = popularQuery.data?.[p.id]?.usd;
          const loading = popularQuery.isLoading && !popularQuery.data;

          return (
            <Card
              key={p.symbol}
              className="relative overflow-hidden border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10" />
              <div className="relative p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{p.symbol}</div>
                  <div className="text-xs text-muted-foreground">USD</div>
                </div>

                {loading ? (
                  <div className="mt-3 space-y-2">
                    <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="text-2xl font-bold">
                      {usd ? fmt(usd, 2) : "—"}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Live
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="relative overflow-hidden border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10" />

        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Convert</h2>
              <p className="text-sm text-muted-foreground">
                Real-time USD-based rates • auto refresh every 30s
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RefreshCcw className="h-4 w-4" />
                <span>
                  {isLoading
                    ? "refreshing..."
                    : secondsAgo === null
                    ? "waiting for data..."
                    : `updated ${secondsAgo}s ago`}
                </span>
              </div>

              <div className="h-1 w-40 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-[width] duration-500"
                  style={{ width: `${Math.max(6, (1 - progress) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {(favoritePairs.length > 0 || recentPairs.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {favoritePairs.slice(0, 3).map((p) => (
                <button
                  key={`fav-${pairKey(p)}`}
                  type="button"
                  onClick={() => applyPair(p)}
                  className="h-8 rounded-full border bg-background/60 px-3 text-xs hover:bg-background transition"
                  title="Favorite"
                >
                  {p.from} → {p.to}
                </button>
              ))}

              {recentPairs
                .filter(
                  (p) => !favoritePairs.some((f) => pairKey(f) === pairKey(p))
                )
                .slice(0, 3)
                .map((p) => (
                  <button
                    key={`recent-${pairKey(p)}`}
                    type="button"
                    onClick={() => applyPair(p)}
                    className="h-8 rounded-full border bg-background/40 px-3 text-xs hover:bg-background transition"
                    title="Recent"
                  >
                    {p.from} → {p.to}
                  </button>
                ))}
            </div>
          )}

          <div
            className={[
              "mt-6 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-start transition-transform duration-200",
              isSwapping ? "scale-[0.985]" : "scale-100",
            ].join(" ")}
          >
            <div className="space-y-3">
              <label className="text-sm font-medium">You send</label>

              <div className="grid grid-cols-[1fr_160px] gap-3">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="any"
                  className="h-11"
                />

                <Select value={fromCrypto} onValueChange={setFromCrypto}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CRYPTO_CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2">
                {amountPresets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className="h-8 rounded-full border bg-background/40 px-3 text-xs hover:bg-background transition"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs transition",
                  flashFrom === "up"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : flashFrom === "down"
                    ? "bg-rose-500/10 text-rose-600"
                    : "bg-muted/40 text-muted-foreground",
                ].join(" ")}
              >
                {flashFrom === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : flashFrom === "down" ? (
                  <TrendingDown className="h-4 w-4" />
                ) : null}
                <span>
                  {fromUsd ? `1 ${fromCrypto} = ${fmt(fromUsd, 2)} USD` : "—"}
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-2 self-start pt-7">
              <button
                type="button"
                onClick={swap}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-background/70 hover:bg-background transition"
                aria-label="Swap currencies"
                title="Swap"
              >
                <ArrowLeftRight className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={toggleFavorite}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-background/70 hover:bg-background transition"
                aria-label="Toggle favorite"
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                {isFavorite ? (
                  <StarOff className="h-5 w-5" />
                ) : (
                  <Star className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">You get</label>

              <Select value={toCrypto} onValueChange={setToCrypto}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CRYPTO_CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 opacity-0 pointer-events-none select-none">
                {amountPresets.map((p) => (
                  <span
                    key={p}
                    className="h-8 rounded-full border px-3 text-xs"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs transition",
                  flashTo === "up"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : flashTo === "down"
                    ? "bg-rose-500/10 text-rose-600"
                    : "bg-muted/40 text-muted-foreground",
                ].join(" ")}
              >
                {flashTo === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : flashTo === "down" ? (
                  <TrendingDown className="h-4 w-4" />
                ) : null}
                <span>
                  {toUsd ? `1 ${toCrypto} = ${fmt(toUsd, 2)} USD` : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border bg-background/60 p-4 md:p-5">
            {isLoading || !hasRates ? (
              <div className="space-y-2">
                <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">Result</div>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <div className="text-2xl md:text-3xl font-bold tracking-tight">
                    {fmt(numericAmount)} {fromCrypto}{" "}
                    <span className="text-muted-foreground font-semibold">
                      =
                    </span>{" "}
                    {fmt(converted, 8)} {toCrypto}
                  </div>

                  <button
                    type="button"
                    onClick={copyResult}
                    disabled={!hasRates}
                    className="inline-flex h-9 items-center gap-2 rounded-full border bg-background/70 px-3 text-sm hover:bg-background transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Copy result"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Rates by CoinGecko. API rate limits and CORS restrictions may apply.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CryptoConverter;
