import React, { useState, useRef } from 'react';
import { API_BASE_URL } from '../../config';

interface Source {
  page: number;
  content: string;
}

interface ChatResponse {
  answer: string;
  sources: Source[];
}

const PDFChat: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/pdf/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/pdf/chat?question=${encodeURIComponent(question)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PDF Chat</h1>
      
      {/* File Upload Section */}
      <div className="mb-6">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Select PDF
        </button>
        {file && (
          <>
            <span className="mr-2">{file.name}</span>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Upload
            </button>
          </>
        )}
      </div>

      {/* Chat Section */}
      <div className="mb-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the PDF..."
          className="w-full p-2 border rounded"
          rows={3}
        />
        <button
          onClick={handleChat}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          {loading ? 'Loading...' : 'Ask'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="mt-4">
          <div className="bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-bold mb-2">Answer:</h3>
            <p>{response.answer}</p>
          </div>
          
          {response.sources.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Sources:</h3>
              {response.sources.map((source, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded mb-2">
                  <p className="text-sm text-gray-600">Page {source.page}</p>
                  <p className="text-sm">{source.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { PDFChat };
