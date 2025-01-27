import React from 'react';
import { Eye, EyeOff, Lock, Unlock, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  shapes: string[];
}

interface LayerPanelProps {
  layers: Layer[];
  activeLayer: string;
  onLayerAdd: () => void;
  onLayerDelete: (id: string) => void;
  onLayerVisibilityToggle: (id: string) => void;
  onLayerLockToggle: (id: string) => void;
  onLayerSelect: (id: string) => void;
  onLayerMove: (id: string, direction: 'up' | 'down') => void;
}

export function LayerPanel({
  layers,
  activeLayer,
  onLayerAdd,
  onLayerDelete,
  onLayerVisibilityToggle,
  onLayerLockToggle,
  onLayerSelect,
  onLayerMove
}: LayerPanelProps) {
  return (
    <div className="w-64 bg-navy-900/95 border-l border-navy-700/50 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-200">Layers</h3>
        <button
          onClick={onLayerAdd}
          className="p-1 hover:bg-navy-800 rounded-lg transition-colors"
          title="Add Layer"
        >
          <Plus className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      <div className="space-y-1">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`
              flex items-center p-2 rounded-lg transition-colors cursor-pointer
              ${activeLayer === layer.id ? 'bg-primary-500/20' : 'hover:bg-navy-800'}
            `}
            onClick={() => onLayerSelect(layer.id)}
          >
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerVisibilityToggle(layer.id);
                }}
                className="p-1 hover:bg-navy-700 rounded-lg transition-colors"
                title={layer.visible ? 'Hide Layer' : 'Show Layer'}
              >
                {layer.visible ? (
                  <Eye className="w-3 h-3 text-gray-400" />
                ) : (
                  <EyeOff className="w-3 h-3 text-gray-400" />
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerLockToggle(layer.id);
                }}
                className="p-1 hover:bg-navy-700 rounded-lg transition-colors"
                title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
              >
                {layer.locked ? (
                  <Lock className="w-3 h-3 text-gray-400" />
                ) : (
                  <Unlock className="w-3 h-3 text-gray-400" />
                )}
              </button>
            </div>
            
            <span className="ml-2 text-sm text-gray-300 flex-1">{layer.name}</span>
            
            <div className="flex items-center gap-1">
              {index > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerMove(layer.id, 'up');
                  }}
                  className="p-1 hover:bg-navy-700 rounded-lg transition-colors"
                  title="Move Up"
                >
                  <ChevronUp className="w-3 h-3 text-gray-400" />
                </button>
              )}
              
              {index < layers.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerMove(layer.id, 'down');
                  }}
                  className="p-1 hover:bg-navy-700 rounded-lg transition-colors"
                  title="Move Down"
                >
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerDelete(layer.id);
                }}
                className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                title="Delete Layer"
              >
                <Trash2 className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 