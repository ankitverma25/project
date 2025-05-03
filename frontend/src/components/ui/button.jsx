// src/components/ui/button.js
import React from 'react'
import { clsx } from 'clsx'

export const Button = React.forwardRef(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={clsx(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
            'border border-gray-300 bg-transparent hover:bg-gray-100': variant === 'outline',
            'bg-transparent hover:bg-gray-100': variant === 'ghost',
          },
          {
            'h-8 px-4 py-2': size === 'default',
            'h-6 px-2 text-xs': size === 'sm',
            'h-10 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'