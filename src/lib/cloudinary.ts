/**
 * Cloudinary Configuration and Utilities
 * Provides Cloudinary setup for image rendering and transformations
 */

/**
 * Cloudinary configuration constants
 */
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  secure: true,
};

/**
 * Get Cloudinary URL for an image with optional transformations
 * @param publicId - The Cloudinary public ID or full URL
 * @param transformations - Optional transformation parameters
 * @returns Complete Cloudinary URL
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations: Record<string, any> = {}
): string {
  // If it's already a Cloudinary URL, return as-is
  if (publicId.includes('cloudinary.com')) {
    return publicId;
  }

  // If it's a full URL but not Cloudinary, return as-is
  if (publicId.startsWith('http')) {
    return publicId;
  }

  const cloudName = CLOUDINARY_CONFIG.cloudName;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  // Build transformation string
  const transformParams = Object.entries(transformations)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');

  const transformStr = transformParams ? `/${transformParams}` : '';

  return `${baseUrl}${transformStr}/${publicId}`;
}

/**
 * Common transformation presets for different use cases
 */
export const TRANSFORMATIONS = {
  THUMBNAIL: {
    width: 300,
    height: 300,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  },
  POST_IMAGE: {
    width: 800,
    height: 600,
    crop: 'limit',
    quality: 'auto',
    fetch_format: 'auto',
  },
  AVATAR: {
    width: 100,
    height: 100,
    crop: 'thumb',
    gravity: 'face',
    quality: 'auto',
    fetch_format: 'auto',
  },
  PROFILE: {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  },
};

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID or original URL if not a Cloudinary URL
 */
export function extractPublicId(url: string): string {
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex !== -1 && uploadIndex + 1 < pathParts.length) {
      // Skip transformation parameters if present
      const publicIdParts = pathParts.slice(uploadIndex + 1);
      return publicIdParts.join('/');
    }
  } catch (error) {
    // If URL parsing fails, return original
  }

  return url;
}

/**
 * Check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com');
}
