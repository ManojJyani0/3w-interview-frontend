/**
 * Post API Functions
 * All post-related API calls
 * Follows backend-api-integration.md guidelines
 */

import api from '../../service/api'
import type { Post, PostComment } from './types'

export interface CreatePostData {
  content: string
  authorId: string
  images?: string[]
}

export interface UpdatePostData {
  content?: string
  images?: string[]
}

export interface AddCommentData {
  username: string
  message: string
}

export interface LikeUnlikeData {
  username: string
}

/**
 * Fetch all posts with pagination
 * GET /api/posts
 */
export const getPosts = async (page = 1, limit = 10) => {
  return api.get<Post[]>(`/posts?page=${page}&limit=${limit}`)
}

/**
 * Fetch posts by author ID
 * GET /api/posts/author/:authorId
 */
export const getPostsByAuthor = async (authorId: string) => {
  return api.get<Post[]>(`/posts/author/${authorId}`)
}

/**
 * Fetch a single post by ID
 * GET /api/posts/:id
 */
export const getPostById = async (postId: string) => {
  return api.get<Post>(`/posts/${postId}`)
}

/**
 * Create a new post
 * POST /api/posts
 */
export const createPost = async (data: CreatePostData) => {
  return api.post<Post>('/posts', data)
}

/**
 * Update an existing post
 * PUT /api/posts/:id
 */
export const updatePost = async (postId: string, data: UpdatePostData) => {
  return api.put<Post>(`/posts/${postId}`, data)
}

/**
 * Delete a post
 * DELETE /api/posts/:id
 */
export const deletePost = async (postId: string) => {
  return api.delete<{ success: boolean }>(`/posts/${postId}`)
}

/**
 * Like a post
 * POST /api/posts/:id/like
 */
export const likePost = async (postId: string, data: LikeUnlikeData) => {
  return api.post<Post>(`/posts/${postId}/like`, data)
}

/**
 * Unlike a post
 * POST /api/posts/:id/unlike
 */
export const unlikePost = async (postId: string, data: LikeUnlikeData) => {
  return api.post<Post>(`/posts/${postId}/unlike`, data)
}

/**
 * Get comments for a post
 * Comments are included in the post response
 */
export const getPostComments = async (postId: string) => {
  const post = await api.get<Post>(`/posts/${postId}`)
  return post.comments || []
}

/**
 * Add a comment to a post
 * POST /api/posts/:id/comment
 */
export const addComment = async (postId: string, data: AddCommentData) => {
  return api.post<Post>(`/posts/${postId}/comment`, data)
}

/**
 * Share a post
 * POST /api/posts/:id/share
 */
export const sharePost = async (postId: string) => {
  return api.post<Post>(`/posts/${postId}/share`)
}

/**
 * Delete a comment
 * DELETE /api/posts/:id/comment/:commentId
 */
export const deleteComment = async (postId: string, commentId: string) => {
  return api.delete<{ success: boolean }>(`/posts/${postId}/comment/${commentId}`)
}
