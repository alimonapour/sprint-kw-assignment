import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => (
  <div
    className={`bg-card text-card-foreground border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm ${className}`}
  >
    {children}
  </div>
)
