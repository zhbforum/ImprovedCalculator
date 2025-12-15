import React from "react";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import {
  ADVANCED_BUTTONS,
  BOTTOM_ROW,
  DIGIT_ROWS,
  TRIG_AND_LOG_BUTTONS,
  UI,
} from "../constants";

type Props = {
  isRadians: boolean;
  onToggleRadians: () => void;
  onDelete: () => void;
  onClear: () => void;
  onAppend: (value: string) => void;
  onFunctionClick: (func: string) => void;
  onCalculate: () => void;
};

export const Keypad = ({
  isRadians,
  onToggleRadians,
  onDelete,
  onClear,
  onAppend,
  onFunctionClick,
  onCalculate,
}: Props) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="outline"
          onClick={onToggleRadians}
          className={`col-span-2 ${UI.topBtnClass}`}
        >
          {isRadians ? "Radians" : "Degrees"}
        </Button>

        <Button variant="outline" onClick={onDelete} className="h-12">
          <Delete className="h-4 w-4" />
        </Button>

        <Button variant="outline" onClick={onClear} className={UI.topBtnClass}>
          C
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {TRIG_AND_LOG_BUTTONS.map((func) => (
          <Button
            key={func}
            variant="outline"
            onClick={() => onFunctionClick(func)}
            className={UI.keyBtnClass}
          >
            {func}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {ADVANCED_BUTTONS.map((op) => (
          <Button
            key={op}
            variant="outline"
            className={UI.keyBtnClass}
            onClick={() =>
              op === "√" || op === "x²" ? onFunctionClick(op) : onAppend(op)
            }
          >
            {op}
          </Button>
        ))}
      </div>

      {DIGIT_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-2">
          {row.map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className={UI.keyBtnClass}
              onClick={() => onAppend(btn)}
            >
              {btn}
            </Button>
          ))}
        </div>
      ))}

      <div className="grid grid-cols-4 gap-2">
        {BOTTOM_ROW.map((btn) => (
          <Button
            key={btn}
            className={UI.keyBtnClass}
            variant={btn === "=" ? "default" : "outline"}
            onClick={() => (btn === "=" ? onCalculate() : onAppend(btn))}
          >
            {btn}
          </Button>
        ))}
      </div>
    </div>
  );
};
