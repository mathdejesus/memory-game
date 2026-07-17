import React from 'react';
import { ThemeProvider } from './src/contexts/ThemeContext';
import Navigation from './src/Navigation';
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
