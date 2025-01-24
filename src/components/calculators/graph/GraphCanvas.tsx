import { useEffect, useRef, useCallback, useState } from "react";
import { evaluate } from "mathjs";

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

const GraphCanvas = ({ functions, scale, setScale, showGrid, showAxis }: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const getGridStep = (scale: number) => {
    let step = 1;
    if (scale < 25) step = Math.ceil(25 / scale);
    if (scale < 15) step = Math.ceil(50 / scale);
    if (scale < 10) step = Math.ceil(100 / scale);
    return step;
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!showGrid) return;

    const gridStep = getGridStep(scale);
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 0.5;
    ctx.font = "bold 14px JetBrains Mono";
    ctx.textBaseline = "middle";

    const xStart = Math.floor((-canvas.width / 2 - offset.x) / scale);
    const xEnd = Math.ceil((canvas.width / 2 - offset.x) / scale);
    const yStart = Math.floor((-canvas.height / 2 + offset.y) / scale);
    const yEnd = Math.ceil((canvas.height / 2 + offset.y) / scale);

    for (let i = xStart; i <= xEnd; i++) {
      if (i % gridStep !== 0) continue;
      const x = canvas.width / 2 + (i * scale) + offset.x;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();

      ctx.fillStyle = "#1F2937";
      ctx.textAlign = "center";
      ctx.fillText(i.toString(), x, canvas.height / 2 + offset.y + 20);
    }

    for (let i = yStart; i <= yEnd; i++) {
      if (i % gridStep !== 0) continue;
      const y = canvas.height / 2 - (i * scale) + offset.y;

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();

      ctx.fillStyle = "#1F2937";
      ctx.textAlign = "right";
      ctx.fillText(i.toString(), canvas.width / 2 + offset.x - 10, y + 5);
    }
  };

  const drawAxes = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!showAxis) return;

    ctx.beginPath();
    ctx.strokeStyle = "#4B5563";
    ctx.lineWidth = 1.5;

    const yAxisPos = canvas.height / 2 + offset.y;
    ctx.moveTo(0, yAxisPos);
    ctx.lineTo(canvas.width, yAxisPos);
    ctx.stroke();

    const xAxisPos = canvas.width / 2 + offset.x;
    ctx.moveTo(xAxisPos, 0);
    ctx.lineTo(xAxisPos, canvas.height);
    ctx.stroke();

    ctx.fillStyle = "#1F2937";
    ctx.textAlign = "center";
    ctx.fillText("X", canvas.width - 10, yAxisPos + 20);
    ctx.textAlign = "right";
    ctx.fillText("Y", xAxisPos - 10, 20);
  };

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (showGrid) drawGrid(ctx, canvas);
    if (showAxis) drawAxes(ctx, canvas);

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
        } catch (error) {
          console.error("Error evaluating expression:", error);
          lastY = null;
        }
      }
      ctx.stroke();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functions, scale, showGrid, showAxis, offset]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY;
    setScale((prevScale) => {
      if (delta > 0) {
        return Math.max(10, prevScale / 1.1);
      } else {
        return Math.min(9999, prevScale * 1.1);
      }
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const newOffset = {
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    };
    
    setOffset(newOffset);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative aspect-video w-full border rounded-lg overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default GraphCanvas;