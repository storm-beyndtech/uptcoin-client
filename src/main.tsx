import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import ScrollToTop from './components/ScrollToTop.tsx';
import { CryptoProvider } from './context/CoinContext.tsx';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <CryptoProvider>
          <AuthProvider>
            <ScrollToTop />
            <App />
          </AuthProvider>
        </CryptoProvider>
      </Router>
    </HelmetProvider>
  </React.StrictMode>,
);
