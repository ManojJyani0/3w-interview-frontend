/**
 * PostCard Component
 * Displays a single post with interactions (like, comment, share)
 * Mobile-first design: optimized for mobile screens, scales up for larger devices
 * Fully integrated with backend API following backend-api-integration.md guidelines
 */

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Favorite as LikeIcon,
  FavoriteBorder as UnlikeIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import type { Post } from '../types'
import {
  useLikePost,
  useUnlikePost,
  useAddComment,
  useSharePost,
  useDeletePost,
  useUpdatePost,
} from '../hooks'
import { useAuthContext } from '@/lib/auth-context'

interface PostCardProps {
  post: Post
  showComments?: boolean
}

export default function PostCard({
  post,
  showComments = false,
}: PostCardProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user, isAuthenticated } = useAuthContext()
  
  // State management
  const [commentOpen, setCommentOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [error, setError] = useState<string | null>(null)

  // API hooks with backend integration
  const likeMutation = useLikePost(post._id)
  const unlikeMutation = useUnlikePost(post._id)
  const addCommentMutation = useAddComment(post._id)
  const shareMutation = useSharePost(post._id)
  const deleteMutation = useDeletePost()
  const updateMutation = useUpdatePost(post._id)

  // Helper function to get username from user object
  const getUsername = () => {
    if (!user) return 'anonymous'
    
    if (user.name && user.name.trim()) {
      return user.name
    } else if (user.email) {
      return user.email.split('@')[0]
    } else if (user.id) {
      return user.id
    }
    
    return 'anonymous'
  }

  // Check if current user liked the post
  const currentUsername = getUsername()
  const isLiked = post.likedBy?.some(username => username === currentUsername) || false

  // Handler functions with API integration
  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to like posts')
      return
    }
    
    setError(null)
    
    const username = getUsername()
    
    try {
      if (isLiked) {
        await unlikeMutation.mutateAsync({ username })
      } else {
        await likeMutation.mutateAsync({ username })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update like status')
    }
  }

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return
    if (!isAuthenticated) {
      setError('Please sign in to comment')
      return
    }
    
    setError(null)
    
    // Get username from user object with better fallbacks (same as like function)
    let username = 'anonymous'
    if (user) {
      if (user.name && user.name.trim()) {
        username = user.name
      } else if (user.email) {
        username = user.email.split('@')[0]
      } else if (user.id) {
        username = user.id
      }
    }
    
    console.log('Using username for comment:', username)
    
    try {
      await addCommentMutation.mutateAsync({
        username,
        message: commentText,
      })
      setCommentText('')
      setCommentOpen(false)
    } catch (err: any) {
      setError(err.message || 'Failed to add comment')
    }
  }

  const handleShare = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to share posts')
      return
    }
    
    setError(null)
    try {
      await shareMutation.mutateAsync()
      // You could add a success notification here
    } catch (err: any) {
      setError(err.message || 'Failed to share post')
    }
  }

  const handleDelete = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to delete posts')
      return
    }
    
    setError(null)
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteMutation.mutateAsync(post._id)
      } catch (err: any) {
        setError(err.message || 'Failed to delete post')
      }
    }
  }

  const handleEdit = async (newContent: string) => {
    if (!isAuthenticated) {
      setError('Please sign in to edit posts')
      return
    }
    
    setError(null)
    try {
      await updateMutation.mutateAsync({ content: newContent })
      setEditMode(false)
      setEditContent(newContent)
    } catch (err: any) {
      setError(err.message || 'Failed to update post')
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 2,
        border: '1px solid var(--line)',
        background: 'var(--surface)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Error Display */}
      {error && (
        <Alert
          severity="error"
          sx={{ m: 2, mt: 0 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Post Header */}
      <CardContent sx={{ p: 2, pb: '12px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar
            sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
            alt={post.authorId}
          />
          <Box sx={{ ml: 1.5, flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              User {post.authorId.slice(0, 4)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTimeAgo(post.createdAt)}
            </Typography>
          </Box>
          <IconButton onClick={() => setMenuOpen(!menuOpen)} size="small">
            <MoreIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Post Content */}
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            fontSize: { xs: '0.9375rem', sm: '1rem' },
          }}
        >
          {post.content}
        </Typography>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: {
                xs: '1fr', // Mobile: single column
                sm: post.images.length > 1 ? 'repeat(2, 1fr)' : '1fr', // Tablet+: 2 columns if multiple images
              },
              mb: 2,
            }}
          >
            {post.images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  paddingTop: '100%', // Square aspect ratio
                }}
              >
                <Box
                  component="img"
                  src={image}
                  alt={`Post image ${index + 1}`}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Post Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {post.likesCount} likes
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {post.commentsCount} comments
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {post.sharesCount} shares
          </Typography>
        </Box>
      </CardContent>

      {/* Post Actions */}
      <CardActions
        sx={{
          px: 2,
          py: 1,
          justifyContent: 'space-around',
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Button
          startIcon={
            likeMutation.isLoading || unlikeMutation.isLoading ? (
              <CircularProgress size={16} />
            ) : isLiked ? (
              <LikeIcon color="error" />
            ) : (
              <UnlikeIcon />
            )
          }
          onClick={handleLikeClick}
          size="small"
          disabled={likeMutation.isLoading || unlikeMutation.isLoading}
          sx={{
            flex: 1,
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            color: isLiked ? 'error.main' : 'text.secondary',
          }}
        >
          {likeMutation.isLoading || unlikeMutation.isLoading ? 'Updating...' : isLiked ? 'Liked' : 'Like'}
        </Button>
        <Button
          startIcon={<CommentIcon />}
          onClick={() => setCommentOpen(true)}
          size="small"
          sx={{
            flex: 1,
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            color: 'text.secondary',
          }}
        >
          Comment
        </Button>
        <Button
          startIcon={<ShareIcon />}
          onClick={handleShare}
          size="small"
          sx={{
            flex: 1,
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            color: 'text.secondary',
          }}
        >
          Share
        </Button>
      </CardActions>

      {/* Comments Dialog */}
      <Dialog
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {post.comments.map((comment, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
                  <Typography variant="subtitle2">{comment.username}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {formatTimeAgo(comment.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 6 }}>
                  {comment.message}
                </Typography>
              </Box>
            ))}
          </Box>
          <TextField
            fullWidth
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            multiline
            maxRows={4}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCommentSubmit}
            variant="contained"
            disabled={!commentText.trim() || addCommentMutation.isLoading}
            startIcon={addCommentMutation.isLoading ? <CircularProgress size={16} /> : null}
          >
            {addCommentMutation.isLoading ? 'Posting...' : 'Post'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu Options */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 2,
          display: menuOpen ? 'block' : 'none',
          zIndex: 10,
        }}
      >
        <Button
          startIcon={<EditIcon />}
          onClick={() => {
            setEditMode(true)
            setEditContent(post.content)
            setMenuOpen(false)
          }}
          fullWidth
          sx={{ justifyContent: 'flex-start' }}
        >
          Edit
        </Button>
        <Button
          startIcon={<DeleteIcon color="error" />}
          onClick={handleDelete}
          fullWidth
          sx={{ justifyContent: 'flex-start', color: 'error.main' }}
        >
          Delete
        </Button>
      </Box>
    </Card>
  )
}
