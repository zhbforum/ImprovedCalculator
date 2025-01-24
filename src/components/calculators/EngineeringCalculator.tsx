import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calculator, Delete, History, RotateCcw, ChevronRight } from "lucide-react";
import { evaluate } from "mathjs";

const EngineeringCalculator = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<
    Array<{ expression: string; result: string }>
  >([]);
  const [isRadians, setIsRadians] = useState<boolean>(true);

  const handleNumberClick = (value: string) => {
    setInput((prev) => prev + value);
  };

  const handleOperatorClick = (operator: string) => {
    setInput((prev) => prev + operator);
  };

  const handleFunctionClick = (func: string) => 
  {
    if (["sin", "cos", "tan"].includes(func)) 
    {
      setInput((prev) => `${func}(${prev})`);
    } 
    else if (func === "√") 
    {
      setInput((prev) => `sqrt(${prev})`);
    } 
    else if (func === "x²") 
    {
      setInput((prev) => `(${prev})^2`);
    } 
    else 
    {
      setInput((prev) => `${func}(${prev})`);
    }
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      let expression = input;
      if (!isRadians) 
      {
        expression = expression.replace(
          /(sin|cos|tan)\((.*?)\)/g,
          (_, func, angle) => `${func}((${angle}) * PI / 180)`,
        );
      }
      const calculatedResult = evaluate(expression).toString();
      setResult(calculatedResult);
      setHistory((prev) => [
        ...prev,
        { expression: input, result: calculatedResult },
      ]);
    } 
    catch (error) 
    {
      setResult("Error");
    }
  };

  const handleHistoryClick = (item: { expression: string; result: string }) => {
    setInput(item.expression);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-4xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,300px] gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                <Calculator className="h-8 w-8" />
                Engineering Calculator
              </h1>
              <p className="text-sm text-gray-500">
                Supports trigonometric functions and complex computers.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter an expression"
                className="text-lg font-medium h-12"
              />

              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="text-sm text-gray-600 mb-1">Result:</div>
                <div className="text-3xl font-bold text-blue-600">
                  {result || "0"}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsRadians(!isRadians)}
                  className="col-span-2"
                >
                  {isRadians ? "Radians" : "Degrees"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="col-span-1"
                >
                  <Delete className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="col-span-1"
                >
                  C
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {["sin", "cos", "tan", "log"].map((func) => (
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
                {["√", "x²", "(", ")"].map((op) => (
                  <Button
                    key={op}
                    variant="outline"
                    onClick={() => {
                      if (op === "√" || op === "x²") {
                        handleFunctionClick(op);
                      } else {
                        handleOperatorClick(op);
                      }
                    }}
                  >
                    {op}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {["7", "8", "9", "/"].map((btn) => (
                  <Button
                    key={btn}
                    variant="outline"
                    onClick={() => handleNumberClick(btn)}
                  >
                    {btn}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {["4", "5", "6", "*"].map((btn) => (
                  <Button
                    key={btn}
                    variant="outline"
                    onClick={() => handleNumberClick(btn)}
                  >
                    {btn}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {["1", "2", "3", "-"].map((btn) => (
                  <Button
                    key={btn}
                    variant="outline"
                    onClick={() => handleNumberClick(btn)}
                  >
                    {btn}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {["0", ".", "=", "+"].map((btn) => (
                  <Button
                    key={btn}
                    variant={btn === "=" ? "default" : "outline"}
                    onClick={() =>
                      btn === "=" ? handleCalculate() : handleNumberClick(btn)
                    }
                  >
                    {btn}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-l pl-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <History className="h-5 w-5" />
                History
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-gray-500"
              >
                Clear History
                <RotateCcw className="h-4 w-4" />
              </Button>
              <button>
                <div className="Clear"></div>
              </button>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {history.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(item)}
                    className="w-full p-3 text-left rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <div className="text-sm text-gray-600">
                      {item.expression}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{item.result}</div>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EngineeringCalculator;
