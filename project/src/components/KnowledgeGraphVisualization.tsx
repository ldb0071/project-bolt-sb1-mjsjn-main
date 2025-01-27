import React, { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getKnowledgeGraphVisualization } from '../services/apiClient';

interface KnowledgeGraphVisualizationProps {
  projectName: string;
}

interface GraphData {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    color?: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    relationship: string;
  }>;
}

export default function KnowledgeGraphVisualization({ projectName }: KnowledgeGraphVisualizationProps) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const data = await getKnowledgeGraphVisualization(projectName);
        setGraphData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load graph data');
        console.error('Error fetching graph data:', err);
      }
    };

    fetchGraphData();
  }, [projectName]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400 text-center">
          <p>Error loading graph visualization:</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!graphData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-primary-400">Loading graph data...</div>
      </div>
    );
  }

  const nodeColors = {
    document: '#4CAF50',  // Green
    citation: '#2196F3',  // Blue
    concept: '#FF9800',   // Orange
  };

  return (
    <div className="w-full h-full">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={(node: any) => `${node.type}: ${node.label}`}
        nodeColor={(node: any) => nodeColors[node.type as keyof typeof nodeColors] || '#9C27B0'}
        linkLabel={(link: any) => link.relationship}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.25}
        backgroundColor="#0F172A"  // navy-900
        nodeRelSize={6}
        linkWidth={1}
        linkColor={() => '#64748B'}  // gray-500
        onNodeClick={(node: any) => {
          console.log('Clicked node:', node);
        }}
      />
    </div>
  );
} 