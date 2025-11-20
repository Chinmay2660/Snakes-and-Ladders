import { ReactNode, useEffect } from 'react'
import clsx from 'clsx'

interface ModalProps {
  title: string
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  actions?: ReactNode
}

export const Modal = ({ title, children, isOpen, onClose, actions }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4"
      onClick={onClose}
    >
      <div
        className={clsx(
          'w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl transition-all',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        </header>
        <div className="space-y-4 text-slate-700">{children}</div>
        {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  )
}
