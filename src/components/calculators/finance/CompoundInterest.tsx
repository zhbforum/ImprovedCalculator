import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CompoundInterest = () => {
  const [principal, setPrincipal] = useState<string>('1000');
  const [rate, setRate] = useState<string>('5');
  const [time, setTime] = useState<string>('1');
  const [frequency, setFrequency] = useState<string>('12');
  const [result, setResult] = useState<number>(0);

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(frequency);
    
    const amount = p * Math.pow(1 + r/n, n * t);
    setResult(amount);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
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
          <label className="text-sm font-medium">Annual interest rate (%)</label>
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Frequency of interest calculation</label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Annually</SelectItem>
              <SelectItem value="2">Once every six months</SelectItem>
              <SelectItem value="4">Quarterly</SelectItem>
              <SelectItem value="12">Monthly</SelectItem>
              <SelectItem value="365">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={calculateCompoundInterest} className="w-full">
          Calculate
        </Button>
        {result > 0 && (
          <div className="pt-4 border-t">
            <p className="text-lg font-semibold">
              Total amount: {result.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              Income: {(result - parseFloat(principal)).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CompoundInterest;