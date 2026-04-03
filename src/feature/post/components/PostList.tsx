/**
 * PostList Component
 * Displays a list of posts with loading and error states
 * Mobile-first responsive design
 */

import { useEffect, useRef } from 'react'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import { useInfinitePosts } from '../hooks'
import PostCard from './PostCard'
import CreatePost from './CreatePost'

export default function PostList() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts(10)

  const posts = data?.pages.flat() || []
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load posts. Please try again later.
      </Alert>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Create Post */}
      <CreatePost />

      {/* Posts List */}
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to share something!
          </Typography>
        </Box>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
          {/* Loading indicator for next page */}
          {isFetchingNextPage && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 3,
                gap: 1,
              }}
            >
              <CircularProgress size={32} />
              <Typography variant="body2" color="text.secondary">
                Loading more posts...
              </Typography>
            </Box>
          )}
          {/* Sentinel for infinite scroll - only if there are more pages */}
          {hasNextPage && !isFetchingNextPage && (
            <div ref={sentinelRef} style={{ height: '50px' }} />
          )}
        </>
      )}
    </Box>
  )
}
