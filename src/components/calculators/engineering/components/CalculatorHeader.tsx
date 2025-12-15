import React from "react";
import { Calculator } from "lucide-react";

export const CalculatorHeader = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calculator className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Calculator</h2>
      </div>
    </div>
  );
};
