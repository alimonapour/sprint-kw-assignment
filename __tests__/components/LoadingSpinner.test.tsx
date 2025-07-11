import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoadingSpinner from '@/components/common/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders the spinner element', () => {
    render(<LoadingSpinner />)
    const spinner = screen.getByRole('status') // Assuming a role of status or similar for accessibility
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin') // Check for the animation class
  })
})
