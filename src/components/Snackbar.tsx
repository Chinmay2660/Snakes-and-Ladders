import { useEffect, useState } from 'react'
import clsx from 'clsx'

interface SnackbarProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isOpen: boolean
  onClose: () => void
  duration?: number
}

export const Snackbar = ({
  message,
  type = 'info',
  isOpen,
  onClose,
  duration = 3000,
}: SnackbarProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      const hide = setTimeout(() => setIsVisible(false), 0)
      return () => clearTimeout(hide)
    }
    const show = setTimeout(() => setIsVisible(true), 0)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade-out animation
    }, duration)
    return () => {
      clearTimeout(show)
      clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  if (!isOpen && !isVisible) return null

  return (
    <div
      className={clsx(
        'fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform rounded-lg px-4 py-3 shadow-lg transition-all duration-300 sm:bottom-6',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
        type === 'success' && 'bg-green-600 text-white',
        type === 'error' && 'bg-red-600 text-white',
        type === 'info' && 'bg-blue-600 text-white',
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium sm:text-base">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-2 rounded p-1 hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close notification"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
