
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("SoulJournal: Initializing application...");

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("SoulJournal: Ready.");
} else {
  console.error("SoulJournal: Root container not found!");
}
