/**
 * File Upload Hook
 * Handles direct uploads to backend (MongoDB storage)
 * Replaces Cloudinary upload functionality
 */

import { useState } from 'react'
import api from '../service/api'

export type UploadType = 'post_image' | 'user_avatar' | 'user_profile'

interface UploadResponse {
  url: string
  id?: string
  filename?: string
}

interface UseFileUploadReturn {
  isUploading: boolean
  error: string | null
  uploadFile: (file: File, type: UploadType) => Promise<string>
  resetError: () => void
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Upload file directly to backend
   * Backend endpoint: POST /api/upload
   * Expects multipart/form-data with file field 'file' and optional 'type'
   * Returns { url: string } where url is the stored image URL or identifier
   */
  const uploadFile = async (
    file: File,
    type: UploadType
  ): Promise<string> => {
    setIsUploading(true)
    setError(null)

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      // Use fetch directly because api service expects JSON
      const response = await fetch('http://localhost:5000/api/images', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for auth
        // Note: Do not set Content-Type header, browser will set it with boundary
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Upload failed' }))
        throw new Error(error.error || error.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result: UploadResponse = await response.json()
      
      console.log('Upload response:', result)

      if (!result.data.url) {
        throw new Error('Upload succeeded but no URL returned')
      }

      console.log('Upload successful, URL:', result.data.url)
      return result.data.url
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * Reset error state
   */
  const resetError = () => {
    setError(null)
  }

  return {
    uploadFile,
    isUploading,
    error,
    resetError,
  }
}