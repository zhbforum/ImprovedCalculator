import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GraphFunction {
  expression: string;
  color: string;
  lineWidth: number;
  visible: boolean;
}

interface FunctionsListProps {
  functions: GraphFunction[];
  currentExpression: string;
  setCurrentExpression: (value: string) => void;
  handleAddFunction: () => void;
  handleRemoveFunction: (index: number) => void;
  handleUpdateColor: (index: number, color: string) => void;
  handleUpdateLineWidth: (index: number, lineWidth: number) => void;
  handleToggleVisibility: (index: number) => void;
  colors: { labelKey: string; value: string }[];
  lineWidths: { labelKey: string; value: number }[];
  showGrid: boolean;
  setShowGrid: (value: boolean) => void;
  showAxis: boolean;
  setShowAxis: (value: boolean) => void;
}

const FunctionsList = ({
  functions,
  currentExpression,
  setCurrentExpression,
  handleAddFunction,
  handleRemoveFunction,
  handleUpdateColor,
  handleUpdateLineWidth,
  handleToggleVisibility,
  colors,
  lineWidths,
  showGrid,
  setShowGrid,
  showAxis,
  setShowAxis,
}: FunctionsListProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            {t("graph.controls.showGrid")}
          </label>
          <Switch checked={showGrid} onCheckedChange={setShowGrid} />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            {t("graph.controls.showAxis")}
          </label>
          <Switch checked={showAxis} onCheckedChange={setShowAxis} />
        </div>
      </div>

      <div className="space-y-2">
        <Input
          value={currentExpression}
          onChange={(e) => setCurrentExpression(e.target.value)}
          placeholder={t("graph.controls.expressionPlaceholder")}
          className="flex-1"
        />
        <Button onClick={handleAddFunction} className="w-full">
          {t("graph.controls.addGraph")}
        </Button>
      </div>

      <div className="space-y-2">
        {functions.map((func, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span
                className="flex-1 truncate text-sm font-medium"
                title={func.expression}
              >
                {func.expression}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleToggleVisibility(index)}
                className="ml-2"
                aria-label={
                  func.visible
                    ? t("graph.controls.hideGraph")
                    : t("graph.controls.showGraph")
                }
                title={
                  func.visible
                    ? t("graph.controls.hideGraph")
                    : t("graph.controls.showGraph")
                }
              >
                {func.visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1"
                    style={{ color: func.color }}
                  >
                    {t("graph.controls.color")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {colors.map((color) => (
                    <DropdownMenuItem
                      key={color.value}
                      onClick={() => handleUpdateColor(index, color.value)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        {t(color.labelKey)}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    {t("graph.controls.thicknessValue", {
                      value: func.lineWidth,
                    })}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {lineWidths.map((width) => (
                    <DropdownMenuItem
                      key={width.value}
                      onClick={() => handleUpdateLineWidth(index, width.value)}
                    >
                      {t(width.labelKey)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveFunction(index)}
                aria-label={t("graph.controls.removeGraph")}
                title={t("graph.controls.removeGraph")}
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunctionsList;
