import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export default function Textarea({
  label,
  error,
  helperText,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-white">{label}</label>}
      <textarea
        className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors resize-none ${
          error ? 'border-red-500/50 focus:border-red-400' : 'border-primary/30 focus:border-secondary'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {helperText && !error && <p className="text-gray-400 text-sm">{helperText}</p>}
    </div>
  )
}
