import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import FunctionsList from "./graph/FunctionsList";
import GraphCanvas from "./graph/GraphCanvas";

interface GraphFunction {
  expression: string;
  color: string;
  lineWidth: number;
  visible: boolean;
}

const GraphCalculator = () => {
  const { t } = useTranslation();
  const [functions, setFunctions] = useState<GraphFunction[]>([
    { expression: "x^2", color: "#2563eb", lineWidth: 2, visible: true },
  ]);
  const [currentExpression, setCurrentExpression] = useState("");
  const [scale, setScale] = useState(50);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxis, setShowAxis] = useState(true);

  const colors = [
    { labelKey: "graph.colors.blue", value: "#2563eb" },
    { labelKey: "graph.colors.red", value: "#dc2626" },
    { labelKey: "graph.colors.green", value: "#16a34a" },
    { labelKey: "graph.colors.purple", value: "#9333ea" },
    { labelKey: "graph.colors.orange", value: "#ea580c" },
  ];

  const lineWidths = [
    { labelKey: "graph.lineWidths.thin", value: 1 },
    { labelKey: "graph.lineWidths.medium", value: 2 },
    { labelKey: "graph.lineWidths.thick", value: 3 },
    { labelKey: "graph.lineWidths.veryThick", value: 4 },
  ];

  const handleAddFunction = () => {
    if (!currentExpression) return;

    setFunctions([
      ...functions,
      {
        expression: currentExpression,
        color: colors[functions.length % colors.length].value,
        lineWidth: 2,
        visible: true,
      },
    ]);
    setCurrentExpression("");
  };

  const handleRemoveFunction = (index: number) => {
    setFunctions(functions.filter((_, i) => i !== index));
  };

  const handleUpdateColor = (index: number, color: string) => {
    const newFunctions = [...functions];
    newFunctions[index] = { ...newFunctions[index], color };
    setFunctions(newFunctions);
  };

  const handleUpdateLineWidth = (index: number, lineWidth: number) => {
    const newFunctions = [...functions];
    newFunctions[index] = { ...newFunctions[index], lineWidth };
    setFunctions(newFunctions);
  };

  const handleToggleVisibility = (index: number) => {
    const newFunctions = [...functions];
    newFunctions[index] = {
      ...newFunctions[index],
      visible: !newFunctions[index].visible,
    };
    setFunctions(newFunctions);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-6xl mx-auto p-8 shadow-xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t("graph.page.title")}
            </h1>
            <p className="text-sm text-gray-500">
              {t("graph.page.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FunctionsList
                functions={functions}
                currentExpression={currentExpression}
                setCurrentExpression={setCurrentExpression}
                handleAddFunction={handleAddFunction}
                handleRemoveFunction={handleRemoveFunction}
                handleUpdateColor={handleUpdateColor}
                handleUpdateLineWidth={handleUpdateLineWidth}
                handleToggleVisibility={handleToggleVisibility}
                colors={colors}
                lineWidths={lineWidths}
                showGrid={showGrid}
                setShowGrid={setShowGrid}
                showAxis={showAxis}
                setShowAxis={setShowAxis}
              />
            </div>

            <div className="lg:col-span-3">
              <GraphCanvas
                functions={functions}
                scale={scale}
                setScale={setScale}
                showGrid={showGrid}
                showAxis={showAxis}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GraphCalculator;
