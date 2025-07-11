'use client' // Ensure this is a client component to use hooks

import React from 'react'
import FeedList from '../../components/feed/FeedList'
import ThemeToggle from '../../components/common/ThemeToggle'
import { useLocalization } from '../../components/providers/LocalizationContext'

const FeedPageContent: React.FC = () => {
  const { language, setLanguage, t } = useLocalization() // Destructure t from useLocalization

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300'>
      <header className='sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center'>
        {/* Use t() for the header title */}
        <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
          {t('feed.title')}
        </h1>
        <div className='flex items-center space-x-4'>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
            className='p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='en'>English</option>
            <option value='es'>Español</option>
          </select>
          <ThemeToggle />
        </div>
      </header>
      <main>
        <FeedList />
      </main>
    </div>
  )
}

// Export as default for Next.js App Router
export default FeedPageContent
