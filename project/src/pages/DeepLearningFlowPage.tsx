import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { 
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  Position,
  Panel,
  NodeToolbar,
  NodeResizer,
  Handle,
  MarkerType,
  getBezierPath,
  getSmoothStepPath,
  EdgeTypes,
  BaseEdge,
  NodeProps,
  EdgeProps,
  NodeChange,
  applyNodeChanges,
  useReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  EdgeLabelRenderer,
  addEdge
} from 'reactflow';
import { Network, Square, Circle, Triangle, Hexagon, Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon, Brain, Database, ChevronDown, Cpu, Workflow, BarChart, LineChart, PieChart, Activity, Zap, Star, Cloud, SplitSquareVertical, EyeOff, Pen, Undo2, Eye, Lock, Unlock, ChevronUp, Type, MousePointer, ArrowUpRight, Pencil, Eraser, Hand, Move, ZoomIn, Wand2, FolderPlus, Folder, LayoutGrid } from 'lucide-react';
import { ShapeEditor } from '../components/ShapeEditor';
import { generateArchitecture, generateArchitectureDescription, AVAILABLE_MODELS, ModelId } from '../services/chatService';
import { useStore } from '../store/useStore';
import { toast } from 'react-hot-toast';
import 'reactflow/dist/style.css';
import '../styles/shapes.css';

// Types and constants
type ConnectionType = 'bezier' | 'straight' | 'step' | 'smoothstep';
type ConnectionStyle = 'solid' | 'dashed' | 'dotted';

const CONNECTION_TYPES = [
  { label: 'Smoothstep', value: 'smoothstep' },
  { label: 'Bezier', value: 'bezier' },
  { label: 'Straight', value: 'straight' },
  { label: 'Step', value: 'step' }
] as const;

const CONNECTION_STYLES = [
  { label: 'Solid', value: 'solid' },
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' }
] as const;

const SHAPES = [
  { label: 'Rectangle', value: 'rectangle', icon: Square },
  { label: 'Circle', value: 'circle', icon: Circle },
  { label: 'Triangle', value: 'triangle', icon: Triangle },
  { label: 'Hexagon', value: 'hexagon', icon: Hexagon },
  { label: 'Rounded', value: 'rounded', icon: Square, rounded: true },
  { label: 'Grid', value: 'grid', icon: LayoutGrid },
  { label: 'Custom', value: 'custom', icon: Network }
] as const;

const COLORS = [
  '#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899',
  '#06b6d4', '#14b8a6', '#84cc16', '#eab308', '#ef4444'
];

interface CustomNodeData {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  shape?: string;
  color?: string;
  customPath?: string;
  isText?: boolean;
  fontSize?: number;
  gridX?: number;
  gridY?: number;
}

const ICONS = [
  { label: 'Network', icon: Network },
  { label: 'Brain', icon: Brain },
  { label: 'Database', icon: Database },
  { label: 'CPU', icon: Cpu },
  { label: 'Workflow', icon: Workflow },
  { label: 'Bar Chart', icon: BarChart },
  { label: 'Line Chart', icon: LineChart },
  { label: 'Pie Chart', icon: PieChart },
  { label: 'Activity', icon: Activity },
  { label: 'Lightning', icon: Zap },
  { label: 'Star', icon: Star },
  { label: 'Cloud', icon: Cloud }
];

// Add interface for Flow Project
interface FlowProject {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
}

function CustomNode({ data, selected, id }: NodeProps<CustomNodeData>) {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const [selectedIcon, setSelectedIcon] = useState<string>('Network');
  const [showIconSelect, setShowIconSelect] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: editData } : node
      )
    );
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({
          ...editData,
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setEditData({
      ...editData,
      image: undefined
    });
  };

  const getDynamicFontSize = () => {
    if (!nodeRef.current) return {};
    const { width, height } = nodeRef.current.getBoundingClientRect();
    
    // Different scaling factors based on shape
    let scaleFactor;
    const minSize = 12;
    const maxSize = 24;
    
    switch (data.shape) {
      case 'circle':
        scaleFactor = Math.min(width, height) * 0.1;
        break;
      case 'triangle':
        scaleFactor = Math.min(width, height) * 0.09;
        break;
      case 'hexagon':
        scaleFactor = Math.min(width, height) * 0.085;
        break;
      default:
        scaleFactor = Math.min(width, height) * 0.12;
    }
    
    return {
      fontSize: `${Math.min(Math.max(scaleFactor, minSize), maxSize)}px`,
      lineHeight: '1.2'
    };
  };

  const getContentStyles = () => {
    switch (data.shape) {
      case 'circle':
        return {
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center' as const
        };
      case 'triangle':
        return {
          padding: '2rem 1rem 1rem',
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          textAlign: 'center' as const,
          marginTop: '15%'
        };
      case 'hexagon':
        return {
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center' as const
        };
      default:
        return {
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column' as const,
          height: '100%'
        };
    }
  };

  const getShapeConstraints = () => {
    switch (data.shape) {
      case 'circle':
        return {
          aspectRatio: 1,
        };
      case 'hexagon':
        return {
          aspectRatio: 1.155, // Maintain hexagon proportions (width = height * √3/2)
        };
      case 'triangle':
      default:
        return {
          aspectRatio: undefined,
        };
    }
  };

  const constraints = getShapeConstraints();

  const getGridStyles = () => {
    if (data.shape !== 'grid') return {};
    
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${data.gridX || 4}, 1fr)`,
      gridTemplateRows: `repeat(${data.gridY || 3}, 1fr)`,
      gap: '2px',
      padding: '2px',
      backgroundColor: '#2a2a2a'
    };
  };

  const renderGridCells = () => {
    if (data.shape !== 'grid') return null;
    
    const cells = [];
    const totalCells = (data.gridX || 4) * (data.gridY || 3);
    
    for (let i = 0; i < totalCells; i++) {
      cells.push(
        <div
          key={i}
          className="w-full h-full rounded-sm"
          style={{ backgroundColor: data.color }}
        />
      );
    }
    
    return cells;
  };

  return (
    <>
      <NodeResizer
        isVisible={selected}
        lineClassName="!border-[2px] !border-primary-500 !z-[1000]"
        handleClassName="!h-3 !w-3 !bg-white !border !border-primary-500 !rounded-sm !shadow-sm !cursor-se-resize !z-[1000]"
        keepAspectRatio={data.shape === 'circle' || data.shape === 'hexagon'}
      />
      
      <NodeToolbar className="bg-navy-800 p-2 rounded-lg shadow-xl">
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setNodes((nodes) => nodes.filter((n) => n.id !== id));
                }}
                className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                title="Save"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </NodeToolbar>

      {isEditing ? (
        <div className="bg-navy-800 p-4 rounded-lg shadow-xl min-w-[300px]">
          <div className="space-y-4">
            <div className={`${
              editData.shape === 'circle' || editData.shape === 'hexagon' ? 'w-full text-center' : 'w-full'
            }`}>
              <label className="block text-sm font-medium text-white mb-1">Label</label>
              <input
                type="text"
                value={editData.label}
                onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                className={`w-full p-2 rounded-lg bg-navy-700 text-white border border-navy-600 ${
                  editData.shape === 'circle' || editData.shape === 'hexagon' ? 'text-center' : ''
                }`}
                style={{
                  maxWidth: editData.shape === 'triangle' ? '80%' : '100%',
                  margin: editData.shape === 'triangle' ? '0 auto' : undefined
                }}
              />
            </div>
            <div className={`${
              editData.shape === 'circle' || editData.shape === 'hexagon' ? 'w-full text-center' : 'w-full'
            }`}>
              <label className="block text-sm font-medium text-white mb-1">Description</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className={`w-full p-2 rounded-lg bg-navy-700 text-white border border-navy-600 ${
                  editData.shape === 'circle' || editData.shape === 'hexagon' ? 'text-center' : ''
                }`}
                style={{
                  maxWidth: editData.shape === 'triangle' ? '80%' : '100%',
                  margin: editData.shape === 'triangle' ? '0 auto' : undefined,
                  minHeight: editData.shape === 'circle' ? '80px' : '60px'
                }}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-white mb-1">Shape</label>
              <div className={`flex flex-wrap gap-2 ${
                editData.shape === 'circle' || editData.shape === 'hexagon' ? 'justify-center' : ''
              }`}>
                {SHAPES.map((shape) => (
                  <button
                    key={shape.value}
                    onClick={() => setEditData({ ...editData, shape: shape.value })}
                    className={`p-2 rounded-lg ${
                      editData.shape === shape.value ? 'bg-primary-500' : 'bg-navy-700 hover:bg-navy-600'
                    } text-white`}
                    title={shape.label}
                  >
                    <shape.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-white mb-1">Color</label>
              <div className={`flex flex-wrap gap-2 ${
                editData.shape === 'circle' || editData.shape === 'hexagon' ? 'justify-center' : ''
              }`}>
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditData({ ...editData, color })}
                    className={`w-8 h-8 rounded-full ${
                      editData.color === color ? 'ring-2 ring-white' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className={`${
              editData.shape === 'circle' || editData.shape === 'hexagon' ? 'w-full text-center' : 'w-full'
            }`}>
              <label className="block text-sm font-medium text-white mb-1">Icon</label>
              <div className="relative">
                <button
                  onClick={() => setShowIconSelect(!showIconSelect)}
                  className={`w-full p-2 rounded-lg bg-navy-700 text-white border border-navy-600 flex items-center ${
                    editData.shape === 'circle' || editData.shape === 'hexagon' ? 'justify-center' : 'justify-between'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {React.createElement(
                      ICONS.find(i => i.label === selectedIcon)?.icon || Network,
                      { className: "w-4 h-4" }
                    )}
                    <span>{selectedIcon}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showIconSelect && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-navy-700 rounded-lg shadow-xl border border-navy-600 p-2 z-50 max-h-48 overflow-y-auto">
                    <div className={`grid grid-cols-3 gap-1 ${
                      editData.shape === 'circle' || editData.shape === 'hexagon' ? 'place-items-center' : ''
                    }`}>
                      {ICONS.map((icon) => (
                        <button
                          key={icon.label}
                          onClick={() => {
                            setSelectedIcon(icon.label);
                            setEditData({
                              ...editData,
                              icon: React.createElement(icon.icon, { className: "w-5 h-5" })
                            });
                            setShowIconSelect(false);
                          }}
                          className={`p-2 rounded-lg flex flex-col items-center gap-1 ${
                            selectedIcon === icon.label ? 'bg-primary-500' : 'hover:bg-navy-600'
                          }`}
                        >
                          {React.createElement(icon.icon, { className: "w-4 h-4 text-white" })}
                          <span className="text-xs text-white">{icon.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Background Image</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-700 hover:bg-navy-600 text-white text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
                {editData.image && (
                  <button
                    onClick={removeImage}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-500"
                    title="Remove Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {editData.image && (
                <div className="relative w-full h-20 rounded-lg overflow-hidden">
                  <img
                    src={editData.image}
                    alt="Background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
                </div>
              )}
            </div>
            {data.shape === 'grid' && (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Grid Dimensions</label>
                  <div className="flex gap-2">
                    <div>
                      <label className="text-xs text-gray-400">X-axis</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editData.gridX || 4}
                        onChange={(e) => setEditData({ ...editData, gridX: parseInt(e.target.value) })}
                        className="w-full p-2 rounded-lg bg-navy-700 text-white border border-navy-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Y-axis</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editData.gridY || 3}
                        onChange={(e) => setEditData({ ...editData, gridY: parseInt(e.target.value) })}
                        className="w-full p-2 rounded-lg bg-navy-700 text-white border border-navy-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          ref={nodeRef}
          className={`relative transition-all duration-200 ${
            data.shape === 'circle'
              ? 'rounded-full'
              : data.shape === 'triangle'
              ? 'shape-triangle'
              : data.shape === 'hexagon'
              ? 'shape-hexagon'
              : data.shape === 'rounded'
              ? 'rounded-xl'
              : data.shape === 'grid'
              ? 'rounded-lg'
              : ''
          }`}
          style={{
            backgroundColor: data.shape === 'grid' ? '#2a2a2a' : data.color,
            width: '100%',
            height: '100%',
            clipPath: data.shape === 'triangle' 
              ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
              : data.shape === 'hexagon'
              ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
              : 'none',
            opacity: 0.9,
            ...(data.shape === 'grid' ? getGridStyles() : {})
          }}
        >
          {data.shape === 'grid' ? renderGridCells() : (
            <>
              {data.image && (
                <div className="absolute inset-0">
                  <img
                    src={data.image}
                    alt={data.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20 pointer-events-none" />
                </div>
              )}

              <div style={getContentStyles()}>
                <div className={`flex items-center gap-2 justify-center mb-2`}>
                  {data.icon && (
                    <div className="text-white transform hover:scale-110 transition-transform duration-200">
                      {data.icon}
                    </div>
                  )}
                  <div 
                    className="font-semibold text-white transition-all duration-200 break-words max-w-full"
                    style={{
                      ...getDynamicFontSize(),
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      maxWidth: '100%'
                    }}
                  >
                    {data.label}
                  </div>
                </div>
                {data.description && (
                  <div 
                    className="text-white/90 transition-all duration-200 break-words"
                    style={{
                      fontSize: `${Math.max(parseInt(getDynamicFontSize().fontSize || '14') * 0.75, 11)}px`,
                      lineHeight: '1.3',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      maxWidth: '100%'
                    }}
                  >
                    {data.description}
                  </div>
                )}
              </div>

              {!isEditing && (
                <>
                  <Handle
                    type="target"
                    position={Position.Top}
                    className="w-4 h-4 border-2 border-white bg-primary-500 !opacity-100"
                    style={{ top: -8, zIndex: 1001 }}
                    isConnectable={true}
                    id="top"
                  />
                  <Handle
                    type="source"
                    position={Position.Bottom}
                    className="w-4 h-4 border-2 border-white bg-primary-500 !opacity-100"
                    style={{ bottom: -8, zIndex: 1001 }}
                    isConnectable={true}
                    id="bottom"
                  />
                  <Handle
                    type="target"
                    position={Position.Left}
                    className="w-4 h-4 border-2 border-white bg-primary-500 !opacity-100"
                    style={{ left: -8, zIndex: 1001 }}
                    isConnectable={true}
                    id="left"
                  />
                  <Handle
                    type="source"
                    position={Position.Right}
                    className="w-4 h-4 border-2 border-white bg-primary-500 !opacity-100"
                    style={{ right: -8, zIndex: 1001 }}
                    isConnectable={true}
                    id="right"
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

// Add TextNode type
const TextNode = ({ data, selected, id }: NodeProps<CustomNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { setNodes } = useReactFlow();

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
      textRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setEditData(prev => ({ ...prev, label: newText }));
    
    // Auto-resize the textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    
    // Update node data immediately for smooth resizing
    setNodes(nodes => nodes.map(node => 
      node.id === id 
        ? { 
            ...node, 
            data: { ...node.data, label: newText },
          }
        : node
    ));
  };

  const handleBlur = () => {
    setIsEditing(false);
    setNodes(nodes => nodes.map(node => 
      node.id === id ? { ...node, data: editData } : node
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditData(data);
    }
    e.stopPropagation();
  };

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={50}
        minHeight={30}
        lineClassName="border-primary-500"
        handleClassName="h-2 w-2 bg-white border border-primary-500"
        onResize={(_, newSize) => {
          const fontSize = Math.max(12, Math.min(96, newSize.width / 20));
          setEditData(prev => ({ ...prev, fontSize }));
          setNodes(nodes => nodes.map(node => 
            node.id === id 
              ? {
                  ...node,
                  data: { ...node.data, fontSize },
                  style: { ...node.style, ...newSize }
                }
              : node
          ));
        }}
      />
      
      {isEditing ? (
        <textarea
          ref={textRef}
          value={editData.label}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-white outline-none resize-none w-full h-full p-0 m-0 border-none"
          style={{ 
            fontSize: `${editData.fontSize || 16}px`,
            lineHeight: '1.2',
            fontFamily: 'inherit',
            caretColor: '#fff'
          }}
          autoFocus
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="w-full h-full cursor-text select-text"
          style={{ 
            fontSize: `${data.fontSize || 16}px`,
            lineHeight: '1.2',
            color: data.color,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            userSelect: 'text'
          }}
        >
          {data.label}
        </div>
      )}
    </>
  );
};

function Flow() {
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'custom',
      position: { x: 100, y: 100 },
      data: {
        label: 'Input',
        color: '#3b82f6',
        shape: 'rectangle',
        description: 'Input node'
      }
    },
    {
      id: '2',
      type: 'custom',
      position: { x: 300, y: 100 },
      data: {
        label: 'Output',
        color: '#22c55e',
        shape: 'rectangle',
        description: 'Output node'
      }
    }
  ];

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'custom',
      markerEnd: { type: MarkerType.ArrowClosed }
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [layers, setLayers] = useState<Layer[]>([{
    id: '1',
    name: 'Layer 1',
    visible: true,
    locked: false,
    nodes: initialNodes.map(node => node.id)
  }]);
  const [activeLayer, setActiveLayer] = useState('1');
  const [selectedTool, setSelectedTool] = useState<'select' | 'connect' | 'draw' | 'shape' | 'text' | 'hand'>('select');
  const [selectedShape, setSelectedShape] = useState<string>('rectangle');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [drawingShape, setDrawingShape] = useState<Node | null>(null);
  const [isStraightLine, setIsStraightLine] = useState(false);
  const [showConnections, setShowConnections] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [shapeStartPoint, setShapeStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [tempShape, setTempShape] = useState<Node | null>(null);
  const { screenToFlowPosition, getViewport } = useReactFlow();
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [drawingCtx, setDrawingCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [connectionType, setConnectionType] = useState<ConnectionType>('smoothstep');
  const [connectionStyle, setConnectionStyle] = useState<ConnectionStyle>('solid');
  const [edgeAnimated, setEdgeAnimated] = useState(false);
  const [offsetX, setOffsetX] = useState<number>(50);
  const [offsetY, setOffsetY] = useState<number>(50);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [edgeSettings, setEdgeSettings] = useState({
    connectionType: 'smoothstep' as ConnectionType,
    connectionStyle: 'solid' as ConnectionStyle,
    edgeAnimated: false,
    offsetX: 50,
    offsetY: 50
  });
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiInput, setAiInput] = useState<string>('');  // Initialize with empty string
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAiImage, setSelectedAiImage] = useState<string | null>(null);
  const aiImageInputRef = useRef<HTMLInputElement>(null);
  const geminiKey = useStore((state) => state.geminiKey);
  const [selectedModel, setSelectedModel] = useState<ModelId>('gemini-1.5-pro');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [projects, setProjects] = useState<FlowProject[]>([]);
  const [currentProject, setCurrentProject] = useState<FlowProject | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [isAddingText, setIsAddingText] = useState(false);
  const [textDraft, setTextDraft] = useState('');
  const [gridConfig, setGridConfig] = useState({ x: 4, y: 3 });
  const [showGridConfig, setShowGridConfig] = useState(false);

  // Initialize with a default project if none exists
  useEffect(() => {
    if (projects.length === 0) {
      const defaultProject: FlowProject = {
        id: crypto.randomUUID(),
        name: 'Default Project',
        description: 'Default deep learning flow project',
        nodes: initialNodes,
        edges: initialEdges,
        createdAt: new Date()
      };
      setProjects([defaultProject]);
      setCurrentProject(defaultProject);
    }
  }, []);

  // Create new project
  const createProject = () => {
    if (!newProjectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    const newProject: FlowProject = {
      id: crypto.randomUUID(),
      name: newProjectName,
      description: newProjectDescription,
      nodes: [],
      edges: [],
      createdAt: new Date()
    };

    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    setNodes([]);
    setEdges([]);
    setShowProjectModal(false);
    setNewProjectName('');
    setNewProjectDescription('');
    toast.success('Project created successfully');
  };

  // Delete project
  const deleteProject = (projectId: string) => {
    if (projects.length === 1) {
      toast.error('Cannot delete the last project');
      return;
    }

    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProject?.id === projectId) {
      const remainingProject = projects.find(p => p.id !== projectId);
      if (remainingProject) {
        setCurrentProject(remainingProject);
        setNodes(remainingProject.nodes);
        setEdges(remainingProject.edges);
      }
    }
    toast.success('Project deleted successfully');
  };

  // Switch project
  const switchProject = (project: FlowProject) => {
    // Save current project state
    if (currentProject) {
      setProjects(prev => prev.map(p => 
        p.id === currentProject.id 
          ? { ...p, nodes, edges }
          : p
      ));
    }

    // Load selected project
    setCurrentProject(project);
    setNodes(project.nodes);
    setEdges(project.edges);
  };

  // Save current project
  const saveProject = () => {
    if (!currentProject) return;

    setProjects(prev => prev.map(p => 
      p.id === currentProject.id 
        ? { ...currentProject, nodes, edges }
        : p
    ));
    toast.success('Project saved successfully');
  };

  // Add connection settings panel
  const ConnectionSettingsPanel = ({ edge }: { edge: Edge }) => (
    <Panel position="top-center" className="bg-navy-800/95 p-2 rounded-lg shadow-xl backdrop-blur-sm border border-navy-700/50">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Type:</label>
            <select 
              value={connectionType}
              onChange={(e) => setConnectionType(e.target.value as ConnectionType)}
              className="bg-navy-700 text-white text-sm rounded px-2 py-1 border border-navy-600"
            >
              {CONNECTION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Style:</label>
            <select
              value={connectionStyle}
              onChange={(e) => setConnectionStyle(e.target.value as ConnectionStyle)}
              className="bg-navy-700 text-white text-sm rounded px-2 py-1 border border-navy-600"
            >
              {CONNECTION_STYLES.map(style => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Animated:</label>
            <input
              type="checkbox"
              checked={edgeAnimated}
              onChange={(e) => setEdgeAnimated(e.target.checked)}
              className="rounded border-navy-600"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">X Offset:</label>
            <input
              type="range"
              min="0"
              max="200"
              value={offsetX}
              onChange={(e) => setOffsetX(Number(e.target.value))}
              className="w-24 h-2 bg-navy-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-300 w-8">{offsetX}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Y Offset:</label>
            <input
              type="range"
              min="0"
              max="200"
              value={offsetY}
              onChange={(e) => setOffsetY(Number(e.target.value))}
              className="w-24 h-2 bg-navy-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-300 w-8">{offsetY}</span>
          </div>
        </div>
      </div>
    </Panel>
  );

  // Update onConnect to include new connection properties
  const onConnect = useCallback((params: Connection) => {
    // Create the connection with default settings first
    const connection = {
      ...params,
      type: 'custom',
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { 
        connectionType,
        connectionStyle,
        animated: edgeAnimated
      },
      style: {
        strokeWidth: 2,
        stroke: '#64748b',
        strokeDasharray: connectionStyle === 'dashed' ? '5,5' : 
                        connectionStyle === 'dotted' ? '2,2' : 'none',
        animation: edgeAnimated ? 'flow 1s linear infinite' : 'none'
      }
    };

    setEdges((eds) => addEdge(connection, eds));
  }, [connectionType, connectionStyle, edgeAnimated]);

  // Update the CustomEdge component
  const CustomEdge = useCallback(({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data
  }: EdgeProps) => {
    const edgeType = data?.connectionType || connectionType;
    const edgeStyle = data?.connectionStyle || connectionStyle;
    const isAnimated = data?.animated || edgeAnimated;
    const currentOffsetX = data?.offsetX || offsetX;
    const currentOffsetY = data?.offsetY || offsetY;
    
    let edgePath = '';
    
    // Check if it's a feedback connection (right to left on same level)
    const isFeedback = sourcePosition === Position.Right && 
                      targetPosition === Position.Left && 
                      Math.abs(sourceY - targetY) < 10 &&
                      sourceX > targetX;

    if (isFeedback) {
      const midX = (sourceX + targetX) / 2;
      const [feedbackPath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: Math.max(1, currentOffsetX / 5),
        centerX: midX,
        centerY: sourceY - currentOffsetY,
        offset: currentOffsetX
      });
      edgePath = feedbackPath;
    } else {
      switch (edgeType) {
        case 'straight':
          edgePath = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
          break;
        case 'step': {
          const midX = (sourceX + targetX) / 2;
          
          // Use X and Y offsets for control points
          const sourceControlX = sourceX + currentOffsetX;
          const targetControlX = targetX - currentOffsetX;
          const midY = sourceY + (targetY - sourceY) / 2;
          const controlY1 = midY - currentOffsetY;
          const controlY2 = midY + currentOffsetY;
          
          edgePath = `M ${sourceX},${sourceY}
                     C ${sourceControlX},${sourceY} ${sourceControlX},${controlY1} ${midX},${midY}
                     C ${targetControlX},${controlY2} ${targetControlX},${targetY} ${targetX},${targetY}`;
          break;
        }
        case 'bezier': {
          const [bezierPath] = getBezierPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
            curvature: currentOffsetX / 100,
            offset: currentOffsetY
          });
          edgePath = bezierPath;
          break;
        }
        case 'smoothstep':
        default: {
          const [smoothPath] = getSmoothStepPath({
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition,
            borderRadius: Math.max(1, currentOffsetX / 5),
            offset: currentOffsetY
          });
          edgePath = smoothPath;
        }
      }
    }

    return (
      <>
        <path
          id={id}
          d={edgePath}
          className={`react-flow__edge-path ${isAnimated ? 'animated-edge' : ''}`}
          style={{
            ...style,
            strokeWidth: 2,
            stroke: '#64748b',
            strokeDasharray: edgeStyle === 'dashed' ? '5,5' : 
                           edgeStyle === 'dotted' ? '2,2' : 'none',
            animation: isAnimated ? 'flow 1s linear infinite' : 'none'
          }}
          markerEnd={markerEnd}
        />
        <style>
          {`
            @keyframes flow {
              from { stroke-dashoffset: 10; }
              to { stroke-dashoffset: 0; }
            }
            .animated-edge { stroke-dasharray: 5; }
          `}
        </style>
      </>
    );
  }, [connectionType, connectionStyle, edgeAnimated, offsetX, offsetY]);

  // Update edge types with new CustomEdge
  const edgeTypes = useMemo(() => ({
    custom: CustomEdge
  }), [CustomEdge]);

  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') setIsAltPressed(true);
      if (e.key === 'Shift') setIsShiftPressed(true);
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
  }, []);

  // Initialize canvas context
  useEffect(() => {
    if (drawingCanvasRef.current) {
      const canvas = drawingCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setDrawingCtx(ctx);
      }
    }
  }, []);

  // Update canvas size when window resizes
  useEffect(() => {
    const updateCanvasSize = () => {
      if (drawingCanvasRef.current && canvasRef.current) {
        const bounds = canvasRef.current.getBoundingClientRect();
        drawingCanvasRef.current.width = bounds.width;
        drawingCanvasRef.current.height = bounds.height;
      }
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: Node) => {
    if (!shape || !shape.style) return;

    const { x, y } = shape.position;
    const width = shape.style.width || 0;
    const height = shape.style.height || 0;

    // Clear previous drawing
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Set shape styles
    ctx.fillStyle = shape.data.color;
    ctx.globalAlpha = 0.5;

    // Draw based on shape type
    switch (selectedShape) {
      case 'grid': {
        const cellWidth = width / (gridConfig.x || 4);
        const cellHeight = height / (gridConfig.y || 3);
        
        for (let i = 0; i < gridConfig.x; i++) {
          for (let j = 0; j < gridConfig.y; j++) {
            ctx.fillRect(
              x + (i * cellWidth) - width / 2,
              y + (j * cellHeight) - height / 2,
              cellWidth - 2,
              cellHeight - 2
            );
          }
        }
        break;
      }
      case 'circle':
        ctx.beginPath();
        ctx.ellipse(x, y, width / 2, height / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x, y - height / 2);
        ctx.lineTo(x - width / 2, y + height / 2);
        ctx.lineTo(x + width / 2, y + height / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'hexagon': {
        ctx.beginPath();
        const a = width / 4;
        const b = height / 2;
        ctx.moveTo(x - a * 2, y);
        ctx.lineTo(x - a, y - b);
        ctx.lineTo(x + a, y - b);
        ctx.lineTo(x + a * 2, y);
        ctx.lineTo(x + a, y + b);
        ctx.lineTo(x - a, y + b);
        ctx.closePath();
        ctx.fill();
        break;
      }
      default:
        ctx.fillRect(x - width / 2, y - height / 2, width, height);
    }

    ctx.globalAlpha = 1;
  }, [selectedShape, gridConfig]);

  const getCanvasPosition = useCallback((event: React.MouseEvent) => {
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds) return null;

    // Get the current viewport state
    const viewport = getViewport();
    
    // Calculate relative mouse position to canvas
    const screenX = event.clientX - bounds.left;
    const screenY = event.clientY - bounds.top;

    // Use screenToFlowPosition instead of project
    const position = screenToFlowPosition({
      x: screenX,
      y: screenY
    });

    return position;
  }, [screenToFlowPosition, getViewport]);

  const handlePaneMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (selectedTool === 'shape') {
        const bounds = canvasRef.current?.getBoundingClientRect();
        if (!bounds) return;

        // Get exact mouse position relative to canvas
        const startX = event.clientX - bounds.left;
        const startY = event.clientY - bounds.top;

        setIsDrawingShape(true);
        setShapeStartPoint({ x: startX, y: startY });

        // Initialize canvas for drawing
        if (drawingCtx) {
          drawingCtx.clearRect(0, 0, drawingCtx.canvas.width, drawingCtx.canvas.height);
          drawingCtx.strokeStyle = COLORS[Math.floor(Math.random() * COLORS.length)];
          drawingCtx.fillStyle = drawingCtx.strokeStyle;
        }
      }
    },
    [selectedTool, drawingCtx]
  );

  const handlePaneMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isDrawingShape || !shapeStartPoint || !drawingCtx) return;

      const bounds = canvasRef.current?.getBoundingClientRect();
      if (!bounds) return;

      // Get current mouse position relative to canvas
      const currentX = event.clientX - bounds.left;
      const currentY = event.clientY - bounds.top;

      // Calculate dimensions
      let width = currentX - shapeStartPoint.x;
      let height = currentY - shapeStartPoint.y;

      // Hold shift for perfect square/circle
      if (isShiftPressed) {
        const size = Math.max(Math.abs(width), Math.abs(height));
        width = width < 0 ? -size : size;
        height = height < 0 ? -size : size;
      }

      // Clear previous drawing
      drawingCtx.clearRect(0, 0, drawingCtx.canvas.width, drawingCtx.canvas.height);
      drawingCtx.beginPath();

      // Calculate drawing coordinates
      const drawX = width > 0 ? shapeStartPoint.x : shapeStartPoint.x + width;
      const drawY = height > 0 ? shapeStartPoint.y : shapeStartPoint.y + height;
      const drawWidth = Math.abs(width);
      const drawHeight = Math.abs(height);

      // Set drawing styles
      drawingCtx.strokeStyle = drawingCtx.fillStyle;
      drawingCtx.lineWidth = 2;

      // Draw shape based on type
      switch (selectedShape) {
        case 'circle':
          const centerX = drawX + drawWidth / 2;
          const centerY = drawY + drawHeight / 2;
          const radiusX = drawWidth / 2;
          const radiusY = drawHeight / 2;
          drawingCtx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
          break;
        case 'triangle':
          drawingCtx.moveTo(drawX + drawWidth / 2, drawY);
          drawingCtx.lineTo(drawX, drawY + drawHeight);
          drawingCtx.lineTo(drawX + drawWidth, drawY + drawHeight);
          drawingCtx.closePath();
          break;
        case 'hexagon': {
          const centerX = drawX + drawWidth / 2;
          const centerY = drawY + drawHeight / 2;
          const radius = Math.min(drawWidth, drawHeight) / 2;
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3 - Math.PI / 6;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) drawingCtx.moveTo(x, y);
            else drawingCtx.lineTo(x, y);
          }
          drawingCtx.closePath();
          break;
        }
        default: // rectangle
          drawingCtx.rect(drawX, drawY, drawWidth, drawHeight);
      }

      // Fill and stroke the shape
      drawingCtx.globalAlpha = 0.5;
      drawingCtx.fill();
      drawingCtx.globalAlpha = 0.8;
      drawingCtx.stroke();
    },
    [isDrawingShape, shapeStartPoint, drawingCtx, selectedShape, isShiftPressed]
  );

  const cleanupDrawing = useCallback(() => {
    if (drawingCtx) {
      drawingCtx.clearRect(0, 0, drawingCtx.canvas.width, drawingCtx.canvas.height);
    }
    setIsDrawingShape(false);
    setShapeStartPoint(null);
  }, [drawingCtx]);

  const handlePaneMouseUp = useCallback(
    (event: React.MouseEvent) => {
      if (!isDrawingShape || !shapeStartPoint || !drawingCtx) {
        cleanupDrawing();
        return;
      }

      const bounds = canvasRef.current?.getBoundingClientRect();
      if (!bounds) {
        cleanupDrawing();
        return;
      }

      // Get current mouse position
      const currentX = event.clientX - bounds.left;
      const currentY = event.clientY - bounds.top;

      // Calculate dimensions in screen coordinates
      let width = currentX - shapeStartPoint.x;
      let height = currentY - shapeStartPoint.y;

      // Hold shift for perfect square/circle
      if (isShiftPressed) {
        const size = Math.max(Math.abs(width), Math.abs(height));
        width = width < 0 ? -size : size;
        height = height < 0 ? -size : size;
      }

      // Get the viewport state
      const viewport = getViewport();

      // Calculate the position in flow coordinates using screenToFlowPosition
      const position = screenToFlowPosition({
        x: width > 0 ? shapeStartPoint.x : shapeStartPoint.x + width,
        y: height > 0 ? shapeStartPoint.y : shapeStartPoint.y + height
      });

      // Create the final node based on shape type
      if (selectedShape === 'grid') {
        const finalNode = {
          id: `node-${Date.now()}`,
          type: 'custom',
          position,
          data: {
            label: 'Grid',
            color: drawingCtx.fillStyle.toString(),
            shape: 'grid',
            gridX: gridConfig.x,
            gridY: gridConfig.y
          },
          style: {
            width: Math.abs(width / viewport.zoom),
            height: Math.abs(height / viewport.zoom)
          }
        };

        setNodes((nds) => [...nds, finalNode]);
        setLayers((prevLayers) => prevLayers.map(layer => 
          layer.id === activeLayer 
            ? { ...layer, nodes: [...layer.nodes, finalNode.id] }
            : layer
        ));
      } else {
        const finalNode = {
          id: `node-${Date.now()}`,
          type: 'custom',
          position,
          data: {
            label: `${selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1)}`,
            color: drawingCtx.fillStyle.toString(),
            shape: selectedShape
          },
          style: {
            width: Math.abs(width / viewport.zoom),
            height: Math.abs(height / viewport.zoom)
          }
        };

        setNodes((nds) => [...nds, finalNode]);
        setLayers((prevLayers) => prevLayers.map(layer => 
          layer.id === activeLayer 
            ? { ...layer, nodes: [...layer.nodes, finalNode.id] }
            : layer
        ));
      }
      
      // Clear the canvas and reset drawing state
      cleanupDrawing();
    },
    [isDrawingShape, shapeStartPoint, drawingCtx, selectedShape, activeLayer, gridConfig, isShiftPressed, cleanupDrawing, getViewport, screenToFlowPosition]
  );

  const addLayer = () => {
    const newLayer: Layer = {
      id: String(layers.length + 1),
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
      nodes: []
    };
    setLayers([...layers, newLayer]);
    setActiveLayer(newLayer.id);
  };

  const toggleLayerVisibility = (id: string) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleLayerLock = (id: string) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  const deleteLayer = (id: string) => {
    if (layers.length === 1) return;
    setLayers(layers.filter(layer => layer.id !== id));
    if (activeLayer === id) {
      setActiveLayer(layers[0].id);
    }
  };

  // Update node handling
  const addNode = useCallback(() => {
    const newNode = {
      id: `node-${nodes.length + 1}`,
      type: 'custom',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: 'New Block',
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: 'rectangle'
      }
    };
    setNodes((nds) => [...nds, newNode]);
    // Add node to active layer
    setLayers((prevLayers) => prevLayers.map(layer => 
      layer.id === activeLayer 
        ? { ...layer, nodes: [...layer.nodes, newNode.id] }
        : layer
    ));
  }, [nodes, activeLayer, setNodes, setLayers]);

  // Add drag n drop behavior
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `node-${nodes.length + 1}`,
        type: 'custom',
        position,
        data: {
          label: 'New Block',
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: 'rectangle'
        }
      };

      setNodes((nds) => [...nds, newNode]);
      setLayers((prevLayers) => prevLayers.map(layer => 
        layer.id === activeLayer 
          ? { ...layer, nodes: [...layer.nodes, newNode.id] }
          : layer
      ));
    },
    [nodes, activeLayer, setNodes, setLayers]
  );

  // Add useEffect to cleanup when tool changes
  useEffect(() => {
    cleanupDrawing();
  }, [selectedTool, cleanupDrawing]);

  // Update edge settings panel to be contextual
  const EdgeSettingsPanel = ({ edge }: { edge: Edge }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleSliderPointerDown = (e: React.PointerEvent, updateFn: (value: number) => void) => {
      const slider = e.currentTarget;
      const startDrag = (e: PointerEvent) => {
        const rect = slider.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        const value = Math.round(percentage * 200); // max value is 200
        updateFn(value);
      };

      const stopDrag = () => {
        setIsDragging(false);
        document.removeEventListener('pointermove', startDrag);
        document.removeEventListener('pointerup', stopDrag);
      };

      setIsDragging(true);
      document.addEventListener('pointermove', startDrag);
      document.addEventListener('pointerup', stopDrag);
      startDrag(e.nativeEvent);
    };

    const updateEdgeOffset = (type: 'offsetX' | 'offsetY', value: number) => {
      setEdges(eds => eds.map(ed => 
        ed.id === edge.id ? { ...ed, data: { ...ed.data, [type]: value }} : ed
      ));
      setEdgeSettings(prev => ({ ...prev, [type]: value }));
    };

    return (
      <div className="absolute z-50 bg-navy-800/95 p-4 rounded-lg shadow-xl backdrop-blur-sm border border-navy-700/50 min-w-[280px]"
           style={{
             left: '50%',
             top: '20%',
             transform: 'translate(-50%, -50%)'
           }}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-white font-medium text-sm">Edge Settings</h3>
            <button
              onClick={() => setSelectedEdge(null)}
              className="p-1 hover:bg-navy-700/50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-gray-300 min-w-[60px]">Type:</label>
              <select 
                value={edge.data?.connectionType || edgeSettings.connectionType}
                onChange={(e) => {
                  const newType = e.target.value as ConnectionType;
                  setEdges(eds => eds.map(ed => 
                    ed.id === edge.id ? { ...ed, data: { ...ed.data, connectionType: newType }} : ed
                  ));
                  setEdgeSettings(prev => ({ ...prev, connectionType: newType }));
                }}
                className="flex-1 bg-navy-700 text-white text-sm rounded px-2 py-1.5 border border-navy-600"
              >
                {CONNECTION_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-gray-300 min-w-[60px]">Style:</label>
              <select
                value={edge.data?.connectionStyle || edgeSettings.connectionStyle}
                onChange={(e) => {
                  const newStyle = e.target.value as ConnectionStyle;
                  setEdges(eds => eds.map(ed => 
                    ed.id === edge.id ? { ...ed, data: { ...ed.data, connectionStyle: newStyle }} : ed
                  ));
                  setEdgeSettings(prev => ({ ...prev, connectionStyle: newStyle }));
                }}
                className="flex-1 bg-navy-700 text-white text-sm rounded px-2 py-1.5 border border-navy-600"
              >
                {CONNECTION_STYLES.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-gray-300 min-w-[60px]">Animated:</label>
              <div className="flex-1 flex justify-end">
                <input
                  type="checkbox"
                  checked={edge.data?.animated || edgeSettings.edgeAnimated}
                  onChange={(e) => {
                    setEdges(eds => eds.map(ed => 
                      ed.id === edge.id ? { ...ed, data: { ...ed.data, animated: e.target.checked }} : ed
                    ));
                    setEdgeSettings(prev => ({ ...prev, edgeAnimated: e.target.checked }));
                  }}
                  className="rounded border-navy-600 bg-navy-700 checked:bg-primary-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">X Offset:</label>
                <span className="text-sm text-gray-300 tabular-nums">{edge.data?.offsetX || edgeSettings.offsetX}</span>
              </div>
              <div 
                className={`relative h-1.5 bg-navy-700 rounded-lg cursor-pointer ${isDragging ? 'cursor-grabbing' : ''}`}
                onPointerDown={(e) => handleSliderPointerDown(e, (value) => updateEdgeOffset('offsetX', value))}
              >
                <div 
                  className="absolute h-full bg-primary-500 rounded-lg"
                  style={{ width: `${((edge.data?.offsetX || edgeSettings.offsetX) / 200) * 100}%` }}
                />
                <div 
                  className="absolute w-3 h-3 bg-white rounded-full shadow-lg -translate-y-1/4 -translate-x-1/2 hover:scale-110 transition-transform"
                  style={{ left: `${((edge.data?.offsetX || edgeSettings.offsetX) / 200) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">Y Offset:</label>
                <span className="text-sm text-gray-300 tabular-nums">{edge.data?.offsetY || edgeSettings.offsetY}</span>
              </div>
              <div 
                className={`relative h-1.5 bg-navy-700 rounded-lg cursor-pointer ${isDragging ? 'cursor-grabbing' : ''}`}
                onPointerDown={(e) => handleSliderPointerDown(e, (value) => updateEdgeOffset('offsetY', value))}
              >
                <div 
                  className="absolute h-full bg-primary-500 rounded-lg"
                  style={{ width: `${((edge.data?.offsetY || edgeSettings.offsetY) / 200) * 100}%` }}
                />
                <div 
                  className="absolute w-3 h-3 bg-white rounded-full shadow-lg -translate-y-1/4 -translate-x-1/2 hover:scale-110 transition-transform"
                  style={{ left: `${((edge.data?.offsetY || edgeSettings.offsetY) / 200) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add AI architecture generation handler
  const handleGenerateArchitecture = async () => {
    if (!aiInput?.trim() && !selectedAiImage) {
      toast.error('Please provide a text description or upload an image');
      return;
    }

    if (!geminiKey) {
      toast.error('Please add your Gemini API key in settings first');
      return;
    }

    setIsGenerating(true);
    try {
      let finalDescription = aiInput?.trim() || '';
      
      // If we have an image but no description, generate one first
      if (selectedAiImage && !finalDescription) {
        toast.loading('Analyzing architecture from image...');
        const description = await generateArchitectureDescription(
          selectedAiImage,
          geminiKey,
          selectedModel
        );
        if (description) {
          finalDescription = description;
          setAiInput(description);
          toast.success('Architecture description generated from image');
        }
      }

      // Now generate the architecture using the description
      const architecture = await generateArchitecture(
        finalDescription,
        selectedAiImage || undefined,
        geminiKey,
        selectedModel
      );
      
      if (!architecture?.nodes || !architecture?.edges) {
        throw new Error('Invalid architecture response');
      }
      
      // Update nodes and edges with the generated architecture
      setNodes(architecture.nodes);
      setEdges(architecture.edges);

      // Add nodes to active layer
      setLayers((prevLayers) => prevLayers.map(layer => 
        layer.id === activeLayer 
          ? { ...layer, nodes: architecture.nodes.map(node => node.id) }
          : layer
      ));

      setShowAIPanel(false);
      toast.success('Architecture generated successfully');
    } catch (error) {
      console.error('Error generating architecture:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate architecture');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (PNG, JPG, JPEG)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      // Create an image element to get dimensions
      const img = new Image();
      img.onload = async () => {
        // Check if image dimensions are reasonable
        if (img.width < 100 || img.height < 100) {
          toast.error('Image dimensions are too small. Please use a larger image.');
          return;
        }

        try {
          // Process successful, set the image
          setSelectedAiImage(reader.result as string);
          toast.success('Image uploaded successfully');

          // Generate description from image if we have a Gemini key
          if (geminiKey && AVAILABLE_MODELS[selectedModel].supportsImages) {
            toast.loading('Analyzing architecture from image...');
            const description = await generateArchitectureDescription(
              reader.result as string,
              geminiKey,
              selectedModel
            );
            if (description) {
              setAiInput(description);
              toast.success('Architecture description generated from image');
            }
          }
        } catch (error) {
          console.error('Error processing image:', error);
          toast.error('Failed to analyze image');
        }
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedAiImage = () => {
    setSelectedAiImage(null);
    if (aiImageInputRef.current) {
      aiImageInputRef.current.value = '';
    }
  };

  // Add AI Panel component
  const AIPanel = () => (
    <Panel position="top-center" className="w-[600px] mt-16">
      <div 
        className="bg-[#2a2a2a] rounded-xl shadow-lg backdrop-blur-lg border border-[#3a3a3a] p-4"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium text-white">AI Architecture Generation</h3>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModelDropdown(!showModelDropdown);
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-[#1a1a1a] hover:bg-[#3a3a3a] text-white transition-colors"
              >
                {AVAILABLE_MODELS[selectedModel].name}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showModelDropdown && (
                <div 
                  className="absolute top-full left-0 mt-1 w-64 bg-[#2a2a2a] rounded-lg shadow-xl border border-[#3a3a3a] py-1 z-[60]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {Object.entries(AVAILABLE_MODELS).map(([id, config]) => (
                    <button
                      key={id}
                      onClick={() => {
                        setSelectedModel(id as ModelId);
                        setShowModelDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-[#3a3a3a] text-white text-left ${
                        selectedModel === id ? 'bg-[#3a3a3a]' : ''
                      }`}
                    >
                      <div>
                        <div className="font-medium">{config.name}</div>
                        <div className="text-xs text-gray-400">
                          {config.type === 'gemini' ? 'Google Gemini' : 'Azure OpenAI'}
                        </div>
                      </div>
                      {config.supportsImages && (
                        <ImageIcon className="w-4 h-4 text-gray-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setShowAIPanel(false);
              setAiInput('');
              setSelectedAiImage(null);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-[#3a3a3a] hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe your architecture
            </label>
            <div 
              className="relative"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <textarea
                value={aiInput}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAiInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
                placeholder={`Example: Create a CNN architecture for medical image segmentation with:
- Input layer for 3D medical images
- Multiple convolutional blocks with skip connections
- Decoder path with upsampling
- Output layer for segmentation masks`}
                className="w-full h-40 p-3 rounded-lg bg-[#1a1a1a] text-white border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-500 text-sm resize-none"
                disabled={isGenerating}
                spellCheck="false"
                autoComplete="off"
              />
              {aiInput && (
                <button
                  onClick={() => setAiInput('')}
                  className="absolute top-2 right-2 p-1 hover:bg-[#3a3a3a] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              {selectedAiImage ? (
                <div className="relative group">
                  <div className="relative w-full h-[200px] rounded-lg overflow-hidden border-2 border-dashed border-[#3a3a3a] bg-[#1a1a1a]">
                    <img 
                      src={selectedAiImage} 
                      alt="Selected" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={removeSelectedAiImage}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => aiImageInputRef.current?.click()}
                        className="p-2 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] transition-colors"
                        title="Replace Image"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Tip: For best results, use clear diagrams or sketches of neural network architectures
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAiImageUpload}
                    ref={aiImageInputRef}
                    className="hidden"
                    disabled={isGenerating || !AVAILABLE_MODELS[selectedModel].supportsImages}
                  />
                  <div 
                    onClick={() => !isGenerating && AVAILABLE_MODELS[selectedModel].supportsImages && aiImageInputRef.current?.click()}
                    onDragOver={handlePaneMouseMove}
                    onDrop={handlePaneMouseMove}
                    className={`
                      relative w-full h-[200px] rounded-lg border-2 border-dashed 
                      ${AVAILABLE_MODELS[selectedModel].supportsImages 
                        ? 'border-[#3a3a3a] hover:border-primary-500 cursor-pointer' 
                        : 'border-[#3a3a3a]/50 cursor-not-allowed'
                      }
                      bg-[#1a1a1a] transition-colors
                      flex flex-col items-center justify-center gap-3 p-4
                    `}
                  >
                    <div className={`
                      p-3 rounded-full 
                      ${AVAILABLE_MODELS[selectedModel].supportsImages 
                        ? 'bg-[#3a3a3a]' 
                        : 'bg-[#3a3a3a]/50'
                      }
                    `}>
                      <ImageIcon className={`
                        w-6 h-6 
                        ${AVAILABLE_MODELS[selectedModel].supportsImages 
                          ? 'text-white' 
                          : 'text-gray-500'
                        }
                      `} />
                    </div>
                    <div className="text-center">
                      <div className={`
                        font-medium mb-1
                        ${AVAILABLE_MODELS[selectedModel].supportsImages 
                          ? 'text-white' 
                          : 'text-gray-500'
                        }
                      `}>
                        {AVAILABLE_MODELS[selectedModel].supportsImages 
                          ? 'Upload Architecture Image' 
                          : 'Image Input Not Supported'
                        }
                      </div>
                      {AVAILABLE_MODELS[selectedModel].supportsImages && (
                        <div className="text-sm text-gray-400">
                          Drag and drop or click to upload
                        </div>
                      )}
                    </div>
                  </div>
                  {AVAILABLE_MODELS[selectedModel].supportsImages && (
                    <div className="mt-2 text-sm text-gray-400">
                      Supported formats: PNG, JPG, JPEG (max 5MB)
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleGenerateArchitecture}
              disabled={isGenerating || (!aiInput.trim() && !selectedAiImage)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg transition-colors
                ${isGenerating || (!aiInput.trim() && !selectedAiImage)
                  ? 'bg-primary-500/50 text-white/50 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white/100 rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Architecture
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Panel>
  );

  // Add project management panel
  const ProjectPanel = () => (
    <Panel position="top-left" className="ml-16 mt-16">
      <div className="bg-navy-800/95 p-4 rounded-lg shadow-xl backdrop-blur-sm border border-navy-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-200">Projects</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProjectModal(true)}
              className="p-1 hover:bg-navy-700 rounded-lg transition-colors"
              title="Create Project"
            >
              <FolderPlus className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={saveProject}
              className="p-1 hover:bg-navy-700 rounded-lg transition-colors"
              title="Save Project"
            >
              <Save className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`
                flex items-center p-2 rounded-lg transition-colors cursor-pointer
                ${currentProject?.id === project.id ? 'bg-primary-500/20' : 'hover:bg-navy-700'}
              `}
              onClick={() => switchProject(project)}
            >
              <Folder className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-300 flex-1">
                {project.name}
              </span>
              {projects.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(project.id);
                  }}
                  className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );

  // Add project creation modal
  const ProjectModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-navy-800 p-6 rounded-lg shadow-xl w-[400px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Create New Project</h3>
          <button
            onClick={() => setShowProjectModal(false)}
            className="p-1 hover:bg-navy-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full p-2 rounded-lg bg-navy-700 text-white border border-navy-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              className="w-full p-2 rounded-lg bg-navy-700 text-white border border-navy-600 focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none"
              placeholder="Enter project description"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setShowProjectModal(false)}
              className="px-4 py-2 rounded-lg bg-navy-700 text-white hover:bg-navy-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createProject}
              className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add text handling functions in Flow component
  const handleAddText = useCallback((event: React.MouseEvent) => {
    if (selectedTool !== 'text' || !canvasRef.current) return;
    
    // Check if the click target is a button or UI element
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('.react-flow__panel')) {
      return;
    }
    
    const bounds = canvasRef.current.getBoundingClientRect();
    const position = screenToFlowPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top
    });

    const newNode = {
      id: `text-${Date.now()}`,
      type: 'text',
      position,
      data: {
        label: 'Double click to edit',
        color: '#ffffff',
        fontSize: 16
      },
      style: {
        width: 'auto',
        height: 'auto',
        padding: '4px',
        background: 'transparent',
        border: 'none'
      },
      draggable: true,
      connectable: false,
    };

    setNodes((nds) => [...nds, newNode]);
    setLayers((prevLayers) => prevLayers.map(layer => 
      layer.id === activeLayer 
        ? { ...layer, nodes: [...layer.nodes, newNode.id] }
        : layer
    ));
  }, [selectedTool, screenToFlowPosition, activeLayer]);

  // Add GridConfigPanel component
  const GridConfigPanel = () => (
    <Panel position="top" className="left-1/2 transform -translate-x-1/2 mt-16">
      <div className="bg-[#2a2a2a] rounded-xl shadow-lg backdrop-blur-lg border border-[#3a3a3a] p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-200">Grid Configuration</h3>
            <button
              onClick={() => {
                setShowGridConfig(false);
                setSelectedShape('rectangle');
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-[#3a3a3a] hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">X-axis Squares</label>
              <input
                type="number"
                min="1"
                max="10"
                value={gridConfig.x}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                  setGridConfig(prev => ({ ...prev, x: value }));
                }}
                className="w-20 p-2 rounded-lg bg-[#1a1a1a] text-white border border-[#3a3a3a]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Y-axis Squares</label>
              <input
                type="number"
                min="1"
                max="10"
                value={gridConfig.y}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                  setGridConfig(prev => ({ ...prev, y: value }));
                }}
                className="w-20 p-2 rounded-lg bg-[#1a1a1a] text-white border border-[#3a3a3a]"
              />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );

  // Replace the style jsx tag with a styled component
  const styles = {
    '@keyframes flow': {
      '0%': {
        strokeDashoffset: 20,
      },
      '100%': {
        strokeDashoffset: 0,
      }
    }
  };

  // Move nodeTypes inside the component and memoize it here
  const nodeTypes = useMemo(() => ({
    custom: CustomNode,
    text: TextNode
  }), []);

  return (
    <div 
      ref={canvasRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      onMouseDown={handlePaneMouseDown}
      onMouseMove={handlePaneMouseMove}
      onMouseUp={handlePaneMouseUp}
      onClick={handleAddText}
      className="bg-[#1a1a1a]"
    >
      <ReactFlow
        nodes={nodes.filter(node => {
          const layer = layers.find(l => l.nodes.includes(node.id));
          return layer?.visible !== false && !node.data?.isTemp;
        })}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onEdgeClick={(_, edge) => setSelectedEdge(edge)}
        onPaneClick={handleAddText}
        defaultEdgeOptions={{
          type: 'custom',
          markerEnd: { type: MarkerType.ArrowClosed }
        }}
        connectionMode="loose"
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode={['Backspace', 'Delete']}
        selectionKeyCode={['Shift']}
        multiSelectionKeyCode={['Control', 'Meta']}
        className="bg-[#1a1a1a]"
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        panOnScroll={selectedTool === 'hand'}
        panOnDrag={selectedTool === 'hand'}
        selectionMode={selectedTool === 'select' ? undefined : 'none'}
        nodesDraggable={selectedTool === 'select'}
        nodesConnectable={selectedTool === 'connect'}
      >
        {selectedEdge && <EdgeSettingsPanel edge={selectedEdge} />}
        {showAIPanel && <AIPanel />}
        <Background color="#333" gap={16} size={1} />
        <Controls showInteractive={false} />
        <MiniMap 
          style={{
            backgroundColor: '#2a2a2a',
            border: '1px solid #3a3a3a',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          nodeColor={(n) => {
            const node = nodes.find(node => node.id === n.id);
            return node?.data?.color || '#666';
          }}
        />
        
        {/* Main Toolbar */}
        <Panel position="top" className="left-1/2 transform -translate-x-1/2 mt-2">
          <div className="bg-[#2a2a2a] rounded-xl shadow-lg backdrop-blur-lg border border-[#3a3a3a] p-1.5">
            <div className="flex items-center gap-1">
              {/* Left Tools Group */}
              <div className="flex items-center gap-1 pr-2 border-r border-[#3a3a3a]">
                <button
                  onClick={() => setSelectedTool('select')}
                  className={`p-2 rounded-lg ${
                    selectedTool === 'select' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                  } transition-all`}
                  title="Select (V)"
                >
                  <MousePointer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedTool('hand')}
                  className={`p-2 rounded-lg ${
                    selectedTool === 'hand' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                  } transition-all`}
                  title="Hand Tool (H)"
                >
                  <Hand className="w-4 h-4" />
                </button>
              </div>

              {/* Center Tools Group */}
              <div className="flex items-center gap-1 px-2 border-r border-[#3a3a3a]">
                <button
                  onClick={() => setSelectedTool('connect')}
                  className={`p-2 rounded-lg ${
                    selectedTool === 'connect' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                  } transition-all`}
                  title="Connect Nodes (C)"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedTool('shape')}
                  className={`p-2 rounded-lg ${
                    selectedTool === 'shape' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                  } transition-all`}
                  title="Shapes (S)"
                >
                  <Square className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedTool('text')}
                  className={`p-2 rounded-lg ${
                    selectedTool === 'text' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                  } transition-all`}
                  title="Text (T)"
                >
                  <Type className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedTool('draw')}
                  className={`p-2 rounded-lg ${
                    selectedTool === 'draw' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                  } transition-all`}
                  title="Draw (B)"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              {/* Right Tools Group */}
              <div className="flex items-center gap-1 pl-2">
                <button
                  onClick={() => setShowAIPanel(true)}
                  className="p-2 rounded-lg text-gray-300 hover:bg-[#3a3a3a] hover:text-white transition-all"
                  title="AI Architecture Generation"
                >
                  <Wand2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Panel>

        {/* Shape Selection Floating Panel */}
        {selectedTool === 'shape' && (
          <Panel position="top" className="left-1/2 transform -translate-x-1/2 mt-16">
            <div className="bg-[#2a2a2a] rounded-xl shadow-lg backdrop-blur-lg border border-[#3a3a3a] p-1.5">
              <div className="flex items-center gap-1">
                {SHAPES.map((shape) => (
                  <button
                    key={shape.value}
                    onClick={() => {
                      setSelectedShape(shape.value);
                      if (shape.value === 'grid') {
                        setShowGridConfig(true);
                      } else {
                        setShowGridConfig(false);
                      }
                    }}
                    className={`p-2 rounded-lg ${
                      selectedShape === shape.value 
                        ? 'bg-primary-500 text-white' 
                        : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                    } transition-all`}
                    title={shape.label}
                  >
                    <shape.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </Panel>
        )}

        {showGridConfig && <GridConfigPanel />}

        {/* Left Sidebar - Projects */}
        <Panel position="top-left" className="m-2">
          <div className="bg-[#2a2a2a] rounded-xl shadow-lg backdrop-blur-lg border border-[#3a3a3a] w-64">
            <div className="p-3 border-b border-[#3a3a3a]">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-200">Projects</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-[#3a3a3a] hover:text-white transition-all"
                    title="Create Project"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={saveProject}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-[#3a3a3a] hover:text-white transition-all"
                    title="Save Project"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`
                    flex items-center p-2 rounded-lg transition-all cursor-pointer
                    ${currentProject?.id === project.id 
                      ? 'bg-primary-500/20 text-white' 
                      : 'text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                    }
                  `}
                  onClick={() => switchProject(project)}
                >
                  <Folder className="w-4 h-4 mr-2 opacity-80" />
                  <span className="text-sm flex-1">
                    {project.name}
                  </span>
                  {projects.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Right Controls */}
        <Panel position="top-right" className="m-2">
          <div className="flex flex-col gap-2">
            <div className="bg-[#2a2a2a] rounded-xl shadow-lg backdrop-blur-lg border border-[#3a3a3a] p-1.5">
              <div className="flex items-center gap-1">
                <button
                  onClick={addNode}
                  className="p-2 rounded-lg text-gray-300 hover:bg-[#3a3a3a] hover:text-white transition-all"
                  title="Add Node"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-[#3a3a3a]" />
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="p-2 rounded-lg text-gray-300 hover:bg-[#3a3a3a] hover:text-white transition-all"
                  title="Create New Project"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowLayersPanel(!showLayersPanel)}
                  className={`p-2 rounded-lg transition-all ${
                    showLayersPanel 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                  }`}
                  title="Toggle Layers Panel"
                >
                  <SplitSquareVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Panel>

        {/* Layers Panel */}
        {showLayersPanel && (
          <Panel position="right" className="h-full mr-2 mt-16">
            <div className="bg-[#2a2a2a] rounded-xl shadow-lg backdrop-blur-lg border border-[#3a3a3a] w-64">
              <div className="p-3 border-b border-[#3a3a3a]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-200">Layers</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={addLayer}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-[#3a3a3a] hover:text-white transition-all"
                      title="Add Layer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowLayersPanel(false)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-[#3a3a3a] hover:text-white transition-all"
                      title="Close Layers Panel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className={`
                      group flex items-center p-2 rounded-lg transition-all cursor-pointer
                      ${activeLayer === layer.id 
                        ? 'bg-primary-500/20 text-white' 
                        : 'text-gray-400 hover:bg-[#3a3a3a] hover:text-white'
                      }
                    `}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerVisibility(layer.id);
                        }}
                        className="p-1 rounded-lg hover:bg-[#3a3a3a] transition-all"
                        title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                      >
                        {layer.visible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerLock(layer.id);
                        }}
                        className="p-1 rounded-lg hover:bg-[#3a3a3a] transition-all"
                        title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                      >
                        {layer.locked ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <Unlock className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    
                    <span className="ml-2 text-sm flex-1">
                      {layer.name}
                      <span className="ml-1 opacity-50">
                        ({layer.nodes.length})
                      </span>
                    </span>
                    
                    {layers.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLayer(layer.id);
                        }}
                        className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
      
      {/* Drawing canvas overlay */}
      <canvas
        ref={drawingCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 1000
        }}
      />

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-xl shadow-xl w-[400px] border border-[#3a3a3a]">
            <div className="p-4 border-b border-[#3a3a3a]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Create New Project</h3>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-[#3a3a3a] hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none transition-all"
                  placeholder="Enter project description"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#3a3a3a] flex justify-end gap-2">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-[#3a3a3a] hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-all"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DeepLearningFlowPage() {
  return (
    <div className="w-full h-screen bg-navy-900">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
} 