import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import ScrollToTop from './components/ScrollToTop.tsx';
import { CryptoProvider } from './context/CoinContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Router>
        <CryptoProvider>
          <AuthProvider>
            <ScrollToTop />
            <App />
          </AuthProvider>
        </CryptoProvider>
      </Router>
  </React.StrictMode>,
);
