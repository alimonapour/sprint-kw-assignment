import { Post, Comment } from './types'

// Mock data
const mockPosts: Post[] = Array.from({ length: 50 }, (_, i) => ({
  id: `post-${i + 1}`,
  title: `Post Title ${i + 1}`,
  content: `This is the content for post number ${
    i + 1
  }. It's a placeholder for a longer article or thought. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  author: `User ${Math.floor(Math.random() * 10) + 1}`,
  createdAt: new Date(Date.now() - i * 3600 * 1000).toISOString(), // Older posts first
  imageUrl: `https://placehold.co/600x400/ADADAD/FFFFFF?text=Post+Image+${
    i + 1
  }`,
}))

const mockComments: Comment[] = Array.from({ length: 100 }, (_, i) => ({
  id: `comment-${i + 1}`,
  postId: `post-${Math.floor(Math.random() * 50) + 1}`, // Associate with a random post
  author: `Commenter ${Math.floor(Math.random() * 20) + 1}`,
  content: `This is comment number ${i + 1}. Great post!`,
  createdAt: new Date(Date.now() - i * 60 * 1000).toISOString(),
}))

// Simulate network delay
const simulateDelay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const mockApi = {
  /**
   * Fetches a paginated list of posts.
   * @param page - The page number to fetch (1-indexed).
   * @param limit - The number of posts per page.
   * @returns A promise that resolves to an array of posts.
   */
  getPosts: async (page: number = 1, limit: number = 10): Promise<Post[]> => {
    await simulateDelay(500) // Simulate network delay
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return mockPosts.slice(startIndex, endIndex)
  },

  /**
   * Fetches a single post by its ID.
   * @param id - The ID of the post to fetch.
   * @returns A promise that resolves to the post or undefined if not found.
   */
  getPostById: async (id: string): Promise<Post | undefined> => {
    await simulateDelay(300)
    return mockPosts.find((post) => post.id === id)
  },

  /**
   * Fetches comments for a specific post.
   * @param postId - The ID of the post to fetch comments for.
   * @returns A promise that resolves to an array of comments.
   */
  getCommentsByPostId: async (postId: string): Promise<Comment[]> => {
    await simulateDelay(400)
    return mockComments.filter((comment) => comment.postId === postId)
  },

  /**
   * Creates a new post.
   * @param newPostData - The data for the new post (excluding ID and createdAt).
   * @returns A promise that resolves to the newly created post.
   */
  createPost: async (
    newPostData: Omit<Post, 'id' | 'createdAt'>,
  ): Promise<Post> => {
    await simulateDelay(600)
    const newPost: Post = {
      id: `post-${mockPosts.length + 1}`,
      createdAt: new Date().toISOString(),
      ...newPostData,
    }
    mockPosts.unshift(newPost) // Add to the beginning for feed visibility
    return newPost
  },

  /**
   * Adds a new comment to a post.
   * @param postId - The ID of the post to add the comment to.
   * @param commentContent - The content of the new comment.
   * @param author - The author of the new comment.
   * @returns A promise that resolves to the newly created comment.
   */
  addComment: async (
    postId: string,
    commentContent: string,
    author: string,
  ): Promise<Comment> => {
    await simulateDelay(300)
    const newComment: Comment = {
      id: `comment-${mockComments.length + 1}`,
      postId,
      author,
      content: commentContent,
      createdAt: new Date().toISOString(),
    }
    mockComments.unshift(newComment) // Add to the beginning
    return newComment
  },
}
