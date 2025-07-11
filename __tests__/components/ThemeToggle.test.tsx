import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@/components/providers/ThemeContext'
import { LocalizationProvider } from '@/components/providers/LocalizationContext'
import ThemeToggle from '@/components/common/ThemeToggle'

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
    removeItem: (key: string) => {
      delete store[key]
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false, // Default to light mode unless specified
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.clear()
    // Reset matchMedia mock for each test
    ;(window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))
  })

  it('renders correctly and shows light mode icon by default', () => {
    render(
      <ThemeProvider>
        <LocalizationProvider>
          <ThemeToggle />
        </LocalizationProvider>
      </ThemeProvider>,
    )

    // Check for the moon icon (dark mode toggle)
    expect(screen.getByLabelText('Switch to Dark Mode')).toBeInTheDocument()
  })

  it('switches to dark mode when clicked and persists preference', () => {
    render(
      <ThemeProvider>
        <LocalizationProvider>
          <ThemeToggle />
        </LocalizationProvider>
      </ThemeProvider>,
    )

    const toggleButton = screen.getByLabelText('Switch to Dark Mode')
    fireEvent.click(toggleButton)

    // Now it should show the sun icon (light mode toggle)
    expect(screen.getByLabelText('Switch to Light Mode')).toBeInTheDocument()
    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('switches back to light mode when clicked again', () => {
    // Start in dark mode
    localStorage.setItem('theme', 'dark')

    render(
      <ThemeProvider>
        <LocalizationProvider>
          <ThemeToggle />
        </LocalizationProvider>
      </ThemeProvider>,
    )

    const toggleButton = screen.getByLabelText('Switch to Light Mode') // Initially in dark mode
    fireEvent.click(toggleButton)

    expect(screen.getByLabelText('Switch to Dark Mode')).toBeInTheDocument() // Now in light mode
    expect(document.documentElement).toHaveClass('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('loads theme from localStorage on initial render', () => {
    localStorage.setItem('theme', 'dark')

    render(
      <ThemeProvider>
        <LocalizationProvider>
          <ThemeToggle />
        </LocalizationProvider>
      </ThemeProvider>,
    )

    expect(document.documentElement).toHaveClass('dark')
    expect(screen.getByLabelText('Switch to Light Mode')).toBeInTheDocument()
  })

  it('defaults to system preference if no localStorage theme is set', () => {
    ;(window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)', // Simulate system dark mode
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    render(
      <ThemeProvider>
        <LocalizationProvider>
          <ThemeToggle />
        </LocalizationProvider>
      </ThemeProvider>,
    )

    expect(document.documentElement).toHaveClass('dark')
    expect(screen.getByLabelText('Switch to Light Mode')).toBeInTheDocument()
  })
})
