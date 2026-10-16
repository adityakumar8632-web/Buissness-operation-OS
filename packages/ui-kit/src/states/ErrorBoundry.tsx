import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: '24px', border: '1px solid #ef4444', borderRadius: '4px', color: '#b91c1c', background: '#fee2e2' }}>
          <h4>Something went wrong.</h4>
          <p>Please refresh the page or contact support if the issue persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}