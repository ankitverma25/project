// src/components/ui/table.js
import React from 'react'

export const Table = ({ className, ...props }) => (
  <div className="w-full overflow-auto">
    <table className={className} {...props} />
  </div>
)

export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={className} {...props} />
))

export const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props} />
))

export const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={className} {...props} />
))

export const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`px-4 py-2 text-left text-sm font-medium ${className}`}
    {...props}
  />
))

export const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-b transition-colors ${className}`}
    {...props}
  />
))

export const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={`px-4 py-2 align-middle ${className}`}
    {...props}
  />
))