import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './styles/global.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
