export interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  imageUrl?: string
}

export interface Comment {
  id: string
  postId: string
  author: string
  content: string
  createdAt: string
}

export interface User {
  id: string
  name: string
}

export interface Dictionary {
  [key: string]: string
}
