/**
 * Embedding Visualization Component
 * 
 * This component visualizes document embeddings in a 2D scatter plot using Chart.js.
 * It shows the relationships between different document chunks based on their vector embeddings.
 * 
 * Features:
 * - Interactive scatter plot
 * - Point selection and preview
 * - Loading and error states
 * 
 * Related Components:
 * - RAGChat: Uses this visualization for document context
 * - RAGChatPage: Parent component
 * 
 * Dependencies:
 * - Chart.js for visualization
 * - apiClient for data fetching
 */

import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { getEmbeddingsVisualization } from '../services/apiClient';

interface EmbeddingVisualizationProps {
  projectName: string;
}

export default function EmbeddingVisualization({ projectName }: EmbeddingVisualizationProps) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getEmbeddingsVisualization(projectName);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load embeddings');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectName]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        Loading embeddings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  if (!data || !data.points || data.points.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        No embeddings found for this project
      </div>
    );
  }

  const plotData = [{
    x: data.points.map((p: any) => p.x),
    y: data.points.map((p: any) => p.y),
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 8,
      color: data.points.map((_: any, i: number) => i),
      colorscale: 'Viridis',
      showscale: true,
      colorbar: {
        title: 'Document Order',
        titleside: 'right'
      }
    },
    hoverinfo: 'text',
    text: data.labels.map((l: any) => 
      `Source: ${l.source}\n${l.preview.substring(0, 100)}...`
    )
  }];

  const layout = {
    title: 'Document Embeddings Visualization',
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(2,6,23,1)',
    font: {
      color: '#fff'
    },
    autosize: true,
    margin: {
      l: 50,
      r: 50,
      t: 50,
      b: 50
    },
    showlegend: false,
    xaxis: {
      title: 'Dimension 1',
      gridcolor: 'rgba(255,255,255,0.1)',
      zerolinecolor: 'rgba(255,255,255,0.1)'
    },
    yaxis: {
      title: 'Dimension 2',
      gridcolor: 'rgba(255,255,255,0.1)',
      zerolinecolor: 'rgba(255,255,255,0.1)'
    }
  };

  return (
    <div className="w-full h-full">
      <Plot
        data={plotData}
        layout={layout}
        config={{ responsive: true }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  );
} 