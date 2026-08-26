import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-[#100e0b] text-[#f5f5f7]">
          <div className="text-center p-8 bg-[#1a1814] rounded-xl border border-red-500/20 max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-400">Something went wrong.</h2>
            <p className="text-sm text-gray-400 mb-6">The application encountered an unexpected error. Please refresh the page to try again.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-black font-semibold rounded-lg transition-colors">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
