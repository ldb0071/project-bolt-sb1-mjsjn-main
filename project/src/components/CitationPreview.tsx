import React, { useState } from 'react';
import PDFViewer from './PDFViewer';

interface CitationProps {
  score: number;
  page: number;
  snippet: string;
  documentId: string;
}

const CitationPreview: React.FC<CitationProps> = ({ score, page, snippet, documentId }) => {
  const [previewVisible, setPreviewVisible] = useState(false);

  return (
    <div className={`citation ${score < 0.3 ? 'low-relevance' : ''}`}>
      <div className="citation-header" onClick={() => setPreviewVisible(!previewVisible)}>
        <span className="score">Relevance: {(score * 100).toFixed(1)}%</span>
        <span className="page">Page {page + 1}</span>
        {score < 0.3 && <span className="warning-icon">⚠️ Low relevance</span>}
      </div>
      {previewVisible && (
        <div className="preview-content">
          <PDFViewer 
            documentId={documentId} 
            page={page}
            highlightText={snippet}
          />
          <div className="snippet-preview">{snippet}</div>
        </div>
      )}
    </div>
  );
};

export default CitationPreview; 