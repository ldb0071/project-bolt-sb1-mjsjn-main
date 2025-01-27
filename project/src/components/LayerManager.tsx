import React from 'react';
import { Eye, EyeOff, Lock, Unlock, Plus, Trash2 } from 'lucide-react';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  nodes: string[];
}

interface LayerManagerProps {
  layers: Layer[];
  activeLayer: string;
  onLayerAdd: () => void;
  onLayerDelete: (id: string) => void;
  onLayerVisibilityToggle: (id: string) => void;
  onLayerLockToggle: (id: string) => void;
  onLayerSelect: (id: string) => void;
}

export function LayerManager({
  layers,
  activeLayer,
  onLayerAdd,
  onLayerDelete,
  onLayerVisibilityToggle,
  onLayerLockToggle,
  onLayerSelect,
}: LayerManagerProps) {
  return (
    <div className="w-64 bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-200">Layers</h3>
        <button onClick={onLayerAdd}>
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`flex items-center p-2 rounded ${
              activeLayer === layer.id ? 'bg-blue-500/20' : ''
            }`}
            onClick={() => onLayerSelect(layer.id)}
          >
            <button onClick={() => onLayerVisibilityToggle(layer.id)}>
              {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button onClick={() => onLayerLockToggle(layer.id)}>
              {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
            <span className="ml-2 text-sm">{layer.name}</span>
            {layers.length > 1 && (
              <button onClick={() => onLayerDelete(layer.id)} className="ml-auto">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 