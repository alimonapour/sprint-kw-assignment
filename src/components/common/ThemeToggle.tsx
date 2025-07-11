'use client'

import React from 'react'
import { useTheme } from '../providers/ThemeContext'
import { useLocalization } from '../providers/LocalizationContext'

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLocalization()

  return (
    <button
      onClick={toggleTheme}
      className='p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
      aria-label={
        theme === 'light' ? t('theme.toggleDark') : t('theme.toggleLight')
      }
    >
      {theme === 'light' ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z'
          />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 3v1m0 16v1m9-9h1M3 12H2m8.003-9.697l-.707-.707M16.95 20.95l.707.707M2.929 7.071l.707-.707M20.293 16.929l-.707.707M18 12a6 6 0 11-12 0 6 6 0 0112 0z'
          />
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
