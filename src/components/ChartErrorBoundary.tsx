/**
 * Chart Error Boundary Component
 * 
 * Specialized error boundary for chart components that provides
 * a more compact fallback UI suitable for chart containers.
 * 
 * Features:
 * - Compact error display for chart sections
 * - Retry functionality
 * - Development mode error details
 * - Graceful degradation without breaking the page
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  chartName?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ChartErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Chart Error (${this.props.chartName || 'Unknown'}):`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <div className="flex flex-col items-center justify-center space-y-4 text-center min-h-[300px]">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                Chart Error
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 max-w-md">
                {this.props.chartName 
                  ? `Unable to render ${this.props.chartName}. `
                  : 'Unable to render chart. '}
                There may be an issue with the data or visualization.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 max-w-lg">
                <p className="text-xs font-mono text-red-800 dark:text-red-200 break-words text-left">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <Button
              onClick={this.handleReset}
              variant="outline"
              size="sm"
              className="gap-2 border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}