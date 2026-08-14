import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application error boundary", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          message={this.props.fallbackMessage}
          onRetry={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
