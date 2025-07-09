import { ReactNode, MouseEventHandler } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
}

export const Button = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 transition-colors
                    bg-blue-600 text-white hover:bg-blue-700
                    disabled:opacity-50 disabled:pointer-events-none
                    ${className}`}
  >
    {children}
  </button>
)
