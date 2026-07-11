import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ResizeObserver error suppress karo
const resizeObserverError = window.console.error;
window.console.error = (...args) => {
  if (args[0]?.includes?.('ResizeObserver')) return;
  resizeObserverError(...args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
