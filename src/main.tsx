
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Agregar logs para debug
console.log('Loading main.tsx...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

console.log('Root element found, creating React app...');

const root = createRoot(rootElement);
root.render(<App />);

console.log('React app rendered successfully');
