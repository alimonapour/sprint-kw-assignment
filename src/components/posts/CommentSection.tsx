'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { Comment } from '../../lib/types'
import { mockApi } from '../../lib/mockApi'
import LoadingSpinner from '../common/LoadingSpinner'
import { useLocalization } from '../providers/LocalizationContext'

interface CommentSectionProps {
  postId: string
}

const fetcher = async (url: string) => {
  const parts = url.split('/')
  const postId = parts[parts.length - 2] // Extract postId from /api/posts/{id}/comments
  return mockApi.getCommentsByPostId(postId)
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { t } = useLocalization()
  const {
    data: comments,
    error,
    mutate,
  } = useSWR<Comment[]>(`/api/posts/${postId}/comments`, fetcher)
  const [newCommentContent, setNewCommentContent] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentContent.trim() || !commentAuthor.trim()) {
      // Use localized error message
      setSubmitError(t('comment.validationError'))
      return
    }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await mockApi.addComment(postId, newCommentContent, commentAuthor)
      setNewCommentContent('')
      setCommentAuthor('')
      mutate() // Revalidate comments to show the new one
    } catch (err) {
      // Use localized error message
      setSubmitError(t('comment.submitError'))
      console.error('Error adding comment:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error)
    return (
      <div className='text-red-500 dark:text-red-400'>{t('common.error')}</div>
    )
  if (!comments) return <LoadingSpinner />

  return (
    <div className='mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
      <h3 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
        {t('post.comments')}
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className='mb-6'>
        <div className='mb-4'>
          <label
            htmlFor='commentAuthor'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            {t('common.author')}
          </label>
          <input
            type='text'
            id='commentAuthor'
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            placeholder={t('createPost.authorPlaceholder')}
            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500'
            required
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='commentContent'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
          >
            {t('post.addComment')}
          </label>
          <textarea
            id='commentContent'
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder={t('post.commentPlaceholder')}
            rows={3}
            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500'
            required
          ></textarea>
        </div>
        {submitError && (
          <p className='text-red-500 text-sm mb-4'>{submitError}</p>
        )}
        <button
          type='submit'
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={isSubmitting}
        >
          {isSubmitting ? t('common.loading') : t('post.submitComment')}
        </button>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className='text-gray-600 dark:text-gray-400'>
          {t('post.noComments')}
        </p>
      ) : (
        <div className='space-y-4'>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className='bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-sm'
            >
              <p className='text-gray-800 dark:text-gray-200 text-sm mb-1'>
                {comment.content}
              </p>
              <div className='flex justify-between items-center text-xs text-gray-500 dark:text-gray-400'>
                <span>By {comment.author}</span>
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection
