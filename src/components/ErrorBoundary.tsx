import { Component, type ReactNode } from 'react'

import { Button } from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed', { error, info })
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 text-center text-white">
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-3 max-w-xl text-base text-slate-200">
          We could not recover from an unexpected error. You can try reloading the page. If the
          problem persists, export your game state for troubleshooting.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={this.handleReload}>Reload app</Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (this.state.error) {
                const payload = JSON.stringify(
                  {
                    message: this.state.error.message,
                    stack: this.state.error.stack,
                  },
                  null,
                  2,
                )
                navigator.clipboard?.writeText(payload).catch(() => undefined)
              }
            }}
          >
            Copy error
          </Button>
        </div>
      </div>
    )
  }
}
