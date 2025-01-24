import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const CURRENCIES = ['USD', 'EUR', 'RUB', 'GBP', 'JPY', 'CNY', 'UAH', 'KZT', 'AED'];

const fetchExchangeRates = async (base: string) => {
  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
  if (!response.ok) throw new Error('Failed to fetch exchange rates');
  return response.json();
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const { toast } = useToast();

  const { data: rates, isLoading, error } = useQuery({
    queryKey: ['exchangeRates', fromCurrency],
    queryFn: () => fetchExchangeRates(fromCurrency),
    refetchInterval: 60000, 
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load exchange rates",
      variant: "destructive",
    });
  }

  const convertedAmount = rates?.rates?.[toCurrency] 
    ? (parseFloat(amount) * rates.rates[toCurrency]).toFixed(2) 
    : '0.00';

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amont</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">From currency</label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">To currency</label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
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
              `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`
            )}
          </p>
          {rates && (
            <p className="text-sm text-muted-foreground">
              Currency: 1 {fromCurrency} = {rates.rates[toCurrency]} {toCurrency}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CurrencyConverter;