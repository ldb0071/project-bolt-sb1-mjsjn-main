import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, ArrowRight } from 'lucide-react';

export function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const features = [
    {
      icon: FileText,
      title: 'PDF Viewer',
      description: 'View and manage your PDF files with ease',
    },
    {
      icon: MessageSquare,
      title: 'AI Chat',
      description: 'Chat with GPT-4 about your documents',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-primary-600 to-accent-600 z-50 flex items-center justify-center p-4"
    >
      <div className="max-w-lg w-full">
        {step === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-white"
          >
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold mb-4"
            >
              Welcome to PDF Assistant
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/80 mb-8"
            >
              Your all-in-one solution for PDF management and AI assistance
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => setStep(1)}
              className="btn bg-white text-primary-600 hover:bg-white/90"
            >
              Get Started
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Features</h2>
            <div className="space-y-6">
              {features.map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onComplete}
              className="mt-8 btn bg-primary-600 text-white w-full flex items-center justify-center space-x-2"
            >
              <span>Enter Application</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}