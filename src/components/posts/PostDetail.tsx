'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import useSWR from 'swr'
import { Post } from '../../lib/types'
import { mockApi } from '../../lib/mockApi'
import CommentSection from './CommentSection'
import LoadingSpinner from '../common/LoadingSpinner'
import { useLocalization } from '../providers/LocalizationContext'

interface PostDetailProps {
  postId: string
}

const fetcher = async (url: string): Promise<Post> => {
  const parts = url.split('/')
  const id = parts[parts.length - 1] // Extract ID from /api/posts/{id}
  const post = await mockApi.getPostById(id)
  if (!post) {
    throw new Error('Post not found')
  }
  return post
}

const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const router = useRouter()
  const { t } = useLocalization()
  const { data: post, error } = useSWR<Post>(
    `/api/posts/${postId}`,
    fetcher,
    {},
  )

  if (error)
    return (
      <div className='text-red-500 dark:text-red-400 text-center py-8'>
        {t('common.error')}
      </div>
    )
  if (!post) return <LoadingSpinner />

  return (
    <div className='container mx-auto px-4 py-8'>
      <button
        onClick={() => router.back()}
        className='mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200'
      >
        &larr; {t('post.backToFeed')}
      </button>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8'>
        {post.imageUrl && (
          <div className='relative w-full h-80 mb-6 rounded-lg overflow-hidden'>
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes='(max-width: 768px) 100vw, 75vw'
              className='rounded-lg'
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/800x450/ADADAD/FFFFFF?text=Image+Error`
              }}
            />
          </div>
        )}
        <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          {post.title}
        </h1>
        <div className='flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-6'>
          <span>
            {t('common.author')}: {post.author}
          </span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p className='text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>
          {post.content}
        </p>
      </div>

      <CommentSection postId={postId} />
    </div>
  )
}

export default PostDetail
