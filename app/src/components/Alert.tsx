import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import React from 'react'

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  onClose?: () => void
}

export default function Alert({ type, title, message, onClose }: AlertProps) {
  const variants = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/50',
      icon: Info,
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-300',
      messageColor: 'text-blue-200',
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/50',
      icon: CheckCircle,
      iconColor: 'text-green-400',
      titleColor: 'text-green-300',
      messageColor: 'text-green-200',
    },
    warning: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/50',
      icon: AlertCircle,
      iconColor: 'text-orange-400',
      titleColor: 'text-orange-300',
      messageColor: 'text-orange-200',
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
      icon: XCircle,
      iconColor: 'text-red-400',
      titleColor: 'text-red-300',
      messageColor: 'text-red-200',
    },
  }

  const variant = variants[type]
  const Icon = variant.icon

  return (
    <div className={`${variant.bg} border ${variant.border} rounded-lg p-4 flex gap-3`}>
      <Icon size={20} className={`${variant.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        {title && <p className={`font-semibold ${variant.titleColor} mb-1`}>{title}</p>}
        <p className={variant.messageColor}>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-gray-200 flex-shrink-0">
          ✕
        </button>
      )}
    </div>
  )
}
