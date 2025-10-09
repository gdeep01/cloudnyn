import { Component, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class InstagramErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Instagram Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="glass-card p-6">
          <div className="text-center space-y-4">
            <div className="bg-destructive/10 p-3 rounded-full w-fit mx-auto">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-destructive">Instagram Error</h3>
              <p className="text-muted-foreground text-sm">
                {this.state.error?.message || 'An unexpected error occurred with Instagram integration'}
              </p>
            </div>
            <Button onClick={this.handleRetry} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

