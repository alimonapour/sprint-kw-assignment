import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Post } from '../../lib/types'

interface PostCardProps {
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link href={`/posts/${post.id}`} className='block'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
        {post.imageUrl && (
          <div className='relative w-full h-48'>
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='rounded-t-lg'
              onError={(e) => {
                // Fallback to a placeholder image if the original fails
                e.currentTarget.src = `https://placehold.co/600x400/ADADAD/FFFFFF?text=Image+Error`
              }}
            />
          </div>
        )}
        <div className='p-4'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2'>
            {post.title}
          </h2>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3'>
            {post.content}
          </p>
          <div className='flex justify-between items-center text-xs text-gray-500 dark:text-gray-400'>
            <span>By {post.author}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
