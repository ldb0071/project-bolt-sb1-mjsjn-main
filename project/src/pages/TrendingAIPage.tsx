import React from 'react';
import { TrendingAISection } from '../components/TrendingAISection';

export function TrendingAIPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
        AI Trending
      </h1>
      <TrendingAISection />
    </div>
  );
}
