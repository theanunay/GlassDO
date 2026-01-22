import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("GlassDo: Initializing application...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("GlassDo: Could not find root element to mount to.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("GlassDo: Mount successful.");
  } catch (error) {
    console.error("GlassDo: Failed to render app:", error);
  }
}