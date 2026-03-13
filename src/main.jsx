import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { PortalProvider } from './contexts/PortalContext';
import { StoreProvider } from './contexts/StoreContext';
import { DateRangeProvider } from './contexts/DateRangeContext';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return React.createElement('pre', { style: { color: '#E87068', background: '#141210', padding: 20, fontSize: 14, whiteSpace: 'pre-wrap' } },
        'RUNTIME ERROR:\n' + this.state.error.message + '\n\n' + (this.state.error.stack || ''));
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <StoreProvider>
          <DateRangeProvider>
            <PortalProvider>
              <App />
            </PortalProvider>
          </DateRangeProvider>
        </StoreProvider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
