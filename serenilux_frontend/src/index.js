import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Add a global error boundary for uncaught runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // PUBLIC_INTERFACE
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // PUBLIC_INTERFACE
  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error, errorInfo });
    // You can also log error info or report to an external service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#F5A62322', color: '#333', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <h2 style={{ color: '#E87A41' }}>Something went wrong.</h2>
          <pre style={{ padding: 8, background: '#fee', borderRadius: 6, width: '90%', maxWidth: 640, overflow: 'auto' }}>
            {this.state.error?.toString()}
            {'\n'}
            {this.state.errorInfo?.componentStack}
          </pre>
          <p>
            Please reload the page or contact support if this persists.
          </p>
        </div>
      );
    }
    return this.props.children; 
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
