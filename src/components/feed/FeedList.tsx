'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import useSWRInfinite from 'swr/infinite'
import { Post } from '../../lib/types'
import { mockApi } from '../../lib/mockApi'
import PostCard from './PostCard'
import LoadingSpinner from '../common/LoadingSpinner'
import { useLocalization } from '../providers/LocalizationContext'

const POSTS_PER_PAGE = 10

// SWR key function for infinite loading
const getKey = (pageIndex: number, previousPageData: Post[]) => {
  if (previousPageData && !previousPageData.length) return null // Reached the end
  return `/api/posts?_page=${pageIndex + 1}&_limit=${POSTS_PER_PAGE}`
}

const fetcher = async (url: string) => {
  const urlParams = new URLSearchParams(url.split('?')[1])
  const page = parseInt(urlParams.get('_page') || '1')
  const limit = parseInt(urlParams.get('_limit') || '10')
  return mockApi.getPosts(page, limit)
}

const FeedList: React.FC = () => {
  const { t } = useLocalization()
  const { data, size, setSize, isValidating, error } = useSWRInfinite<Post[]>(
    getKey,
    fetcher,
  )

  const posts = data ? data.flat() : []
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < POSTS_PER_PAGE)

  const observerTarget = useRef<HTMLDivElement>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && !isReachingEnd && !isLoadingMore) {
        setSize((prevSize) => prevSize + 1)
      }
    },
    [isReachingEnd, isLoadingMore, setSize],
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1,
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [handleObserver])

  if (error)
    return (
      <div className='text-red-500 dark:text-red-400 text-center py-8'>
        {t('common.error')}
      </div>
    )
  if (isLoadingInitialData) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6'>
        {Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
          <div
            key={i}
            className='bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md h-64 animate-pulse'
          ></div>
        ))}
        <LoadingSpinner />
      </div>
    )
  }
  if (isEmpty)
    return (
      <div className='text-center py-8 text-gray-600 dark:text-gray-400'>
        {t('feed.noMorePosts')}
      </div>
    )

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center'>
        {t('feed.title')}
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <div ref={observerTarget} className='h-1' />{' '}
      {/* Invisible element to observe */}
      {isLoadingMore && <LoadingSpinner />}
      {isReachingEnd && !isLoadingMore && (
        <p className='text-center text-gray-600 dark:text-gray-400 mt-8'>
          {t('feed.noMorePosts')}
        </p>
      )}
    </div>
  )
}

export default FeedList
