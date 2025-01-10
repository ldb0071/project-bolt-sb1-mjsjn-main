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
import { getEmbeddingsVisualization } from '../services/apiClient';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

/**
 * Represents a point in the 2D embedding space
 */
interface Point {
  x: number;
  y: number;
  id: number;
}

/**
 * Metadata for each embedding point
 */
interface Label {
  id: number;
  source: string;
  chunk_id: number;
  preview: string;
}

/**
 * API response type for embedding visualization data
 */
interface EmbeddingVisualizationResponse {
  points: Point[];
  labels: Label[];
}

interface EmbeddingVisualizationProps {
  projectName: string;
}

const EmbeddingVisualization: React.FC<EmbeddingVisualizationProps> = ({ projectName }) => {
  // State management
  const [points, setPoints] = useState<Point[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Label | null>(null);

  /**
   * Load visualization data on component mount or project change
   * Fetches embedding data from the backend and updates state
   */
  useEffect(() => {
    const loadVisualization = async () => {
      try {
        setLoading(true);
        const data = await getEmbeddingsVisualization(projectName) as EmbeddingVisualizationResponse;
        setPoints(data.points);
        setLabels(data.labels);
        setError(null);
      } catch (err) {
        setError('Failed to load embedding visualization');
        console.error('Error loading visualization:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVisualization();
  }, [projectName]);

  /**
   * Chart.js data configuration
   * Sets up the scatter plot with embedding points
   */
  const chartData = {
    datasets: [
      {
        label: 'Document Embeddings',
        data: points,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  /**
   * Chart.js options configuration
   * Configures scales, tooltips, and click handlers
   */
  const options = {
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear' as const,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const pointIndex = context.dataIndex;
            const label = labels[pointIndex];
            return label ? `${label.source} (Chunk ${label.chunk_id})` : '';
          },
        },
      },
    },
    onClick: (_event: any, elements: any[]) => {
      if (elements.length > 0) {
        const pointIndex = elements[0].index;
        setSelectedPoint(labels[pointIndex]);
      }
    },
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Scatter Plot Container */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Document Embedding Visualization</h3>
        <div className="h-[400px]">
          <Scatter data={chartData} options={options} />
        </div>
      </div>

      {/* Selected Point Details */}
      {selectedPoint && (
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-semibold mb-2">Selected Document</h4>
          <p className="text-sm text-gray-600 mb-1">
            Source: {selectedPoint.source}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Chunk: {selectedPoint.chunk_id}
          </p>
          <div className="text-sm bg-gray-50 p-2 rounded">
            <p className="font-mono">{selectedPoint.preview}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmbeddingVisualization; 