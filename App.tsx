import React from 'react';
import { ThemeProvider } from './src/contexts/ThemeContext';
import Navigation from './src/Navigation';

export default function App() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}
