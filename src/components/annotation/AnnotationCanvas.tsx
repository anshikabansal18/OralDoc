import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Circle, Square, Move, Save, Palette, Eraser, Undo } from "lucide-react";

interface Annotation {
  id: string;
  type: "rectangle" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
}

interface AnnotationCanvasProps {
  imageUrl: string;
  imageName: string;
  onSave: (annotations: Annotation[], annotatedImageUrl: string) => void;
}

const annotationLabels = [
  { value: "inflammation", label: "Inflamed Gums", color: "#ef4444" },
  { value: "cavity", label: "Cavity", color: "#f97316" },
  { value: "misalignment", label: "Misalignment", color: "#8b5cf6" },
  { value: "plaque", label: "Plaque Buildup", color: "#eab308" },
  { value: "healthy", label: "Healthy Area", color: "#16a34a" },
  { value: "attention", label: "Needs Attention", color: "#dc2626" },
];

export function AnnotationCanvas({ imageUrl, imageName, onSave }: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [annotationHistory, setAnnotationHistory] = useState<Annotation[][]>([]);
  const [selectedTool, setSelectedTool] = useState<"select" | "rectangle" | "circle" | "eraser">("select");
  const [selectedLabel, setSelectedLabel] = useState(annotationLabels[0].value);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [draggedAnnotation, setDraggedAnnotation] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [currentDrawing, setCurrentDrawing] = useState<Annotation | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      drawCanvas(ctx, img);
    };
    img.src = imageUrl;
  }, [imageUrl, annotations, currentDrawing]);

  const drawCanvas = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0);

    // Draw saved annotations
    annotations.forEach((annotation) => {
      drawAnnotation(ctx, annotation);
    });

    // Draw current drawing annotation
    if (currentDrawing && isDrawing) {
      drawAnnotation(ctx, currentDrawing);
    }
  };

  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    const labelData = annotationLabels.find(l => l.value === annotation.label) || annotationLabels[0];
    
    ctx.strokeStyle = labelData.color;
    ctx.fillStyle = labelData.color + "40"; // Semi-transparent fill
    ctx.lineWidth = 3;

    if (annotation.type === "rectangle") {
      ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
      ctx.fillRect(annotation.x, annotation.y, annotation.width, annotation.height);
    } else if (annotation.type === "circle") {
      const centerX = annotation.x + annotation.width / 2;
      const centerY = annotation.y + annotation.height / 2;
      const radius = Math.min(annotation.width, annotation.height) / 2;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }

    // Draw label
    ctx.fillStyle = labelData.color;
    ctx.font = "12px Arial";
    ctx.fillText(
      labelData.label,
      annotation.x,
      annotation.y - 5
    );
  };

  const saveToHistory = () => {
    setAnnotationHistory(prev => [...prev, [...annotations]]);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === "select") {
      // Check if clicking on existing annotation
      const clickedAnnotation = annotations.find(annotation => {
        return x >= annotation.x && x <= annotation.x + annotation.width &&
               y >= annotation.y && y <= annotation.y + annotation.height;
      });

      if (clickedAnnotation) {
        setDraggedAnnotation(clickedAnnotation.id);
        setDragOffset({
          x: x - clickedAnnotation.x,
          y: y - clickedAnnotation.y
        });
        setIsDragging(true);
      }
    } else if (selectedTool === "eraser") {
      // Erase annotation
      const clickedAnnotation = annotations.find(annotation => {
        return x >= annotation.x && x <= annotation.x + annotation.width &&
               y >= annotation.y && y <= annotation.y + annotation.height;
      });

      if (clickedAnnotation) {
        saveToHistory();
        setAnnotations(prev => prev.filter(a => a.id !== clickedAnnotation.id));
        toast({
          title: "Annotation Erased",
          description: "Annotation has been removed",
        });
      }
    } else if (selectedTool === "rectangle" || selectedTool === "circle") {
      // Start drawing
      saveToHistory();
      setIsDrawing(true);
      setDrawStart({ x, y });
      
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: selectedTool,
        x,
        y,
        width: 0,
        height: 0,
        color: annotationLabels.find(l => l.value === selectedLabel)?.color || "#ef4444",
        label: selectedLabel,
      };
      
      setCurrentDrawing(newAnnotation);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && draggedAnnotation) {
      // Move existing annotation
      setAnnotations(prev => prev.map(annotation => {
        if (annotation.id === draggedAnnotation) {
          return {
            ...annotation,
            x: x - dragOffset.x,
            y: y - dragOffset.y,
          };
        }
        return annotation;
      }));
    } else if (isDrawing && currentDrawing) {
      // Update drawing annotation
      const width = Math.abs(x - drawStart.x);
      const height = Math.abs(y - drawStart.y);
      const newX = Math.min(x, drawStart.x);
      const newY = Math.min(y, drawStart.y);

      setCurrentDrawing({
        ...currentDrawing,
        x: newX,
        y: newY,
        width,
        height,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentDrawing) {
      // Finish drawing
      if (currentDrawing.width > 5 && currentDrawing.height > 5) {
        setAnnotations(prev => [...prev, currentDrawing]);
        toast({
          title: "Annotation Added",
          description: `${selectedLabel} annotation created`,
        });
      }
      setIsDrawing(false);
      setCurrentDrawing(null);
    }
    
    setIsDragging(false);
    setDraggedAnnotation(null);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get annotated image as data URL
    const annotatedImageUrl = canvas.toDataURL('image/png');
    
    onSave(annotations, annotatedImageUrl);
    toast({
      title: "Annotations Saved",
      description: `${annotations.length} annotations saved for ${imageName}`,
    });
  };

  const handleUndo = () => {
    if (annotationHistory.length > 0) {
      const previousState = annotationHistory[annotationHistory.length - 1];
      setAnnotations(previousState);
      setAnnotationHistory(prev => prev.slice(0, -1));
      toast({
        title: "Undone",
        description: "Last action has been undone",
      });
    }
  };

  const clearAnnotations = () => {
    saveToHistory();
    setAnnotations([]);
    toast({
      title: "Annotations Cleared",
      description: "All annotations have been removed",
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center bg-card p-4 rounded-lg border">
        <div className="flex gap-2">
          <Button
            variant={selectedTool === "select" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("select")}
          >
            <Move className="w-4 h-4 mr-2" />
            Select
          </Button>
          <Button
            variant={selectedTool === "rectangle" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("rectangle")}
          >
            <Square className="w-4 h-4 mr-2" />
            Rectangle
          </Button>
          <Button
            variant={selectedTool === "circle" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("circle")}
          >
            <Circle className="w-4 h-4 mr-2" />
            Circle
          </Button>
          <Button
            variant={selectedTool === "eraser" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTool("eraser")}
          >
            <Eraser className="w-4 h-4 mr-2" />
            Eraser
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <Select value={selectedLabel} onValueChange={setSelectedLabel}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {annotationLabels.map((label) => (
                <SelectItem key={label.value} value={label.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    {label.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUndo}
            disabled={annotationHistory.length === 0}
          >
            <Undo className="w-4 h-4 mr-2" />
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={clearAnnotations}>
            Clear All
          </Button>
          <Button className="btn-medical" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Annotations
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="medical-card">
        <h3 className="text-lg font-semibold mb-4">{imageName}</h3>
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className={`max-w-full h-auto ${
              selectedTool === "select" ? "cursor-move" :
              selectedTool === "eraser" ? "cursor-pointer" :
              "cursor-crosshair"
            }`}
            onMouseMove={handleMouseMove}
            onMouseDown={handleCanvasMouseDown}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>

      {/* Legend */}
      {annotations.length > 0 && (
        <div className="medical-card">
          <h4 className="font-semibold mb-3">Annotation Legend</h4>
          <div className="flex flex-wrap gap-2">
            {annotationLabels
              .filter(label => annotations.some(a => a.label === label.value))
              .map((label) => (
                <Badge
                  key={label.value}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  {label.label}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}