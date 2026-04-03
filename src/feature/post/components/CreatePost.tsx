/**
 * CreatePost Component
 * Allows users to create new posts with text and images
 * Mobile-first design with responsive layout
 * Requires authentication - redirects to login if not authenticated
 * Integrated with backend for direct image uploads to MongoDB
 */

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  Image as ImageIcon,
  Close as CloseIcon,
  Send as SendIcon,
  LockOutlined,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { useCreatePost } from '../hooks'
import { useAuthContext } from '@/lib/auth-context'
import { useFileUpload } from '@/lib/file-upload'

export default function CreatePost() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  
  const createPostMutation = useCreatePost()
  const { isAuthenticated, user } = useAuthContext()
  const { uploadFile, isUploading, error: uploadError, resetError } = useFileUpload()

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <LockOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Sign in to create a post
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Join our community and start sharing your thoughts with others.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              href="/login"
            >
              Sign In
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              href="/signup"
              sx={{ ml: 1 }}
            >
              Sign Up
            </Button>
          </Box>
        </CardContent>
      </Card>
    )
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    resetError()
    
    try {
      // Upload each file to backend
      const uploadPromises = Array.from(files).map((file) =>
        uploadFile(file, 'post_image')
      )
      const uploadedUrls = await Promise.all(uploadPromises)
      
      // Add uploaded URLs to images array
      console.log('Uploaded URLs:', uploadedUrls)
      setImages([...images, ...uploadedUrls])
    } catch (err: any) {
      console.error('Upload failed:', err)
      // Error is already set in the hook
    }
  }
console.log(images)
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!content.trim() || !user) return

    try {
      await createPostMutation.mutateAsync({
        content,
        authorId: user.id, // Use user ID from auth context
        images: images.length > 0 ? images : undefined,
      })
      
      // Reset form
      setContent('')
      setImages([])
      setIsExpanded(false)
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const isLoading = createPostMutation.isPending || isUploading

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
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }} />
          
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              minRows={isExpanded ? 3 : 1}
              maxRows={8}
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                },
              }}
            />

           {/* Upload Status */}
           {isUploading && (
             <Box sx={{ mb: 2 }}>
               <LinearProgress />
               <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                 Uploading image...
               </Typography>
             </Box>
           )}

           {uploadError && (
             <Alert
               severity="error"
               sx={{ mb: 2 }}
               onClose={resetError}
             >
               {uploadError}
             </Alert>
           )}

           {/* Image Preview */}
           {images.length > 0 && (
              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                  },
                  mb: 2,
                }}
              >
                {images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      borderRadius: 1,
                      overflow: 'hidden',
                      paddingTop: '100%',
                    }}
                  >
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.8)',
                        },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <input
                  accept="image/*"
                  id="image-upload"
                  type="file"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    component="span"
                    startIcon={isUploading ? <CloudUploadIcon /> : <ImageIcon />}
                    size="small"
                    variant="outlined"
                    disabled={isUploading}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                    }}
                  >
                    {isUploading ? 'Uploading...' : 'Photo'}
                  </Button>
                </label>
                
                {isExpanded && (
                  <Chip
                    label="Public"
                    size="small"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                    }}
                  />
                )}
              </Box>

              {(isExpanded || content || images.length > 0) && (
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSubmit}
                  disabled={isLoading || !content.trim()}
                  sx={{
                    px: 3,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  }}
                >
                  Post
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
