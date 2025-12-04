import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calculator,
  Delete,
  History,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { evaluate } from "mathjs";

type HistoryItem = {
  expression: string;
  result: string;
};

const trigAndLogButtons = ["sin", "cos", "tan", "log"] as const;
const advancedButtons = ["√", "x²", "(", ")"] as const;

const digitRows = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
] as const;

const bottomRow = ["0", ".", "=", "+"] as const;

const convertToRadiansIfNeeded = (expression: string, isRadians: boolean) => {
  if (isRadians) return expression;

  return expression.replace(
    /(sin|cos|tan)\((.*?)\)/g,
    (_, func, angle) => `${func}((${angle}) * PI / 180)`
  );
};

const autoCloseParentheses = (expression: string): string => {
  let balance = 0;

  for (const char of expression) {
    if (char === "(") {
      balance += 1;
    } else if (char === ")") {
      if (balance > 0) {
        balance -= 1;
      }
    }
  }

  if (balance > 0) {
    return expression + ")".repeat(balance);
  }

  return expression;
};

const EngineeringCalculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isRadians, setIsRadians] = useState(true);

  const appendValue = (value: string) => {
    setInput((prev) => prev + value);
  };

  const handleFunctionClick = (func: string) => {
    setInput((prev) => {
      if (!prev) {
        if (["sin", "cos", "tan", "log"].includes(func)) {
          return `${func}(`;
        }

        if (func === "√") {
          return "sqrt(";
        }

        return prev;
      }

      const safePrev = prev;

      if (["sin", "cos", "tan"].includes(func)) {
        return `${func}(${safePrev})`;
      }

      if (func === "√") {
        return `sqrt(${safePrev})`;
      }

      if (func === "x²") {
        return `(${safePrev})^2`;
      }

      return `${func}(${safePrev})`;
    });
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    if (!input.trim()) return;

    try {
      const balancedExpression = autoCloseParentheses(input);

      setInput(balancedExpression);

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
    } catch {
      setResult("Error");
    }
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setInput(item.expression);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-4xl p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr,300px]">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
                <Calculator className="h-8 w-8" />
                Engineering Calculator
              </h1>
              <p className="text-sm text-gray-500">
                Supports trigonometric and logarithmic functions, with
                radians/degrees modes.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter an expression"
                className="h-12 text-lg font-medium"
              />

              <div className="rounded-xl border bg-card p-4">
                <div className="mb-1 text-sm text-muted-foreground">
                  Result:
                </div>
                <div className="text-3xl font-bold text-primary">
                  {result || "0"}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsRadians((prev) => !prev)}
                  className="col-span-2"
                >
                  {isRadians ? "Radians" : "Degrees"}
                </Button>
                <Button variant="outline" onClick={handleDelete}>
                  <Delete className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  C
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {trigAndLogButtons.map((func) => (
                  <Button
                    key={func}
                    variant="outline"
                    onClick={() => handleFunctionClick(func)}
                  >
                    {func}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {advancedButtons.map((op) => (
                  <Button
                    key={op}
                    variant="outline"
                    onClick={() =>
                      op === "√" || op === "x²"
                        ? handleFunctionClick(op)
                        : appendValue(op)
                    }
                  >
                    {op}
                  </Button>
                ))}
              </div>

              {digitRows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-2">
                  {row.map((btn) => (
                    <Button
                      key={btn}
                      variant="outline"
                      onClick={() => appendValue(btn)}
                    >
                      {btn}
                    </Button>
                  ))}
                </div>
              ))}

              <div className="grid grid-cols-4 gap-2">
                {bottomRow.map((btn) => (
                  <Button
                    key={btn}
                    variant={btn === "=" ? "default" : "outline"}
                    onClick={() =>
                      btn === "=" ? handleCalculate() : appendValue(btn)
                    }
                  >
                    {btn}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 border-l pl-8">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <History className="h-5 w-5" />
                History
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-gray-500"
                disabled={history.length === 0}
              >
                Clear History
                <RotateCcw className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {history.map((item, index) => (
                  <button
                    key={`${item.expression}-${index}`}
                    onClick={() => handleHistoryClick(item)}
                    className="group w-full rounded-lg p-3 text-left transition-colors hover:bg-accent"
                  >
                    <div className="text-sm text-muted-foreground">
                      {item.expression}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-foreground">
                        {item.result}
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </button>
                ))}

                {history.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Calculation history will appear here.
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EngineeringCalculator;
