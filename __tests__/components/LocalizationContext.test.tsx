import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  LocalizationProvider,
  useLocalization,
} from '@/components/providers/LocalizationContext'

// A test component to consume the context
const TestComponent = () => {
  const { t, language, setLanguage } = useLocalization()
  return (
    <div>
      <span data-testid='title'>{t('feed.title')}</span>
      <span data-testid='loading'>{t('feed.loading')}</span>
      <span data-testid='language'>{language}</span>
      <button onClick={() => setLanguage('es')}>Switch to Spanish</button>
    </div>
  )
}

describe('LocalizationContext', () => {
  it('provides default English translations', () => {
    render(
      <LocalizationProvider>
        <TestComponent />
      </LocalizationProvider>,
    )

    expect(screen.getByTestId('title')).toHaveTextContent('Social Feed')
    expect(screen.getByTestId('loading')).toHaveTextContent(
      'Loading more posts...',
    )
    expect(screen.getByTestId('language')).toHaveTextContent('en')
  })

  it('switches to Spanish translations when language is changed', () => {
    render(
      <LocalizationProvider>
        <TestComponent />
      </LocalizationProvider>,
    )

    fireEvent.click(screen.getByText('Switch to Spanish'))

    expect(screen.getByTestId('title')).toHaveTextContent('Muro Social')
    expect(screen.getByTestId('loading')).toHaveTextContent(
      'Cargando más publicaciones...',
    )
    expect(screen.getByTestId('language')).toHaveTextContent('es')
  })

  it('returns key if translation is missing', () => {
    render(
      <LocalizationProvider>
        <TestComponent />
      </LocalizationProvider>,
    )

    // Temporarily set language to 'es' to show a missing key in 'en'
    fireEvent.click(screen.getByText('Switch to Spanish'))

    // Test a non-existent key (it should just return the key itself)
    expect(screen.getByTestId('title')).toHaveTextContent('Muro Social') // Ensure it's still working
    const missingKeySpan = render(
      <LocalizationProvider>
        <TestComponent />
      </LocalizationProvider>,
    ).getByTestId('title') // Re-render to ensure fresh context for this specific test
    expect(missingKeySpan).toHaveTextContent('Social Feed') // Back to English default
  })
})
