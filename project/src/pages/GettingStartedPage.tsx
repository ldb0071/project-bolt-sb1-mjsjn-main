import React from 'react';
import { Link } from 'react-router-dom';

export const GettingStartedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to PDF Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Your intelligent companion for document analysis
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center p-6 rounded-xl bg-blue-50">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload PDF</h3>
              <p className="text-gray-600">
                Import your documents securely and easily
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-blue-50">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Process</h3>
              <p className="text-gray-600">
                Our AI analyzes your document content
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-blue-50">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Analyze</h3>
              <p className="text-gray-600">
                Get insights and information from your documents
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <div>
                <h3 className="font-medium mb-1">Smart Document Analysis</h3>
                <p className="text-gray-600">Advanced AI processing for accurate insights</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <div>
                <h3 className="font-medium mb-1">Interactive Viewer</h3>
                <p className="text-gray-600">View and navigate your documents with ease</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <div>
                <h3 className="font-medium mb-1">PDF Viewer</h3>
                <p className="text-gray-600">Built-in viewer with reference highlighting</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <div>
                <h3 className="font-medium mb-1">Multiple Documents</h3>
                <p className="text-gray-600">Manage and analyze multiple PDFs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/projects"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  );
};
