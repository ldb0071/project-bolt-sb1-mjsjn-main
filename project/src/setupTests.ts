import '@testing-library/jest-dom';

// Mock framer-motion since we don't need actual animations in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Upload: () => 'Upload Icon',
  AlertCircle: () => 'Alert Icon',
  Plus: () => 'Plus Icon',
}));
