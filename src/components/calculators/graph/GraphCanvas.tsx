import { useEffect, useRef, useCallback, useState } from "react";
import { evaluate } from "mathjs";
import { useTheme } from "@/theme/useTheme";

interface GraphFunction {
  expression: string;
  color: string;
  lineWidth: number;
  visible: boolean;
}

interface GraphCanvasProps {
  functions: GraphFunction[];
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  showGrid: boolean;
  showAxis: boolean;
}

const getNiceStep = (scale: number) => {
  const minPixelStep = 80;
  const rawStep = minPixelStep / scale;
  if (rawStep <= 0 || !Number.isFinite(rawStep)) return 1;

  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / magnitude;

  let nice;
  if (residual <= 1) nice = 1;
  else if (residual <= 2) nice = 2;
  else if (residual <= 5) nice = 5;
  else nice = 10;

  return nice * magnitude;
};

const getThemeColor = (varName: string, fallback: string): string => {
  if (typeof window === "undefined") return fallback;
  const styles = getComputedStyle(document.documentElement);
  const raw = styles.getPropertyValue(varName).trim();
  return raw ? `hsl(${raw})` : fallback;
};

const formatTickLabel = (value: number, step: number) => {
  const absStep = Math.abs(step);
  if (absStep >= 10) return value.toFixed(0);
  if (absStep >= 1) return value.toFixed(0);
  if (absStep >= 0.1) return value.toFixed(1);
  if (absStep >= 0.01) return value.toFixed(2);
  return value.toFixed(3);
};

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  scale: number,
  offset: { x: number; y: number },
  showGrid: boolean,
  lineColor: string,
  labelColor: string
) => {
  if (!showGrid) return;

  const step = getNiceStep(scale);

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 0.5;
  ctx.font = "600 28px JetBrains Mono";
  ctx.textBaseline = "middle";

  const xStart = (-canvas.width / 2 - offset.x) / scale;
  const xEnd = (canvas.width / 2 - offset.x) / scale;
  const yStart = (-canvas.height / 2 + offset.y) / scale;
  const yEnd = (canvas.height / 2 + offset.y) / scale;

  const firstX = Math.ceil(xStart / step) * step;
  for (let value = firstX; value <= xEnd; value += step) {
    const x = canvas.width / 2 + value * scale + offset.x;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();

    ctx.fillStyle = labelColor;
    ctx.textAlign = "center";
    const label = formatTickLabel(value, step);
    ctx.fillText(label, x, canvas.height / 2 + offset.y + 40);
  }

  const firstY = Math.ceil(yStart / step) * step;
  for (let value = firstY; value <= yEnd; value += step) {
    const y = canvas.height / 2 - value * scale + offset.y;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();

    ctx.fillStyle = labelColor;
    ctx.textAlign = "right";
    const label = formatTickLabel(value, step);
    ctx.fillText(label, canvas.width / 2 + offset.x - 20, y + 6);
  }
};

const drawAxes = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  offset: { x: number; y: number },
  showAxis: boolean,
  axisColor: string,
  labelColor: string
) => {
  if (!showAxis) return;

  ctx.beginPath();
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 2;

  const yAxisPos = canvas.height / 2 + offset.y;
  ctx.moveTo(0, yAxisPos);
  ctx.lineTo(canvas.width, yAxisPos);
  ctx.stroke();

  const xAxisPos = canvas.width / 2 + offset.x;
  ctx.moveTo(xAxisPos, 0);
  ctx.lineTo(xAxisPos, canvas.height);
  ctx.stroke();

  ctx.fillStyle = labelColor;
  ctx.font = "700 32px JetBrains Mono";

  ctx.textAlign = "center";
  ctx.fillText("X", canvas.width - 30, yAxisPos + 50);

  ctx.textAlign = "right";
  ctx.fillText("Y", xAxisPos - 20, 40);
};

const GraphCanvas = ({
  functions,
  scale,
  setScale,
  showGrid,
  showAxis,
}: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const { theme } = useTheme();

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gridLineColor = getThemeColor("--muted-foreground", "#E5E7EB");
    const gridLabelColor = getThemeColor("--foreground", "#E5E7EB");
    const axisColor = getThemeColor("--accent-foreground", "#FBBF24");
    const axisLabelColor = getThemeColor("--foreground", "#F9FAFB");

    drawGrid(
      ctx,
      canvas,
      scale,
      offset,
      showGrid,
      gridLineColor,
      gridLabelColor
    );
    drawAxes(ctx, canvas, offset, showAxis, axisColor, axisLabelColor);

    functions.forEach((func) => {
      if (!func.visible) return;

      ctx.beginPath();
      ctx.strokeStyle = func.color;
      ctx.lineWidth = func.lineWidth;

      let lastY: number | null = null;
      const maxJump = scale * 10;

      for (let px = 0; px < canvas.width; px++) {
        const x = (px - canvas.width / 2 - offset.x) / scale;
        try {
          const y = evaluate(func.expression, { x });
          const py = canvas.height / 2 - y * scale + offset.y;

          if (Number.isFinite(y)) {
            if (lastY === null || Math.abs(py - lastY) < maxJump) {
              if (px === 0 || lastY === null) {
                ctx.moveTo(px, py);
              } else {
                ctx.lineTo(px, py);
              }
            } else {
              ctx.moveTo(px, py);
            }
            lastY = py;
          } else {
            lastY = null;
          }
        } catch {
          lastY = null;
        }
      }

      ctx.stroke();
    });
  }, [functions, scale, showGrid, showAxis, offset]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      setScale((prev) =>
        delta > 0 ? Math.max(10, prev / 1.1) : Math.min(9999, prev * 1.1)
      );
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [setScale]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border bg-card">
      <canvas
        ref={canvasRef}
        width={1600}
        height={1200}
        className="h-full w-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default GraphCanvas;
