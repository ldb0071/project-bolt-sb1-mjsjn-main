import React, { useState } from 'react';
import { CodeSnippetShowcase } from './CodeSnippetShowcase';
import { motion } from 'framer-motion';
import { CreateSnippetModal } from './CreateSnippetModal';

interface CodeSnippet {
  title: string;
  description: string;
  code: string;
  language: string;
  inputExample?: string;
  expectedOutput?: string;
  notes?: string;
  tags?: string[];
  author?: string;
  createdAt?: string;
}

interface CodeSnippetExampleProps {
  snippet: CodeSnippet;
  onDelete?: () => void;
  onUpdate?: (updatedSnippet: CodeSnippet) => void;
}

export function CodeSnippetExample({ snippet, onDelete, onUpdate }: CodeSnippetExampleProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedSnippet: CodeSnippet) => {
    if (onUpdate) {
      // Preserve the original author and creation date
      onUpdate({
        ...updatedSnippet,
        author: snippet.author,
        createdAt: snippet.createdAt
      });
    }
    setIsEditModalOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CodeSnippetShowcase
          {...snippet}
          onDelete={onDelete}
          onEdit={handleEdit}
        />
      </motion.div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <CreateSnippetModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdate}
          initialData={snippet}
        />
      )}
    </>
  );
} 