import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Post } from '@/lib/types'
import PostCard from '@/components/feed/PostCard'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('PostCard', () => {
  const mockPost: Post = {
    id: 'post-1',
    title: 'Test Post Title',
    content: 'This is a test post content for rendering.',
    author: 'John Doe',
    createdAt: '2023-01-15T10:00:00Z',
    imageUrl: 'https://example.com/image.jpg',
  }

  it('renders post title, content, author, and date correctly', () => {
    render(<PostCard post={mockPost} />)

    expect(screen.getByText(mockPost.title)).toBeInTheDocument()
    expect(screen.getByText(mockPost.content)).toBeInTheDocument()
    expect(screen.getByText(`By ${mockPost.author}`)).toBeInTheDocument()
    expect(
      screen.getByText(new Date(mockPost.createdAt).toLocaleDateString()),
    ).toBeInTheDocument()
  })

  it('renders the image when imageUrl is provided', () => {
    render(<PostCard post={mockPost} />)
    const image = screen.getByAltText(mockPost.title)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockPost.imageUrl)
  })

  it('does not render the image when imageUrl is not provided', () => {
    const postWithoutImage = { ...mockPost, imageUrl: undefined }
    render(<PostCard post={postWithoutImage} />)
    expect(screen.queryByAltText(mockPost.title)).not.toBeInTheDocument()
  })

  it('renders a link to the post detail page', () => {
    render(<PostCard post={mockPost} />)
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `/posts/${mockPost.id}`)
  })
})
