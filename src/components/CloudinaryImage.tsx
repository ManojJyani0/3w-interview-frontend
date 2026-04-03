/**
 * CloudinaryImage Component
 * A wrapper around Cloudinary's Image component with sensible defaults
 * Supports both Cloudinary URLs and regular image URLs
 */

import React from 'react';
import { Image } from 'cloudinary-react';
import { Box } from '@mui/material';
import type { BoxProps, SxProps } from '@mui/material';
import {
  getCloudinaryUrl,
  extractPublicId,
  isCloudinaryUrl,
  TRANSFORMATIONS,
} from '@/lib/cloudinary';

export interface CloudinaryImageProps extends Omit<BoxProps, 'component'> {
  /**
   * Image source - can be a Cloudinary public ID, Cloudinary URL, or regular URL
   */
  src: string;
  
  /**
   * Alt text for accessibility
   */
  alt?: string;
  
  /**
   * Width of the image (in pixels or CSS string)
   */
  width?: number | string;
  
  /**
   * Height of the image (in pixels or CSS string)
   */
  height?: number | string;
  
  /**
   * Transformation preset or custom transformations
   */
  transformation?: keyof typeof TRANSFORMATIONS | Record<string, any>;
  
  /**
   * Whether to use responsive sizing
   */
  responsive?: boolean;
  
  /**
   * Whether to crop the image
   */
  crop?: string;
  
  /**
   * Image quality (auto, good, best, eco, low)
   */
  quality?: string;
  
  /**
   * Custom CSS styles
   */
  sx?: SxProps;
  
  /**
   * Additional props passed to the underlying img element
   */
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

/**
 * CloudinaryImage Component
 * 
 * Usage:
 * ```tsx
 * <CloudinaryImage 
 *   src="https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *   alt="Sample image"
 *   width={300}
 *   height={200}
 *   transformation="POST_IMAGE"
 * />
 * ```
 * 
 * Or with public ID:
 * ```tsx
 * <CloudinaryImage 
 *   src="sample.jpg"
 *   alt="Sample image"
 *   transformation={{ width: 300, height: 200, crop: 'fill' }}
 * />
 * ```
 */
export default function CloudinaryImage({
  src,
  alt = '',
  width,
  height,
  transformation,
  responsive = true,
  crop,
  quality = 'auto',
  sx = {},
  imgProps = {},
  ...boxProps
}: CloudinaryImageProps) {
  // Determine if this is a Cloudinary URL
  const isCloudinary = isCloudinaryUrl(src);
  
  // Get transformation parameters
  let transformParams: Record<string, any> = {};
  
  if (transformation) {
    if (typeof transformation === 'string') {
      transformParams = { ...TRANSFORMATIONS[transformation] };
    } else {
      transformParams = { ...transformation };
    }
  }
  
  // Override with explicit props if provided
  if (width !== undefined) transformParams.width = width;
  if (height !== undefined) transformParams.height = height;
  if (crop !== undefined) transformParams.crop = crop;
  if (quality !== undefined) transformParams.quality = quality;
  
  // Add responsive flag if needed
  if (responsive && !transformParams.width && !transformParams.height) {
    transformParams.responsive = true;
  }
  
  // If it's not a Cloudinary URL or we have no transformations, use regular img
  if (!isCloudinary && Object.keys(transformParams).length === 0) {
    return (
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          ...sx,
        }}
        {...imgProps}
        {...boxProps}
      />
    );
  }
  
  // For Cloudinary URLs with transformations, use Cloudinary Image component
  if (isCloudinary) {
    const publicId = extractPublicId(src);
    
    return (
      <Box
        sx={{
          display: 'inline-block',
          maxWidth: '100%',
          ...sx,
        }}
        {...boxProps}
      >
        <Image
          cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'}
          publicId={publicId}
          alt={alt}
          width={typeof width === 'number' ? width.toString() : width}
          height={typeof height === 'number' ? height.toString() : height}
          crop={crop}
          quality={quality}
          responsive={responsive}
          {...transformParams}
          {...imgProps}
          src={src}
        />
      </Box>
    );
  }
  
  // For non-Cloudinary URLs with transformations, generate URL with transformations
  const cloudinaryUrl = getCloudinaryUrl(src, transformParams);
  
  return (
    <Box
      component="img"
      src={cloudinaryUrl}
      alt={alt}
      sx={{
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        ...sx,
      }}
      {...imgProps}
      {...boxProps}
    />
  );
}

/**
 * Helper component for post images with standard transformations
 */
export function PostImage(props: Omit<CloudinaryImageProps, 'transformation'>) {
  return <CloudinaryImage transformation="POST_IMAGE" {...props} />;
}

/**
 * Helper component for avatar images with standard transformations
 */
export function AvatarImage(props: Omit<CloudinaryImageProps, 'transformation'>) {
  return <CloudinaryImage transformation="AVATAR" {...props} />;
}

/**
 * Helper component for thumbnail images with standard transformations
 */
export function ThumbnailImage(props: Omit<CloudinaryImageProps, 'transformation'>) {
  return <CloudinaryImage transformation="THUMBNAIL" {...props} />;
}