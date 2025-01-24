import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'ADA', 'DOGE', 'SOL'];

const fetchCryptoRates = async (base: string) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${getCoinId(base)}&vs_currencies=usd`);
  if (!response.ok) throw new Error('Failed to fetch crypto rates');
  const data = await response.json();
  return data;
};

const getCoinId = (symbol: string) => {
  const coinMap: { [key: string]: string } = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'BNB': 'binancecoin',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'SOL': 'solana'
  };
  return coinMap[symbol] || symbol.toLowerCase();
};

const CryptoConverter = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCrypto, setFromCrypto] = useState('BTC');
  const [toCrypto, setToCrypto] = useState('ETH');
  const { toast } = useToast();

  const { data: fromRate, isLoading: isLoadingFrom } = useQuery({
    queryKey: ['cryptoRate', fromCrypto],
    queryFn: () => fetchCryptoRates(fromCrypto),
    refetchInterval: 30000, 
  });

  const { data: toRate, isLoading: isLoadingTo } = useQuery({
    queryKey: ['cryptoRate', toCrypto],
    queryFn: () => fetchCryptoRates(toCrypto),
    refetchInterval: 30000,
  });

  const isLoading = isLoadingFrom || isLoadingTo;

  const calculateConversion = () => {
    if (!fromRate || !toRate) return '0.00';
    const fromUsdRate = fromRate[getCoinId(fromCrypto)]?.usd || 0;
    const toUsdRate = toRate[getCoinId(toCrypto)]?.usd || 0;
    if (toUsdRate === 0) return '0.00';
    return ((parseFloat(amount) * fromUsdRate) / toUsdRate).toFixed(8);
  };

  const handleError = () => {
    toast({
      title: "Ошибка",
      description: "Не удалось загрузить курсы криптовалют",
      variant: "destructive",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="any"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">From crypto</label>
            <Select value={fromCrypto} onValueChange={setFromCrypto}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CRYPTO_CURRENCIES.map((crypto) => (
                  <SelectItem key={crypto} value={crypto}>
                    {crypto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">To crypto</label>
          <Select value={toCrypto} onValueChange={setToCrypto}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CRYPTO_CURRENCIES.map((crypto) => (
                <SelectItem key={crypto} value={crypto}>
                  {crypto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="pt-4 border-t">
          <p className="text-lg font-semibold">
            {isLoading ? (
              "Loading..."
            ) : (
              `${amount} ${fromCrypto} = ${calculateConversion()} ${toCrypto}`
            )}
          </p>
          {fromRate && toRate && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>1 {fromCrypto} = {fromRate[getCoinId(fromCrypto)]?.usd.toFixed(2)} USD</p>
              <p>1 {toCrypto} = {toRate[getCoinId(toCrypto)]?.usd.toFixed(2)} USD</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CryptoConverter;