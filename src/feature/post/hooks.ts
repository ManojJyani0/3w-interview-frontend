/**
 * Post React Query Hooks
 * Custom hooks for managing post state with React Query
 */

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import * as postApi from './api'
import type { Post, PostComment } from './types'

const QUERY_KEYS = {
  posts: {
    all: ['posts'] as const,
    lists: () => [...QUERY_KEYS.posts.all, 'list'] as const,
    list: (page: number, limit: number) => [...QUERY_KEYS.posts.lists(), { page, limit }] as const,
    details: () => [...QUERY_KEYS.posts.all, 'detail'] as const,
    detail: (postId: string) => [...QUERY_KEYS.posts.details(), postId] as const,
    comments: (postId: string) => [...QUERY_KEYS.posts.detail(postId), 'comments'] as const,
  },
}

/**
 * Hook to fetch all posts with pagination
 */
export const usePosts = (page = 1, limit = 10, options?: Partial<UseQueryOptions<Post[], Error>>) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.list(page, limit),
    queryFn: () => postApi.getPosts(page, limit),
    ...options,
  })
}

/**
 * Hook to fetch posts with infinite scroll
 */
export const useInfinitePosts = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.posts.lists(),
    queryFn: ({ pageParam = 1 }) => postApi.getPosts(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined
      return allPages.length + 1
    },
    initialPageParam: 1,
  })
}

/**
 * Hook to fetch a single post by ID
 */
export const usePost = (postId: string, options?: Partial<UseQueryOptions<Post, Error>>) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.detail(postId),
    queryFn: () => postApi.getPostById(postId),
    enabled: !!postId,
    ...options,
  })
}

/**
 * Hook to create a new post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: postApi.CreatePostData) => postApi.createPost(data),
    onSuccess: () => {
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.lists() })
    },
  })
}

/**
 * Hook to update a post
 */
export const useUpdatePost = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: postApi.UpdatePostData) => postApi.updatePost(postId, data),
    onSuccess: () => {
      // Invalidate both the specific post and the list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(postId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.lists() })
    },
  })
}

/**
 * Hook to delete a post
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => postApi.deletePost(postId),
    onSuccess: () => {
      // Invalidate all post queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.all })
    },
  })
}

/**
 * Hook to like a post
 */
export const useLikePost = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: postApi.LikeUnlikeData) => postApi.likePost(postId, data),
    onMutate: async (data) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.posts.detail(postId) })
      const previousPost = queryClient.getQueryData<Post>(QUERY_KEYS.posts.detail(postId))

      if (previousPost) {
        queryClient.setQueryData(QUERY_KEYS.posts.detail(postId), {
          ...previousPost,
          likedBy: [...previousPost.likedBy, data.username],
          likesCount: previousPost.likesCount + 1,
        })
      }

      return { previousPost }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.posts.detail(postId), context.previousPost)
      }
    },
    onSuccess: () => {
      // Invalidate lists to reflect changes in PostList
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.lists() })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(postId) })
    },
  })
}

/**
 * Hook to unlike a post
 */
export const useUnlikePost = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: postApi.LikeUnlikeData) => postApi.unlikePost(postId, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.posts.detail(postId) })
      const previousPost = queryClient.getQueryData<Post>(QUERY_KEYS.posts.detail(postId))

      if (previousPost) {
        queryClient.setQueryData(QUERY_KEYS.posts.detail(postId), {
          ...previousPost,
          likedBy: previousPost.likedBy.filter((username) => username !== data.username),
          likesCount: Math.max(0, previousPost.likesCount - 1),
        })
      }

      return { previousPost }
    },
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.posts.detail(postId), context.previousPost)
      }
    },
    onSuccess: () => {
      // Invalidate lists to reflect changes in PostList
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.lists() })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(postId) })
    },
  })
}

/**
 * Hook to get post comments
 */
export const usePostComments = (postId: string, options?: Partial<UseQueryOptions<PostComment[], Error>>) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.comments(postId),
    queryFn: () => postApi.getPostComments(postId),
    enabled: !!postId,
    ...options,
  })
}

/**
 * Hook to add a comment
 */
export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: postApi.AddCommentData) => postApi.addComment(postId, data),
    onMutate: async (data) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.posts.detail(postId) })
      const previousPost = queryClient.getQueryData<Post>(QUERY_KEYS.posts.detail(postId))

      if (previousPost) {
        const newComment = {
          username: data.username,
          message: data.message,
          createdAt: new Date().toISOString(),
        }
        
        queryClient.setQueryData(QUERY_KEYS.posts.detail(postId), {
          ...previousPost,
          comments: [...previousPost.comments, newComment],
          commentsCount: previousPost.commentsCount + 1,
        })
      }

      return { previousPost }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.posts.detail(postId), context.previousPost)
      }
    },
    onSuccess: () => {
      // Invalidate lists to reflect changes in PostList
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.lists() })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.comments(postId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(postId) })
    },
  })
}

/**
 * Hook to delete a comment
 */
export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: string) => postApi.deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.comments(postId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(postId) })
    },
  })
}

/**
 * Hook to share a post
 */
export const useSharePost = (postId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => postApi.sharePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts.detail(postId) })
    },
  })
}

export { QUERY_KEYS }
