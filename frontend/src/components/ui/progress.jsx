// src/components/ui/progress.js
import React from 'react'

export const Progress = ({ value, className, ...props }) => (
  <div className={`h-2 w-full bg-gray-200 rounded-full ${className}`} {...props}>
    <div
      className="h-full bg-blue-600 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
)