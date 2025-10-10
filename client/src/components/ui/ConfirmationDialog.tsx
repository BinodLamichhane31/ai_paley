import { type ReactNode } from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
  children?: ReactNode
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  children
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-600',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          iconBg: 'bg-red-50 dark:bg-red-950'
        }
      case 'warning':
        return {
          icon: 'text-yellow-600',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          iconBg: 'bg-yellow-50 dark:bg-yellow-950'
        }
      case 'info':
        return {
          icon: 'text-blue-600',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          iconBg: 'bg-blue-50 dark:bg-blue-950'
        }
    }
  }

  const styles = getVariantStyles()

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md bg-white border shadow-xl dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute p-1 transition-colors rounded-md top-4 right-4 hover:bg-slate-100 dark:hover:bg-slate-800"
          disabled={isLoading}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4 ${styles.iconBg}`}>
            <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-semibold text-center text-slate-900 dark:text-slate-100">
            {title}
          </h3>

          {/* Message */}
          <p className="mb-6 text-sm text-center text-slate-600 dark:text-slate-400">
            {message}
          </p>

          {/* Custom content */}
          {children && (
            <div className="mb-6">
              {children}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-md text-slate-700 dark:text-slate-300 dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${styles.confirmButton}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                  Loading...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


