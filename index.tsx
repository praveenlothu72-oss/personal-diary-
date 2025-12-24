
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("SoulJournal: Application bootstrapping started...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("SoulJournal Error: Could not find root element to mount to");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("SoulJournal: Root rendered successfully.");
} catch (err) {
  console.error("SoulJournal: Failed to mount application:", err);
}
