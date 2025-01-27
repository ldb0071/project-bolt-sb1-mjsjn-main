import React, { useRef, useState, useEffect } from 'react';
import { 
  Pen, 
  Save, 
  Undo, 
  Redo, 
  X, 
  Scissors,
  MousePointer,
  Plus,
  Minus,
  CornerUpLeft,
  Square,
  Circle,
  Type,
  ArrowRight,
  Layers,
  Copy,
  Trash2,
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  BringToFront,
  SendToBack
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
  type: 'point' | 'control';
  connected?: boolean;
  handleIn?: { x: number; y: number };
  handleOut?: { x: number; y: number };
  smooth?: boolean;
}

interface ShapeEditorProps {
  onSave: (svgPath: string) => void;
  onClose: () => void;
}

type Tool = 'pen' | 'direct' | 'add' | 'remove' | 'convert' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'select' | 'move';

interface Arrow {
  id: string;
  startPoint: Point;
  endPoint: Point;
  controlPoint1?: Point;
  controlPoint2?: Point;
  label?: string;
  style?: {
    stroke?: string;
    strokeWidth?: number;
    arrowSize?: number;
  };
}

interface Shape {
  id: string;
  type: 'path' | 'rectangle' | 'circle' | 'text' | 'arrow';
  points: Point[];
  text?: string;
  style?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    fontSize?: number;
    cornerRadius?: number;
    dashed?: boolean;
    width?: number;
    height?: number;
  };
  groupId?: string;
}

interface Group {
  id: string;
  shapes: string[];
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface Layer {
  id: string;
  shapes: string[];
  visible: boolean;
  locked: boolean;
  name: string;
}

interface Guide {
  type: 'horizontal' | 'vertical';
  position: number;
  active: boolean;
}

export function ShapeEditor({ onSave, onClose }: ShapeEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<Point[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [selectedHandle, setSelectedHandle] = useState<{ point: number; handle: 'in' | 'out' } | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>('pen');
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number } | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState<Point | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<'top' | 'right' | 'bottom' | 'left' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | null>(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [colorPickerPosition, setColorPickerPosition] = useState<{ x: number; y: number } | null>(null);
  const [editingShape, setEditingShape] = useState<Shape | null>(null);
  const [layers, setLayers] = useState<Layer[]>([{ 
    id: '1', 
    shapes: [], 
    visible: true, 
    locked: false,
    name: 'Layer 1' 
  }]);
  const [activeLayer, setActiveLayer] = useState('1');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [showGuides, setShowGuides] = useState(true);
  const [snapToGuides, setSnapToGuides] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');

  // Undo/Redo functionality
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setPoints(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setPoints(history[historyIndex + 1]);
    }
  };

  const addToHistory = (newPoints: Point[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newPoints]);
    setHistoryIndex(prev => prev + 1);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') setIsAltPressed(true);
      if (e.key === 'Shift') setIsShiftPressed(true);
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        if (points.length > 0) {
          handleClosePath();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') setIsAltPressed(false);
      if (e.key === 'Shift') setIsShiftPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [points, historyIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Set canvas size to match container
    canvas.width = 800;  // Increased size
    canvas.height = 600; // Increased size

    // Clear and set background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid with larger spacing
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const gridSize = 40; // Increased grid size
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw shapes and arrows
    drawShapes(ctx);

    // Draw path
    if (points.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const nextPoint = points[i + 1];

        if (nextPoint) {
          if (point.handleOut && nextPoint.handleIn) {
            ctx.bezierCurveTo(
              point.handleOut.x, point.handleOut.y,
              nextPoint.handleIn.x, nextPoint.handleIn.y,
              nextPoint.x, nextPoint.y
            );
          } else {
            ctx.lineTo(nextPoint.x, nextPoint.y);
          }
        }
      }

      // Draw preview line if drawing
      if (isDrawing && lastMousePos) {
        const lastPoint = points[points.length - 1];
        const firstPoint = points[0];
        const isNearFirstPoint = Math.hypot(lastMousePos.x - firstPoint.x, lastMousePos.y - firstPoint.y) < 10;

        if (isNearFirstPoint) {
          // Show connection preview
          ctx.setLineDash([2, 2]);
          if (lastPoint.handleOut) {
            ctx.bezierCurveTo(
              lastPoint.handleOut.x, lastPoint.handleOut.y,
              firstPoint.x, firstPoint.y,
              firstPoint.x, firstPoint.y
            );
          } else {
            ctx.lineTo(firstPoint.x, firstPoint.y);
          }
          ctx.setLineDash([]);
        } else {
          if (lastPoint.handleOut) {
            ctx.bezierCurveTo(
              lastPoint.handleOut.x, lastPoint.handleOut.y,
              lastMousePos.x, lastMousePos.y,
              lastMousePos.x, lastMousePos.y
            );
          } else {
            ctx.lineTo(lastMousePos.x, lastMousePos.y);
          }
        }
      }

      // Close and fill path if connected
      if (points[points.length - 1].connected) {
        ctx.closePath();
        ctx.fillStyle = '#22d3ee20';
        ctx.fill();
      }

      ctx.stroke();

      // Draw connection indicator when near first point
      if (isDrawing && lastMousePos && points.length > 2) {
        const firstPoint = points[0];
        const distance = Math.hypot(lastMousePos.x - firstPoint.x, lastMousePos.y - firstPoint.y);
        if (distance < 10) {
          ctx.beginPath();
          ctx.strokeStyle = '#22d3ee';
          ctx.setLineDash([2, 2]);
          ctx.arc(firstPoint.x, firstPoint.y, 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw points and handles
      points.forEach((point, index) => {
        // Draw handles
        if (point.handleIn) {
          ctx.beginPath();
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1;
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(point.handleIn.x, point.handleIn.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.fillStyle = '#f97316';
          ctx.arc(point.handleIn.x, point.handleIn.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        if (point.handleOut) {
          ctx.beginPath();
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1;
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(point.handleOut.x, point.handleOut.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.fillStyle = '#f97316';
          ctx.arc(point.handleOut.x, point.handleOut.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw anchor point
        ctx.beginPath();
        ctx.fillStyle = index === selectedPoint ? '#ffffff' : (index === 0 && isDrawing ? '#22ffee' : '#22d3ee');
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();

        if (index === selectedPoint || (index === 0 && isDrawing)) {
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }
  }, [points, selectedPoint, isDrawing, lastMousePos, shapes, arrows]);

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const addPoint = (x: number, y: number) => {
    const newPoint: Point = { 
      x, 
      y, 
      type: 'point',
      smooth: isShiftPressed 
    };

    if (isShiftPressed && points.length > 0) {
      const lastPoint = points[points.length - 1];
      const angle = Math.atan2(y - lastPoint.y, x - lastPoint.x);
      const distance = Math.hypot(x - lastPoint.x, y - lastPoint.y);
      
      // Add handles to create a smooth curve
      const handleLength = distance / 3;
      
      // Update last point's out handle
      lastPoint.handleOut = {
        x: lastPoint.x + Math.cos(angle) * handleLength,
        y: lastPoint.y + Math.sin(angle) * handleLength
      };

      // Add in handle to new point
      newPoint.handleIn = {
        x: x - Math.cos(angle) * handleLength,
        y: y - Math.sin(angle) * handleLength
      };
    }

    setPoints(prev => [...prev, newPoint]);
    addToHistory([...points, newPoint]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPoint(e);
    if (!pos) return;

    const { x, y } = pos;

    // Check if clicking on a resize handle
    if (selectedShapes.length > 0) {
      const group = groups.find(g => 
        selectedShapes.some(id => g.shapes.includes(id))
      );
      
      if (group) {
        const handle = getResizeHandle(x, y, group.bounds);
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
          return;
        }
      }
    }

    switch (currentTool) {
      case 'rectangle':
      case 'circle':
        setIsDrawingShape(true);
        setStartPoint({ x, y });
        break;
      case 'text':
        setTextPosition({ x, y });
        setShowTextInput(true);
        break;
      case 'pen':
        handlePenToolClick(x, y);
        break;
      case 'direct':
        handleDirectSelection(x, y);
        break;
      case 'add':
        handleAddPoint(x, y);
        break;
      case 'remove':
        handleRemovePoint(x, y);
        break;
      case 'convert':
        handleConvertPoint(x, y);
        break;
      case 'arrow':
        setIsDrawingArrow(true);
        setArrowStart({ x, y, type: 'point' });
        break;
    }
  };

  const handlePenToolClick = (x: number, y: number) => {
    if (points.length > 2) {
      const firstPoint = points[0];
      const distance = Math.hypot(x - firstPoint.x, y - firstPoint.y);
      
      if (distance < 10) {
        handleClosePath();
        return;
      }
    }

    const clickedPointIndex = points.findIndex(point => 
      Math.hypot(point.x - x, point.y - y) < 5
    );

    if (clickedPointIndex === -1) {
      setIsDrawing(true);
      addPoint(x, y);
    }
  };

  const handleDirectSelection = (x: number, y: number) => {
    // Check for handle selection first
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (point.handleIn && Math.hypot(point.handleIn.x - x, point.handleIn.y - y) < 5) {
        setSelectedHandle({ point: i, handle: 'in' });
        return;
      }
      if (point.handleOut && Math.hypot(point.handleOut.x - x, point.handleOut.y - y) < 5) {
        setSelectedHandle({ point: i, handle: 'out' });
        return;
      }
    }

    // Then check for point selection
    const clickedPointIndex = points.findIndex(point => 
      Math.hypot(point.x - x, point.y - y) < 5
    );

    setSelectedPoint(clickedPointIndex !== -1 ? clickedPointIndex : null);
    setSelectedHandle(null);
  };

  const handleAddPoint = (x: number, y: number) => {
    // Find closest segment and add point
    let minDist = Infinity;
    let insertIndex = -1;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dist = distToSegment(x, y, p1.x, p1.y, p2.x, p2.y);
      if (dist < minDist) {
        minDist = dist;
        insertIndex = i + 1;
      }
    }

    if (minDist < 5 && insertIndex !== -1) {
      const newPoints = [...points];
      newPoints.splice(insertIndex, 0, { x, y, type: 'point' });
      setPoints(newPoints);
      addToHistory(newPoints);
    }
  };

  const handleRemovePoint = (x: number, y: number) => {
    const removeIndex = points.findIndex(point => 
      Math.hypot(point.x - x, point.y - y) < 5
    );

    if (removeIndex !== -1) {
      const newPoints = points.filter((_, i) => i !== removeIndex);
      setPoints(newPoints);
      addToHistory(newPoints);
    }
  };

  const handleConvertPoint = (x: number, y: number) => {
    const pointIndex = points.findIndex(point => 
      Math.hypot(point.x - x, point.y - y) < 5
    );

    if (pointIndex !== -1) {
      const newPoints = [...points];
      const point = newPoints[pointIndex];
      point.smooth = !point.smooth;

      if (point.smooth) {
        // Add handles if they don't exist
        if (!point.handleIn) point.handleIn = { x: x - 20, y };
        if (!point.handleOut) point.handleOut = { x: x + 20, y };
      } else {
        // Remove handles
        delete point.handleIn;
        delete point.handleOut;
      }

      setPoints(newPoints);
      addToHistory(newPoints);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPoint(e);
    if (!pos) return;

    const { x, y } = pos;
    setLastMousePos({ x, y });

    if (isDrawingShape && startPoint) {
      // Update preview
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawShapes(ctx); // Draw existing shapes

      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      if (currentTool === 'rectangle') {
        const width = x - startPoint.x;
        const height = y - startPoint.y;
        ctx.strokeRect(startPoint.x, startPoint.y, width, height);
      } else if (currentTool === 'circle') {
        const radius = Math.hypot(x - startPoint.x, y - startPoint.y);
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }

    if (isDrawingArrow && arrowStart) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawShapes(ctx);

      // Draw preview arrow
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      const dx = x - arrowStart.x;
      const dy = y - arrowStart.y;
      const cp1x = arrowStart.x + dx / 2;
      const cp1y = arrowStart.y + dy / 3;
      const cp2x = arrowStart.x + dx / 2;
      const cp2y = y - dy / 3;

      ctx.beginPath();
      ctx.moveTo(arrowStart.x, arrowStart.y);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (isResizing && resizeHandle && selectedShapes.length > 0) {
      const group = groups.find(g => 
        selectedShapes.some(id => g.shapes.includes(id))
      );
      
      if (group) {
        resizeShapes(x, y, group, resizeHandle);
        return;
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isResizing) {
      setIsResizing(false);
      setResizeHandle(null);
      return;
    }

    if (isDrawingShape && startPoint) {
      const pos = getCanvasPoint(e);
      if (!pos) return;

      const { x, y } = pos;

      if (currentTool === 'rectangle') {
        createRectangle(startPoint, { x, y });
      } else if (currentTool === 'circle') {
        const radius = Math.hypot(x - startPoint.x, y - startPoint.y);
        createCircle(startPoint, radius);
      }

      setIsDrawingShape(false);
      setStartPoint(null);
    }

    if (isDrawingArrow && arrowStart) {
      const pos = getCanvasPoint(e);
      if (!pos) return;

      const { x, y } = pos;
      createArrow(arrowStart, { x, y, type: 'point' });
      setIsDrawingArrow(false);
      setArrowStart(null);
    }
  };

  const handleClosePath = () => {
    if (points.length > 2) {
      const closedPoints = [...points];
      closedPoints[closedPoints.length - 1].connected = true;
      setPoints(closedPoints);
      addToHistory(closedPoints);
      setIsDrawing(false);
    }
  };

  const distToSegment = (x: number, y: number, x1: number, y1: number, x2: number, y2: number) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;

    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleSave = () => {
    if (points.length < 2) return;
    
    let svgPath = '';
    points.forEach((point, index) => {
      if (index === 0) {
        svgPath += `M ${point.x} ${point.y} `;
      } else {
        const prevPoint = points[index - 1];
        if (prevPoint.handleOut && point.handleIn) {
          svgPath += `C ${prevPoint.handleOut.x} ${prevPoint.handleOut.y}, ${point.handleIn.x} ${point.handleIn.y}, ${point.x} ${point.y} `;
        } else {
          svgPath += `L ${point.x} ${point.y} `;
        }
      }
    });
    
    if (points[points.length - 1].connected) {
      svgPath += 'Z';
    }
    
    onSave(svgPath);
  };

  const createRectangle = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const newShape: Shape = {
      id: `shape-${shapes.length}`,
      type: 'rectangle',
      points: [
        { x: start.x, y: start.y, type: 'point' },
        { x: end.x, y: end.y, type: 'point' }
      ],
      style: {
        fill: '#22d3ee20',
        stroke: '#22d3ee',
        strokeWidth: 2
      }
    };
    setShapes([...shapes, newShape]);
  };

  const createCircle = (center: { x: number; y: number }, radius: number) => {
    const newShape: Shape = {
      id: `shape-${shapes.length}`,
      type: 'circle',
      points: [
        { x: center.x, y: center.y, type: 'point' },
        { x: center.x + radius, y: center.y, type: 'point' }
      ],
      style: {
        fill: '#22d3ee20',
        stroke: '#22d3ee',
        strokeWidth: 2
      }
    };
    setShapes([...shapes, newShape]);
  };

  const createText = (position: { x: number; y: number }, text: string) => {
    const newShape: Shape = {
      id: `shape-${shapes.length}`,
      type: 'text',
      points: [{ x: position.x, y: position.y, type: 'point' }],
      text,
      style: {
        fill: '#ffffff',
        fontSize: 14
      }
    };
    setShapes([...shapes, newShape]);
  };

  const createArrow = (start: Point, end: Point, label?: string) => {
    // Calculate control points for curved arrow
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const controlPoint1: Point = {
      x: start.x + dx / 2,
      y: start.y + dy / 3,
      type: 'control'
    };
    
    const controlPoint2: Point = {
      x: start.x + dx / 2,
      y: end.y - dy / 3,
      type: 'control'
    };

    const newArrow: Arrow = {
      id: `arrow-${arrows.length}`,
      startPoint: start,
      endPoint: end,
      controlPoint1,
      controlPoint2,
      label,
      style: {
        stroke: '#22d3ee',
        strokeWidth: 2,
        arrowSize: 8
      }
    };
    
    setArrows([...arrows, newArrow]);
  };

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    // Draw guides first
    if (showGuides) {
      ctx.save();
      ctx.strokeStyle = '#22d3ee50';
      ctx.setLineDash([5, 5]);
      guides.forEach(guide => {
        if (guide.active) {
          ctx.beginPath();
          if (guide.type === 'horizontal') {
            ctx.moveTo(0, guide.position);
            ctx.lineTo(ctx.canvas.width, guide.position);
          } else {
            ctx.moveTo(guide.position, 0);
            ctx.lineTo(guide.position, ctx.canvas.height);
          }
          ctx.stroke();
        }
      });
      ctx.restore();
    }

    // Draw shapes layer by layer
    layers.forEach(layer => {
      if (!layer.visible) return;
      
      layer.shapes.forEach(shapeId => {
        const shape = shapes.find(s => s.id === shapeId);
        if (!shape) return;

        ctx.save();
        
        // Apply shape styles
        if (shape.style) {
          ctx.fillStyle = shape.style.fill || '#ffffff';
          ctx.strokeStyle = shape.style.stroke || '#000000';
          ctx.lineWidth = shape.style.strokeWidth || 2;
          if (shape.style.dashed) {
            ctx.setLineDash([5, 5]);
          }
        }

        // Draw based on shape type
      switch (shape.type) {
        case 'rectangle':
            const radius = shape.style?.cornerRadius || 0;
            roundRect(ctx, shape.points[0].x, shape.points[0].y, 
                     shape.style?.width || 100, shape.style?.height || 100, radius);
          break;
        case 'circle':
          ctx.beginPath();
            ctx.arc(shape.points[0].x, shape.points[0].y, 
                   shape.style?.width ? shape.style.width / 2 : 50, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        case 'text':
          if (shape.text) {
              ctx.font = `${shape.style?.fontSize || fontSize}px ${fontFamily}`;
              ctx.textAlign = shape.style?.textAlign as CanvasTextAlign || textAlign;
            ctx.fillText(shape.text, shape.points[0].x, shape.points[0].y);
          }
          break;
          // ... other shape types ...
      }
        
        ctx.restore();
      });
    });

    // Draw arrows
    arrows.forEach(arrow => {
      ctx.strokeStyle = arrow.style?.stroke || '#22d3ee';
      ctx.lineWidth = arrow.style?.strokeWidth || 2;
      
      // Draw curved arrow path
      ctx.beginPath();
      ctx.moveTo(arrow.startPoint.x, arrow.startPoint.y);
      if (arrow.controlPoint1 && arrow.controlPoint2) {
        ctx.bezierCurveTo(
          arrow.controlPoint1.x, arrow.controlPoint1.y,
          arrow.controlPoint2.x, arrow.controlPoint2.y,
          arrow.endPoint.x, arrow.endPoint.y
        );
      } else {
        ctx.lineTo(arrow.endPoint.x, arrow.endPoint.y);
      }
      ctx.stroke();

      // Draw arrowhead
      const arrowSize = arrow.style?.arrowSize || 8;
      const angle = Math.atan2(
        arrow.endPoint.y - (arrow.controlPoint2?.y || arrow.startPoint.y),
        arrow.endPoint.x - (arrow.controlPoint2?.x || arrow.startPoint.x)
      );

      ctx.beginPath();
      ctx.moveTo(arrow.endPoint.x, arrow.endPoint.y);
      ctx.lineTo(
        arrow.endPoint.x - arrowSize * Math.cos(angle - Math.PI / 6),
        arrow.endPoint.y - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(arrow.endPoint.x, arrow.endPoint.y);
      ctx.lineTo(
        arrow.endPoint.x - arrowSize * Math.cos(angle + Math.PI / 6),
        arrow.endPoint.y - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();

      // Draw label if exists
      if (arrow.label) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        const labelX = (arrow.startPoint.x + arrow.endPoint.x) / 2;
        const labelY = (arrow.startPoint.y + arrow.endPoint.y) / 2 - 10;
        ctx.fillText(arrow.label, labelX, labelY);
      }
    });

    // Draw group selection
    groups.forEach(group => {
      if (selectedShapes.some(id => group.shapes.includes(id))) {
        ctx.strokeStyle = '#22d3ee';
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          group.bounds.x - 5,
          group.bounds.y - 5,
          group.bounds.width + 10,
          group.bounds.height + 10
        );
        ctx.setLineDash([]);

        // Draw resize handles
        drawResizeHandles(ctx, group.bounds);
      }
    });
  };

  const drawResizeHandles = (ctx: CanvasRenderingContext2D, bounds: { x: number; y: number; width: number; height: number }) => {
    const handleSize = 8;
    const handles = [
      { x: bounds.x - handleSize/2, y: bounds.y - handleSize/2 }, // topLeft
      { x: bounds.x + bounds.width/2 - handleSize/2, y: bounds.y - handleSize/2 }, // top
      { x: bounds.x + bounds.width - handleSize/2, y: bounds.y - handleSize/2 }, // topRight
      { x: bounds.x - handleSize/2, y: bounds.y + bounds.height/2 - handleSize/2 }, // left
      { x: bounds.x + bounds.width - handleSize/2, y: bounds.y + bounds.height/2 - handleSize/2 }, // right
      { x: bounds.x - handleSize/2, y: bounds.y + bounds.height - handleSize/2 }, // bottomLeft
      { x: bounds.x + bounds.width/2 - handleSize/2, y: bounds.y + bounds.height - handleSize/2 }, // bottom
      { x: bounds.x + bounds.width - handleSize/2, y: bounds.y + bounds.height - handleSize/2 } // bottomRight
    ];

    ctx.fillStyle = '#ffffff';
    handles.forEach(handle => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
      ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
    });
  };

  const getResizeHandle = (x: number, y: number, bounds: { x: number; y: number; width: number; height: number }) => {
    const handleSize = 8;
    const handles = [
      { type: 'topLeft', x: bounds.x - handleSize/2, y: bounds.y - handleSize/2 },
      { type: 'top', x: bounds.x + bounds.width/2 - handleSize/2, y: bounds.y - handleSize/2 },
      { type: 'topRight', x: bounds.x + bounds.width - handleSize/2, y: bounds.y - handleSize/2 },
      { type: 'left', x: bounds.x - handleSize/2, y: bounds.y + bounds.height/2 - handleSize/2 },
      { type: 'right', x: bounds.x + bounds.width - handleSize/2, y: bounds.y + bounds.height/2 - handleSize/2 },
      { type: 'bottomLeft', x: bounds.x - handleSize/2, y: bounds.y + bounds.height - handleSize/2 },
      { type: 'bottom', x: bounds.x + bounds.width/2 - handleSize/2, y: bounds.y + bounds.height - handleSize/2 },
      { type: 'bottomRight', x: bounds.x + bounds.width - handleSize/2, y: bounds.y + bounds.height - handleSize/2 }
    ];

    for (const handle of handles) {
      if (
        x >= handle.x && 
        x <= handle.x + handleSize && 
        y >= handle.y && 
        y <= handle.y + handleSize
      ) {
        return handle.type as typeof resizeHandle;
      }
    }

    return null;
  };

  const resizeShapes = (
    x: number, 
    y: number, 
    group: Group, 
    handle: NonNullable<typeof resizeHandle>
  ) => {
    const dx = x - (group.bounds.x + (handle.includes('Right') ? group.bounds.width : 0));
    const dy = y - (group.bounds.y + (handle.includes('Bottom') ? group.bounds.height : 0));

    const updatedShapes = shapes.map(shape => {
      if (group.shapes.includes(shape.id)) {
        const newPoints = shape.points.map(point => ({
          ...point,
          x: point.x + (handle.includes('Right') ? dx : 0),
          y: point.y + (handle.includes('Bottom') ? dy : 0)
        }));

        return {
          ...shape,
          points: newPoints,
          style: {
            ...shape.style,
            width: shape.style?.width ? shape.style.width + dx : undefined,
            height: shape.style?.height ? shape.style.height + dy : undefined
          }
        };
      }
      return shape;
    });

    setShapes(updatedShapes);
    
    // Update group bounds
    const updatedGroups = groups.map(g =>
      g.id === group.id
        ? {
            ...g,
            bounds: {
              ...g.bounds,
              width: g.bounds.width + (handle.includes('Right') ? dx : 0),
              height: g.bounds.height + (handle.includes('Bottom') ? dy : 0)
            }
          }
        : g
    );
    
    setGroups(updatedGroups);
  };

  const handleGroup = () => {
    if (selectedShapes.length < 2) return;

    const bounds = calculateGroupBounds(selectedShapes);
    const groupId = `group-${groups.length}`;
    
    const newGroup: Group = {
      id: groupId,
      shapes: selectedShapes,
      bounds
    };

    setGroups([...groups, newGroup]);
    
    // Update shapes with group ID
    const updatedShapes = shapes.map(shape => 
      selectedShapes.includes(shape.id) 
        ? { ...shape, groupId } 
        : shape
    );
    
    setShapes(updatedShapes);
  };

  const handleUngroup = () => {
    if (selectedShapes.length === 0) return;

    const updatedShapes = shapes.map(shape => {
      if (selectedShapes.includes(shape.id)) {
        const { groupId, ...rest } = shape;
        return rest;
      }
      return shape;
    });

    setShapes(updatedShapes);
    setGroups(groups.filter(group => 
      !selectedShapes.some(id => group.shapes.includes(id))
    ));
  };

  const calculateGroupBounds = (shapeIds: string[]) => {
    const groupShapes = shapes.filter(shape => shapeIds.includes(shape.id));
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    groupShapes.forEach(shape => {
      shape.points.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      });
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  const handleColorChange = (color: string, type: 'fill' | 'stroke') => {
    if (!editingShape) return;

    const updatedShapes = shapes.map(shape =>
      shape.id === editingShape.id
        ? {
            ...shape,
            style: {
              ...shape.style,
              [type]: color
            }
          }
        : shape
    );

    setShapes(updatedShapes);
    setEditingShape({
      ...editingShape,
      style: {
        ...editingShape.style,
        [type]: color
      }
    });
  };

  // Layer management
  const addLayer = () => {
    const newLayer: Layer = {
      id: String(layers.length + 1),
      shapes: [],
      visible: true,
      locked: false,
      name: `Layer ${layers.length + 1}`
    };
    setLayers([...layers, newLayer]);
    setActiveLayer(newLayer.id);
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleLayerLock = (layerId: string) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  // Shape alignment
  const alignShapes = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedShapes.length < 2) return;

    const selectedShapeObjects = shapes.filter(s => selectedShapes.includes(s.id));
    const bounds = getSelectionBounds(selectedShapeObjects);

    const updatedShapes = shapes.map(shape => {
      if (!selectedShapes.includes(shape.id)) return shape;

      const newPoints = [...shape.points];
      switch (alignment) {
        case 'left':
          newPoints[0].x = bounds.x;
          break;
        case 'center':
          newPoints[0].x = bounds.x + bounds.width / 2;
          break;
        case 'right':
          newPoints[0].x = bounds.x + bounds.width;
          break;
        // ... other alignments ...
      }

      return { ...shape, points: newPoints };
    });

    setShapes(updatedShapes);
  };

  // Helper function for rounded rectangles
  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50">
      <div className="absolute inset-4 bg-gray-800 rounded-lg shadow-xl flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-700 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentTool('select')}
              className={`p-2 rounded ${currentTool === 'select' ? 'bg-primary-500' : 'hover:bg-gray-700'}`}
            >
              <MousePointer className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentTool('pen')}
              className={`p-2 rounded ${currentTool === 'pen' ? 'bg-primary-500' : 'hover:bg-gray-700'}`}
            >
              <Pen className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentTool('text')}
              className={`p-2 rounded ${currentTool === 'text' ? 'bg-primary-500' : 'hover:bg-gray-700'}`}
            >
              <Type className="w-5 h-5" />
            </button>
          </div>

          <div className="h-8 w-px bg-gray-700" />
          
          {/* Text controls */}
          {currentTool === 'text' && (
            <div className="flex items-center space-x-2">
              <select 
                value={fontFamily}
                onChange={e => setFontFamily(e.target.value)}
                className="bg-gray-700 rounded px-2 py-1"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
              <input 
                type="number" 
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="w-16 bg-gray-700 rounded px-2 py-1"
              />
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 flex">
          {/* Canvas */}
          <div className="flex-1 relative">
            <canvas
              ref={canvasRef}
              className="absolute inset-0"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </div>

          {/* Layers panel */}
          <div className="w-64 bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-200">Layers</h3>
              <button onClick={addLayer} className="p-1 hover:bg-gray-800 rounded">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {layers.map(layer => (
                <div 
                  key={layer.id}
                  className={`flex items-center p-2 rounded ${
                    activeLayer === layer.id ? 'bg-gray-800' : ''
                  }`}
                  onClick={() => setActiveLayer(layer.id)}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerLock(layer.id);
                    }}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                  <span className="ml-2 text-sm text-gray-300">{layer.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 