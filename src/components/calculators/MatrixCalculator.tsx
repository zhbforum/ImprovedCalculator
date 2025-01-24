import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, RotateCcw, Hash, Trash2, Share2 } from "lucide-react";
import { toast } from "sonner";

type Matrix = number[][];

const MatrixCalculator = () => {
  const [matrixA, setMatrixA] = useState<string>("");
  const [matrixB, setMatrixB] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);
  const [showDecimals, setShowDecimals] = useState<boolean>(true);

  const parseMatrix = (input: string): Matrix | null => {
    try {
      const cleanInput = input.trim().replace(/\s+/g, " ");
      const rows = cleanInput
        .split(";")
        .map((row) => row.trim().split(" ").map(Number));
      const isValid =
        rows.every((row) => row.length === rows[0].length) &&
        !rows.flat().some(isNaN);
      return isValid ? rows : null;
    } catch (error) {
      return null;
    }
  };

  const formatMatrix = (matrix: Matrix): string => {
    return matrix
      .map((row) =>
        row
          .map((val) =>
            Number.isInteger(val) ? val.toString() : val.toFixed(2),
          )
          .join(" "),
      )
      .join(";\n");
  };

  const handleOperation = (operation: string) => {
    try {
      const mA = parseMatrix(matrixA);
      const mB =
        operation !== "transpose" && operation !== "determinant"
          ? parseMatrix(matrixB)
          : null;
      if (
        !mA ||
        (operation !== "transpose" && operation !== "determinant" && !mB)
      ) {
        toast.error("Invalid matrix format");
        return;
      }
      if (
        operation !== "transpose" &&
        operation !== "determinant" &&
        mA.length !== mB!.length
      ) {
        toast.error("Matrices must be the same size");
        return;
      }
      let resultMatrix: Matrix | number | undefined;
      switch (operation) {
        case "add":
          resultMatrix = mA.map((row, i) =>
            row.map((val, j) => val + (mB![i][j] || 0)),
          );
          break;
        case "subtract":
          resultMatrix = mA.map((row, i) =>
            row.map((val, j) => val - (mB![i][j] || 0)),
          );
          break;
        case "multiply":
          if (mA[0].length !== mB!.length) {
            toast.error(
              "The number of columns A must match the number of rows B",
            );
            return;
          }
          resultMatrix = mA.map((row, i) =>
            mB![0].map((_, j) =>
              row.reduce((sum, val, k) => sum + val * mB![k][j], 0),
            ),
          );
          break;
        case "transpose":
          resultMatrix = mA[0].map((_, colIndex) =>
            mA.map((row) => row[colIndex]),
          );
          break;
        case "determinant":
          if (mA.length !== mA[0].length) {
            toast.error(
              "The matrix must be square to calculate the determinant",
            );
            return;
          }
          resultMatrix = calculateDeterminant(mA);
          setResult(resultMatrix.toString());
          return;
        default:
          return;
      }
      if (resultMatrix) {
        setResult(formatMatrix(resultMatrix as Matrix));
      }
    } catch (error) {
      toast.error("Calculation error");
      console.error(error);
    }
  };

  const calculateDeterminant = (matrix: Matrix): number => {
    if (matrix.length === 1) return matrix[0][0];
    if (matrix.length === 2)
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    return matrix[0].reduce(
      (det, val, colIndex) =>
        det +
        val *
          Math.pow(-1, colIndex) *
          calculateDeterminant(
            matrix.slice(1).map((row) => row.filter((_, i) => i !== colIndex)),
          ),
      0,
    );
  };

  const generateEmptyMatrix = () => {
    return Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0).join(" "))
      .join(";\n");
  };

  const parseVector = (input: string): number[] | null => {
    try {
      const vector = input.trim().split(" ").map(Number);
      if (vector.some(isNaN)) return null;
      return vector;
    } catch (error) {
      return null;
    }
  };

  const formatVector = (vector: number[]): string => {
    return vector
      .map((val) => (Number.isInteger(val) ? val.toString() : val.toFixed(2)))
      .join(" ");
  };

  const solveGaussian = () => {
    const A = parseMatrix(matrixA);
    const B = parseVector(matrixB);
    if (!A || !B || A.length !== B.length) {
      toast.error("Incorrect data format or mismatched dimensions");
      return;
    }
    const solution = gaussianElimination(A, B);
    if (solution) {
      setResult(formatVector(solution));
    } else {
      toast.error("The system is inconsistent or has infinitely many solutions");
    }
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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow space-y-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="text-xl font-bold">Matrix A:</div>
            <Textarea
              value={matrixA}
              onChange={(e) => setMatrixA(e.target.value)}
              placeholder="Example: 1 2 3; 4 5 6; 7 8 9"
              className="font-mono bg-slate-700 border-slate-600 text-white"
              rows={5}
            />
          </div>
          <div className="space-y-4">
            <div className="text-xl font-bold">Matrix B:</div>
            <Textarea
              value={matrixB}
              onChange={(e) => setMatrixB(e.target.value)}
              placeholder="Example: 1 2 3"
              className="font-mono bg-slate-700 border-slate-600 text-white"
              rows={5}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button onClick={() => handleOperation("add")} className="bg-slate-700 hover:bg-slate-600">
            A + B
          </Button>
          <Button onClick={() => handleOperation("subtract")} className="bg-slate-700 hover:bg-slate-600">
            A - B
          </Button>
          <Button onClick={() => handleOperation("multiply")} className="bg-slate-700 hover:bg-slate-600">
            A × B
          </Button>
          <Button onClick={() => handleOperation("transpose")} className="bg-slate-700 hover:bg-slate-600">
            Transpose
          </Button>
          <Button onClick={() => handleOperation("determinant")} className="bg-slate-700 hover:bg-slate-600">
            Determinant
          </Button>
          <Button onClick={solveGaussian} className="bg-slate-700 hover:bg-slate-600">
            Solve (Gaussian)
          </Button>
        </div>
        <div className="space-y-4">
          <div className="text-xl font-bold">Result:</div>
          <Textarea
            value={result}
            readOnly
            className="font-mono bg-slate-700 border-slate-600 text-white"
            rows={5}
          />
        </div>
      </div>
    </div>
  );
};

export default MatrixCalculator;