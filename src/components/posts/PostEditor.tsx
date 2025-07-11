'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockApi } from '../../lib/mockApi'
import { useLocalization } from '../providers/LocalizationContext'

const PostEditor: React.FC = () => {
  const router = useRouter()
  const { t } = useLocalization()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !author.trim()) {
      setSubmitError('Please fill in all fields (Title, Content, and Author).')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const newPost = await mockApi.createPost({ title, content, author })
      setSubmitSuccess(
        `Post "${newPost.title}" created successfully! Redirecting...`,
      )
      setTitle('')
      setContent('')
      setAuthor('')
      setTimeout(() => {
        router.push('/feed') // Redirect to feed after successful creation
      }, 2000)
    } catch (err) {
      setSubmitError('Failed to create post. Please try again.')
      console.error('Error creating post:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center'>
        {t('createPost.title')}
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Editor Section */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label
                htmlFor='postTitle'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Title
              </label>
              <input
                type='text'
                id='postTitle'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('createPost.postTitlePlaceholder')}
                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
            <div className='mb-4'>
              <label
                htmlFor='postAuthor'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                {t('common.author')}
              </label>
              <input
                type='text'
                id='postAuthor'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={t('createPost.authorPlaceholder')}
                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
            <div className='mb-6'>
              <label
                htmlFor='postContent'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Content
              </label>
              <textarea
                id='postContent'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('createPost.postContentPlaceholder')}
                rows={10}
                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500'
                required
              ></textarea>
            </div>

            {submitError && (
              <p className='text-red-500 text-sm mb-4'>{submitError}</p>
            )}
            {submitSuccess && (
              <p className='text-green-600 text-sm mb-4'>{submitSuccess}</p>
            )}

            <button
              type='submit'
              className='w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('createPost.submitPost')}
            </button>
          </form>
        </div>

        {/* Live Preview Section */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
            {t('createPost.livePreview')}
          </h2>
          <div className='border border-gray-300 dark:border-gray-600 rounded-md p-4 min-h-[200px] bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 whitespace-pre-wrap'>
            <h3 className='text-lg font-medium mb-2'>
              {title || 'Your Title Here'}
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
              By {author || 'Anonymous'}
            </p>
            <p>
              {content || 'Your post content will appear here as you type.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostEditor
