import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-primary to-secondary text-black hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary:
      'border-2 border-secondary text-secondary hover:bg-secondary hover:text-black disabled:opacity-50 disabled:cursor-not-allowed',
    ghost:
      'text-secondary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
