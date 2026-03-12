import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PortalProvider } from './contexts/PortalContext';
import { StoreProvider } from './contexts/StoreContext';
import { DateRangeProvider } from './contexts/DateRangeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <DateRangeProvider>
          <PortalProvider>
            <App />
          </PortalProvider>
        </DateRangeProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);
