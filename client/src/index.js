import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🚀 App Initializing...');
console.log('🌐 API URL:', process.env.REACT_APP_API_URL || 'NOT SET (using relative paths)');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
