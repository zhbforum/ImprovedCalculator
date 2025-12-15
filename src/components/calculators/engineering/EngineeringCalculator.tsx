import React, { useCallback, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { evaluate } from "mathjs";
import type { HistoryItem, RightPanelTab } from "./types";
import { autoCloseParentheses, convertToRadiansIfNeeded } from "./utils";
import { useEngineeringKeyboard } from "./hooks/useEngineeringKeyboard";
import { CalculatorHeader } from "./components/CalculatorHeader";
import { ExpressionInput } from "./components/ExpressionInput";
import { ResultCard } from "./components/ResultCard";
import { Keypad } from "./components/Keypad";
import { RightPanel } from "./components/RightPanel";

const EngineeringCalculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isRadians, setIsRadians] = useState(true);
  const [rightTab, setRightTab] = useState<RightPanelTab>("history");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const appendValue = useCallback((value: string) => {
    setInput((prev) => prev + value);
  }, []);

  const handleFunctionClick = (func: string) => {
    setInput((prev) => {
      if (!prev) {
        if (["sin", "cos", "tan", "log"].includes(func)) return `${func}(`;
        if (func === "√") return "sqrt(";
        return prev;
      }

      const safePrev = prev;

      if (["sin", "cos", "tan"].includes(func)) return `${func}(${safePrev})`;
      if (func === "√") return `sqrt(${safePrev})`;
      if (func === "x²") return `(${safePrev})^2`;

      return `${func}(${safePrev})`;
    });
  };

  const handleClear = useCallback(() => {
    setInput("");
    setResult("");
  }, []);

  const handleDelete = useCallback(() => {
    setInput((prev) => prev.slice(0, -1));
  }, []);

  const handleCalculate = useCallback(() => {
    setInput((current) => {
      if (!current.trim()) return current;

      try {
        const balancedExpression = autoCloseParentheses(current);
        const expressionForEval = convertToRadiansIfNeeded(
          balancedExpression,
          isRadians
        );
        const calculatedResult = evaluate(expressionForEval).toString();

        setResult(calculatedResult);
        setHistory((prev) => [
          ...prev,
          { expression: balancedExpression, result: calculatedResult },
        ]);

        return balancedExpression;
      } catch {
        setResult("Error");
        return current;
      }
    });
  }, [isRadians]);

  const handlePickHistory = (item: HistoryItem) => setInput(item.expression);
  const clearHistory = () => setHistory([]);

  useEngineeringKeyboard({
    inputRef,
    rightTab,
    setRightTab,
    setIsRadians,
    appendValue,
    handleClear,
    handleDelete,
    handleCalculate,
  });

  return (
    <Card className="relative overflow-hidden border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10" />

      <div className="relative p-6 md:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr,320px]">
          <div className="space-y-6">
            <CalculatorHeader />

            <div className="space-y-4">
              <ExpressionInput
                inputRef={inputRef}
                value={input}
                onChange={setInput}
              />

              <ResultCard result={result} />

              <Keypad
                isRadians={isRadians}
                onToggleRadians={() => setIsRadians((p) => !p)}
                onDelete={handleDelete}
                onClear={handleClear}
                onAppend={appendValue}
                onFunctionClick={handleFunctionClick}
                onCalculate={handleCalculate}
              />
            </div>
          </div>

          <RightPanel
            rightTab={rightTab}
            setRightTab={setRightTab}
            history={history}
            onPickHistory={handlePickHistory}
            onClearHistory={clearHistory}
          />
        </div>
      </div>
    </Card>
  );
};

export default EngineeringCalculator;
