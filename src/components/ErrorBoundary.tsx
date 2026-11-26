import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'An unexpected application error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('VazhipaduBook ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let friendlyMessage =
        'Something went wrong while communicating with temple booking services.';
      try {
        const parsed = JSON.parse(this.state.errorMessage);
        if (parsed?.error) {
          friendlyMessage = parsed.error;
        }
      } catch {
        friendlyMessage = this.state.errorMessage;
      }

      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#E8E0D5] rounded-2xl p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-[#7A1C1C]/10 text-[#7A1C1C] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#1F1815] mb-2">
              Unable to complete request
            </h2>
            <p className="text-sm text-[#6B5E57] leading-relaxed mb-6">
              {friendlyMessage}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#7A1C1C] text-white text-sm font-medium hover:bg-[#611414] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Return to VazhipaduBook
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
