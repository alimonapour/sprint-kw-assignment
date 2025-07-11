'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { Dictionary } from '../../lib/types'

type Language = 'en' | 'es'

interface LocalizationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const en: Dictionary = {
  'feed.title': 'Social Feed',
  'feed.loading': 'Loading more posts...',
  'feed.noMorePosts': 'No more posts to load.',
  'post.backToFeed': 'Back to Feed',
  'post.comments': 'Comments',
  'post.addComment': 'Add a Comment',
  'post.commentPlaceholder': 'Write your comment...',
  'post.submitComment': 'Submit Comment',
  'post.noComments': 'No comments yet.',
  'post.detailsTitle': 'Post Details',
  'createPost.title': 'Create New Post',
  'createPost.postTitlePlaceholder': 'Enter post title...',
  'createPost.postContentPlaceholder': 'Write your post content here...',
  'createPost.livePreview': 'Live Preview',
  'createPost.submitPost': 'Create Post',
  'createPost.authorPlaceholder': 'Your Name',
  'theme.toggleLight': 'Switch to Light Mode',
  'theme.toggleDark': 'Switch to Dark Mode',
  'common.loading': 'Loading...',
  'common.error': 'An error occurred.',
  'common.author': 'Author',
  'comment.validationError': 'Please enter both author and comment content.', // New key
  'comment.submitError': 'Failed to add comment. Please try again.', // New key
}

const es: Dictionary = {
  'feed.title': 'Muro Social',
  'feed.loading': 'Cargando más publicaciones...',
  'feed.noMorePosts': 'No hay más publicaciones.',
  'post.backToFeed': 'Volver al Muro',
  'post.comments': 'Comentarios',
  'post.addComment': 'Añadir un Comentario',
  'post.commentPlaceholder': 'Escribe tu comentario...',
  'post.submitComment': 'Enviar Comentario',
  'post.noComments': 'Todavía no hay comentarios.',
  'post.detailsTitle': 'Detalles de la Publicación',
  'createPost.title': 'Crear Nueva Publicación',
  'createPost.postTitlePlaceholder': 'Introduce el título de la publicación...',
  'createPost.postContentPlaceholder':
    'Escribe el contenido de tu publicación aquí...',
  'createPost.livePreview': 'Vista Previa',
  'createPost.submitPost': 'Crear Publicación',
  'createPost.authorPlaceholder': 'Tu Nombre',
  'theme.toggleLight': 'Cambiar a Modo Claro',
  'theme.toggleDark': 'Cambiar a Modo Oscuro',
  'common.loading': 'Cargando...',
  'common.error': 'Ocurrió un error.',
  'common.author': 'Autor',
  'comment.validationError':
    'Por favor, introduce el autor y el contenido del comentario.', // New key
  'comment.submitError':
    'Error al añadir comentario. Por favor, inténtalo de nuevo.', // New key
}

const dictionaries: Record<Language, Dictionary> = {
  en,
  es,
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined,
)

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en') // Default language

  const t = useCallback(
    (key: string): string => {
      return dictionaries[language][key] || key
    },
    [language],
  )

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  )
}

export const useLocalization = () => {
  const context = useContext(LocalizationContext)
  if (context === undefined) {
    throw new Error(
      'useLocalization must be used within a LocalizationProvider',
    )
  }
  return context
}
