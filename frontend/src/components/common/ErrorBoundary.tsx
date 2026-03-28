import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-100 rounded-xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-display font-semibold text-gray-950 mb-2">Something went wrong</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-xs">
            {this.state.error?.message || 'An unexpected error occurred while rendering this component.'}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
          >
            <RefreshCw size={14} /> Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
