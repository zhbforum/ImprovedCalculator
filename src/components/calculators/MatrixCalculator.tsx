import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Minus,
  X,
  RotateCcw,
  Hash,
  Trash2,
  Share2,
  History as HistoryIcon,
} from "lucide-react";
import { toast } from "sonner";
import i18n from "@/i18n";

type Matrix = number[][];
type OperationKey =
  | "add"
  | "subtract"
  | "multiply"
  | "transpose"
  | "determinant"
  | "solveGaussian";

type ResultData =
  | { kind: "matrix"; value: Matrix }
  | { kind: "vector"; value: number[] }
  | { kind: "scalar"; value: number };

type InputMode = "text" | "cells";

type HistoryEntry = {
  id: number;
  operationKey: OperationKey;
  matrixA: Matrix;
  matrixB?: Matrix;
  result: ResultData;
};

const stepT = (key: string, options?: Record<string, unknown>) =>
  i18n.t(key, options);

function createEmptyCells(rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => "")
  );
}

function resizeCells(prev: string[][], rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => prev[i]?.[j] ?? "")
  );
}

const MatrixCalculator = () => {
  const { t } = useTranslation();
  const [matrixA, setMatrixA] = useState<string>("");
  const [matrixB, setMatrixB] = useState<string>("");
  const [rawResult, setRawResult] = useState<ResultData | null>(null);
  const [details, setDetails] = useState<string>("");
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);
  const [showDecimals, setShowDecimals] = useState<boolean>(true);
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [matrixACells, setMatrixACells] = useState<string[][]>(() =>
    createEmptyCells(3, 3)
  );
  const [matrixBCells, setMatrixBCells] = useState<string[][]>(() =>
    createEmptyCells(3, 3)
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (inputMode === "cells") {
      setMatrixACells((prev) => resizeCells(prev, rows, cols));
      setMatrixBCells((prev) => resizeCells(prev, rows, cols));
    }
  }, [rows, cols, inputMode]);

  const formatNumber = (val: number): string => {
    if (showDecimals && !Number.isInteger(val)) {
      return val.toFixed(2);
    }
    return val.toString();
  };

  const parseMatrixText = (input: string): Matrix | null => {
    try {
      const trimmed = input.trim();
      if (!trimmed) return null;

      const normalized = trimmed.replace(/\r/g, "");
      const rowStrings = normalized
        .split(/[\n;]+/)
        .map((row) => row.trim())
        .filter(Boolean);

      if (rowStrings.length === 0) return null;

      const rows = rowStrings.map((row) =>
        row.split(/\s+/).map((value) => Number(value))
      );

      const isValid =
        rows.length > 0 &&
        rows.every((row) => row.length === rows[0].length) &&
        !rows.flat().some((v) => Number.isNaN(v));

      return isValid ? rows : null;
    } catch {
      return null;
    }
  };

  const parseMatrixFromCells = (cells: string[][]): Matrix | null => {
    if (!cells.length || !cells[0].length) return null;

    const matrix = cells.map((row) =>
      row.map((value) => {
        const v = value.trim();
        if (!v) return 0;
        const n = Number(v);
        return Number.isNaN(n) ? NaN : n;
      })
    );

    if (matrix.flat().some((v) => Number.isNaN(v))) return null;
    return matrix;
  };

  const parseVectorText = (input: string): number[] | null => {
    try {
      const clean = input.trim().replace(/\s+/g, " ");
      if (!clean) return null;
      const vector = clean.split(" ").map(Number);
      if (vector.some((v) => Number.isNaN(v))) return null;
      return vector;
    } catch {
      return null;
    }
  };

  const parseVectorFromCells = (cells: string[][]): number[] | null => {
    if (!cells.length) return null;
    return cells.map((row) => {
      const v = (row[0] ?? "").trim();
      if (!v) return 0;
      const n = Number(v);
      return Number.isNaN(n) ? NaN : n;
    });
  };

  const formatMatrix = (matrix: Matrix): string =>
    matrix.map((row) => row.map(formatNumber).join(" ")).join(";\n");

  const formatVector = (vector: number[]): string =>
    vector.map(formatNumber).join(" ");

  const generateEmptyMatrixTemplate = (r: number, c: number): string => {
    const clamp = (n: number, min: number, max: number) =>
      Math.max(min, Math.min(max, n));

    const rr = clamp(r, 1, 8);
    const cc = clamp(c, 1, 8);

    return Array.from({ length: rr }, () =>
      Array.from({ length: cc }, () => "0").join(" ")
    ).join(";\n");
  };

  const calculateDeterminant = (matrix: Matrix): number => {
    if (matrix.length === 1) return matrix[0][0];
    if (matrix.length === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    return matrix[0].reduce(
      (det, val, colIndex) =>
        det +
        val *
          Math.pow(-1, colIndex) *
          calculateDeterminant(
            matrix.slice(1).map((row) => row.filter((_, i) => i !== colIndex))
          ),
      0
    );
  };

  const calculateDeterminantWithSteps = (
    matrix: Matrix
  ): { det: number; steps: string } => {
    const n = matrix.length;

    if (n === 1) {
      const a = matrix[0][0];
      return {
        det: a,
        steps: `det([${a}]) = ${a}`,
      };
    }

    if (n === 2) {
      const [[a, b], [c, d]] = matrix;
      const det = a * d - b * c;
      const steps = [
        stepT("matrix.details.det2x2Title"),
        `|a  b|   |${a}  ${b}|`,
        `|c  d| = |${c}  ${d}|`,
        "",
        "det(A) = a·d − b·c",
        `       = ${a}·${d} − ${b}·${c}`,
        `       = ${a * d} − ${b * c}`,
        `       = ${det}`,
      ].join("\n");
      return { det, steps };
    }

    if (n === 3) {
      const [[a, b, c], [d, e, f], [g, h, i]] = matrix;

      const p1 = a * e * i;
      const p2 = b * f * g;
      const p3 = c * d * h;

      const n1 = g * e * c;
      const n2 = h * f * a;
      const n3 = i * d * b;

      const sumPos = p1 + p2 + p3;
      const sumNeg = n1 + n2 + n3;
      const det = sumPos - sumNeg;

      const steps = [
        stepT("matrix.details.det3x3Title"),
        "",
        "      |a₁₁  a₁₂  a₁₃|",
        "A  =  |a₂₁  a₂₂  a₂₃|",
        "      |a₃₁  a₃₂  a₃₃|",
        "",
        "det(A) = a₁₁a₂₂a₃₃ + a₁₂a₂₃a₃₁ + a₁₃a₂₁a₃₂",
        "       − a₃₁a₂₂a₁₃ − a₃₂a₂₃a₁₁ − a₃₃a₂₁a₁₂",
        "",
        stepT("matrix.details.numericSubstitution"),
        `      |${a}  ${b}  ${c}|`,
        `A  =  |${d}  ${e}  ${f}|`,
        `      |${g}  ${h}  ${i}|`,
        "",
        "det(A) = " +
          `${a}·${e}·${i} + ${b}·${f}·${g} + ${c}·${d}·${h} ` +
          `− ${g}·${e}·${c} − ${h}·${f}·${a} − ${i}·${d}·${b}`,
        "",
        `       = ${p1} + ${p2} + ${p3} − ${n1} − ${n2} − ${n3}`,
        `       = ${sumPos} − ${sumNeg}`,
        `       = ${det}`,
      ].join("\n");

      return { det, steps };
    }

    const det = calculateDeterminant(matrix);
    const steps =
      `${stepT("matrix.details.limitedExplanation")}\n` +
      `det(A) (computed recursively) = ${det}`;
    return { det, steps };
  };

  const gaussianElimination = (A: Matrix, B: number[]): number[] | null => {
    const n = A.length;
    const augmented = A.map((row, i) => [...row, B[i]]);

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

      if (augmented[i][i] === 0) return null;

      for (let k = i + 1; k < n; k++) {
        const factor = augmented[k][i] / augmented[i][i];
        for (let j = i; j <= n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }

    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      x[i] = augmented[i][n] / augmented[i][i];
      for (let k = i - 1; k >= 0; k--) {
        augmented[k][n] -= augmented[k][i] * x[i];
      }
    }
    return x;
  };

  const addHistoryEntry = (
    operationKey: OperationKey,
    A: Matrix,
    B: Matrix | undefined,
    result: ResultData
  ) => {
    setHistory((prev) => [
      {
        id: Date.now() + Math.random(),
        operationKey,
        matrixA: A,
        matrixB: B,
        result,
      },
      ...prev,
    ]);
  };

  const handleOperation = (
    operation: Exclude<OperationKey, "solveGaussian">
  ) => {
    setDetails("");

    const mA =
      inputMode === "text"
        ? parseMatrixText(matrixA)
        : parseMatrixFromCells(matrixACells);

    const needsB =
      operation === "add" ||
      operation === "subtract" ||
      operation === "multiply";

    const mB =
      needsB &&
      (inputMode === "text"
        ? parseMatrixText(matrixB)
        : parseMatrixFromCells(matrixBCells));

    if (!mA || (needsB && !mB)) {
      toast.error(t("matrix.toasts.invalidMatrixFormat"));
      return;
    }

    if (needsB) {
      const sameSize =
        mA.length === mB!.length && mA[0].length === mB![0].length;

      if ((operation === "add" || operation === "subtract") && !sameSize) {
        toast.error(t("matrix.toasts.sameDimensionsRequired"));
        return;
      }
    }

    try {
      switch (operation) {
        case "add": {
          const resultMatrix = mA.map((row, i) =>
            row.map((val, j) => val + (mB![i][j] ?? 0))
          );
          const resultData: ResultData = {
            kind: "matrix",
            value: resultMatrix,
          };
          setRawResult(resultData);
          addHistoryEntry("add", mA, mB || undefined, resultData);
          break;
        }
        case "subtract": {
          const resultMatrix = mA.map((row, i) =>
            row.map((val, j) => val - (mB![i][j] ?? 0))
          );
          const resultData: ResultData = {
            kind: "matrix",
            value: resultMatrix,
          };
          setRawResult(resultData);
          addHistoryEntry("subtract", mA, mB || undefined, resultData);
          break;
        }
        case "multiply": {
          if (mA[0].length !== mB!.length) {
            toast.error(t("matrix.toasts.multiplyDimensionsRequired"));
            return;
          }
          const resultMatrix = mA.map((row) =>
            mB![0].map((_, j) =>
              row.reduce((sum, val, k) => sum + val * mB![k][j], 0)
            )
          );
          const resultData: ResultData = {
            kind: "matrix",
            value: resultMatrix,
          };
          setRawResult(resultData);
          addHistoryEntry("multiply", mA, mB || undefined, resultData);
          break;
        }
        case "transpose": {
          const transposed = mA[0].map((_, colIndex) =>
            mA.map((row) => row[colIndex])
          );
          const resultData: ResultData = {
            kind: "matrix",
            value: transposed,
          };
          setRawResult(resultData);
          addHistoryEntry("transpose", mA, undefined, resultData);
          break;
        }
        case "determinant": {
          if (mA.length !== mA[0].length) {
            toast.error(t("matrix.toasts.squareRequired"));
            return;
          }
          const { det, steps } = calculateDeterminantWithSteps(mA);
          const resultData: ResultData = { kind: "scalar", value: det };
          setRawResult(resultData);
          setDetails(steps);
          addHistoryEntry("determinant", mA, undefined, resultData);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(t("matrix.toasts.calculationError"));
    }
  };

  const solveGaussian = () => {
    setDetails("");

    const A =
      inputMode === "text"
        ? parseMatrixText(matrixA)
        : parseMatrixFromCells(matrixACells);

    const B =
      inputMode === "text"
        ? parseVectorText(matrixB)
        : parseVectorFromCells(matrixBCells);

    if (!A || !B || A.length !== B.length) {
      toast.error(t("matrix.toasts.invalidSystem"));
      return;
    }

    if (B.some((v) => Number.isNaN(v))) {
      toast.error(t("matrix.toasts.invalidVector"));
      return;
    }

    const solution = gaussianElimination(A, B);
    if (!solution) {
      toast.error(t("matrix.toasts.inconsistentSystem"));
      return;
    }

    const resultData: ResultData = { kind: "vector", value: solution };
    setRawResult(resultData);

    const bAsMatrix: Matrix = B.map((v) => [v]);
    addHistoryEntry("solveGaussian", A, bAsMatrix, resultData);
  };

  const handleGenerateTemplate = () => {
    if (inputMode === "text") {
      const template = generateEmptyMatrixTemplate(rows, cols);
      setMatrixA(template);
      setMatrixB(template);
    } else {
      setMatrixACells(createEmptyCells(rows, cols));
      setMatrixBCells(createEmptyCells(rows, cols));
    }
  };

  const handleClearAll = () => {
    setMatrixA("");
    setMatrixB("");
    setMatrixACells(createEmptyCells(rows, cols));
    setMatrixBCells(createEmptyCells(rows, cols));
    setRawResult(null);
    setDetails("");
  };

  const handleCopyResult = async () => {
    const formattedResult =
      rawResult?.kind === "matrix"
        ? formatMatrix(rawResult.value)
        : rawResult?.kind === "vector"
        ? formatVector(rawResult.value)
        : rawResult?.kind === "scalar"
        ? formatNumber(rawResult.value)
        : "";

    if (!formattedResult) {
      toast.error(t("matrix.toasts.nothingToCopy"));
      return;
    }
    try {
      await navigator.clipboard.writeText(formattedResult);
      toast.success(t("matrix.toasts.copied"));
    } catch {
      toast.error(t("matrix.toasts.copyFailed"));
    }
  };

  const formattedResult =
    rawResult?.kind === "matrix"
      ? formatMatrix(rawResult.value)
      : rawResult?.kind === "vector"
      ? formatVector(rawResult.value)
      : rawResult?.kind === "scalar"
      ? formatNumber(rawResult.value)
      : "";

  const handleModeChange = (mode: InputMode) => {
    if (mode === inputMode) return;

    if (mode === "cells") {
      const mA = parseMatrixText(matrixA);
      const mB = parseMatrixText(matrixB);

      if (mA) {
        setRows(mA.length);
        setCols(mA[0].length);
        setMatrixACells(
          mA.map((row) => row.map((v) => (Number.isFinite(v) ? `${v}` : "")))
        );
      } else {
        setMatrixACells(createEmptyCells(rows, cols));
      }

      if (mB) {
        setMatrixBCells(
          mB.map((row) => row.map((v) => (Number.isFinite(v) ? `${v}` : "")))
        );
      } else {
        setMatrixBCells(createEmptyCells(rows, cols));
      }
    } else {
      const mA = parseMatrixFromCells(matrixACells);
      const mB = parseMatrixFromCells(matrixBCells);

      if (mA) {
        setMatrixA(formatMatrix(mA));
      }
      if (mB) {
        setMatrixB(formatMatrix(mB));
      }
    }

    setInputMode(mode);
  };

  const renderCells = (which: "A" | "B") => {
    const cells = which === "A" ? matrixACells : matrixBCells;
    const setCells = which === "A" ? setMatrixACells : setMatrixBCells;

    return (
      <div className="overflow-x-auto">
        <div className="inline-flex items-stretch gap-2 rounded-md border bg-muted/10 px-3 py-2">
          <div className="flex flex-col justify-between">
            <div className="h-3 w-[2px] rounded-full bg-foreground" />
            <div className="flex-1 w-[2px] bg-foreground" />
            <div className="h-3 w-[2px] rounded-full bg-foreground" />
          </div>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(2.5rem, 1fr))`,
            }}
          >
            {cells.map((row, i) =>
              row.map((value, j) => (
                <Input
                  key={`${which}-${i}-${j}`}
                  className="h-8 w-16 px-1 text-center text-sm font-mono"
                  value={value}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCells((prev) => {
                      const next = prev.map((r) => [...r]);
                      next[i][j] = val;
                      return next;
                    });
                  }}
                />
              ))
            )}
          </div>
          <div className="flex flex-col justify-between">
            <div className="h-3 w-[2px] rounded-full bg-foreground" />
            <div className="flex-1 w-[2px] bg-foreground" />
            <div className="h-3 w-[2px] rounded-full bg-foreground" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("matrix.page.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("matrix.page.description")}{" "}
            <code className="font-mono">1 2 3; 4 5 6; 7 8 9</code>
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 text-sm md:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <Label htmlFor="rows">{t("matrix.inputs.rows")}</Label>
            <Input
              id="rows"
              type="number"
              className="h-8 w-16"
              min={1}
              max={8}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value) || 1)}
            />
            <Label htmlFor="cols">{t("matrix.inputs.cols")}</Label>
            <Input
              id="cols"
              type="number"
              className="h-8 w-16"
              min={1}
              max={8}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value) || 1)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateTemplate}
            >
              {t("matrix.inputs.fillTemplate")}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex overflow-hidden rounded-md border text-xs">
              <button
                type="button"
                onClick={() => handleModeChange("text")}
                className={`px-3 py-1 ${
                  inputMode === "text"
                    ? "bg-background font-medium"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t("matrix.inputs.textMode")}
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("cells")}
                className={`px-3 py-1 ${
                  inputMode === "cells"
                    ? "bg-background font-medium"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t("matrix.inputs.cellsMode")}
              </button>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={showDecimals}
                onChange={(e) => setShowDecimals(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-background"
              />
              {t("matrix.inputs.showDecimals")}
            </label>
          </div>
        </div>
      </div>

      <Card className="space-y-6 p-4">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-semibold">{t("matrix.inputs.matrixA")}</div>
            {inputMode === "text" ? (
              <Textarea
                value={matrixA}
                onChange={(e) => setMatrixA(e.target.value)}
                placeholder={t("matrix.inputs.matrixTextPlaceholder")}
                className="min-h-[140px] font-mono"
              />
            ) : (
              renderCells("A")
            )}
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">{t("matrix.inputs.matrixB")}</div>
            {inputMode === "text" ? (
              <Textarea
                value={matrixB}
                onChange={(e) => setMatrixB(e.target.value)}
                placeholder={t("matrix.inputs.vectorPlaceholder")}
                className="min-h-[140px] font-mono"
              />
            ) : (
              renderCells("B")
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Button onClick={() => handleOperation("add")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("matrix.actions.add")}
          </Button>
          <Button onClick={() => handleOperation("subtract")}>
            <Minus className="mr-2 h-4 w-4" />
            {t("matrix.actions.subtract")}
          </Button>
          <Button onClick={() => handleOperation("multiply")}>
            <X className="mr-2 h-4 w-4" />
            {t("matrix.actions.multiply")}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOperation("transpose")}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("matrix.actions.transpose")}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOperation("determinant")}
          >
            <Hash className="mr-2 h-4 w-4" />
            {t("matrix.actions.determinant")}
          </Button>
          <Button variant="outline" onClick={solveGaussian}>
            {t("matrix.actions.solveGaussian")}
          </Button>
          <Button
            variant="ghost"
            onClick={handleCopyResult}
            className="col-span-1 justify-start md:col-span-2 md:justify-center"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {t("matrix.actions.copyResult")}
          </Button>
          <Button
            variant="ghost"
            onClick={handleClearAll}
            className="col-span-1 justify-start text-destructive md:col-span-2 md:justify-center"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("matrix.actions.clearAll")}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-semibold">{t("matrix.result.title")}</div>
          <Textarea
            value={formattedResult}
            readOnly
            className="min-h-[140px] font-mono"
            placeholder={t("matrix.result.placeholder")}
          />
        </div>

        {details && (
          <div className="space-y-2">
            <details className="rounded-md border bg-muted/40 p-3">
              <summary className="cursor-pointer text-sm font-medium">
                {t("matrix.details.summary")}
              </summary>
              <ScrollArea className="mt-3 max-h-[360px] rounded-md border bg-card p-3">
                <pre className="whitespace-pre text-sm font-mono">
                  {details}
                </pre>
              </ScrollArea>
            </details>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <HistoryIcon className="h-4 w-4" />
                {t("matrix.history.title")}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setHistory([])}
              >
                {t("matrix.history.clear")}
              </Button>
            </div>

            <ScrollArea className="max-h-[260px] rounded-md border bg-muted/40 p-3">
              <div className="space-y-3">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-md bg-card p-3 text-xs font-mono"
                  >
                    <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                      {t(`matrix.actions.${entry.operationKey}`)}
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <div className="mb-1 text-[0.7rem] font-semibold text-muted-foreground">
                          {t("matrix.history.matrixA")}
                        </div>
                        <pre className="whitespace-pre-wrap">
                          {formatMatrix(entry.matrixA)}
                        </pre>
                      </div>
                      {entry.matrixB && (
                        <div>
                          <div className="mb-1 text-[0.7rem] font-semibold text-muted-foreground">
                            {t("matrix.history.matrixB")}
                          </div>
                          <pre className="whitespace-pre-wrap">
                            {formatMatrix(entry.matrixB)}
                          </pre>
                        </div>
                      )}
                      <div>
                        <div className="mb-1 text-[0.7rem] font-semibold text-muted-foreground">
                          {t("matrix.history.result")}
                        </div>
                        <pre className="whitespace-pre-wrap">
                          {entry.result.kind === "matrix"
                            ? formatMatrix(entry.result.value)
                            : entry.result.kind === "vector"
                            ? formatVector(entry.result.value)
                            : formatNumber(entry.result.value)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MatrixCalculator;
