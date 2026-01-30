import React from 'react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export default function Loading({ size = 'md', message = 'Loading...' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="w-full h-full border-4 border-primary/30 border-t-secondary rounded-full" />
      </div>
      {message && <p className="text-gray-400">{message}</p>}
    </div>
  )
}
