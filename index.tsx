import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress Recharts specific warnings about width/height during initial render
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Filter out the specific warning user doesn't want to see
  if (typeof args[0] === 'string' && /width.*height.*greater than 0/.test(args[0])) return;
  // Filter out defaultProps warning (common in Recharts)
  if (typeof args[0] === 'string' && /defaultProps/.test(args[0])) return;
  
  originalConsoleError(...args);
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);