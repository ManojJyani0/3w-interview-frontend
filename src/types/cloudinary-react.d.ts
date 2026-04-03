/**
 * Type declarations for cloudinary-react
 * Since @types/cloudinary-react doesn't exist, we provide basic declarations
 */

declare module 'cloudinary-react' {
  import { ComponentType, ReactElement } from 'react';

  export interface CloudinaryComponentProps {
    cloudName?: string;
    publicId?: string;
    width?: string | number;
    height?: string | number;
    crop?: string;
    gravity?: string;
    quality?: string | number;
    radius?: string | number;
    effect?: string;
    opacity?: number;
    border?: string;
    background?: string;
    angle?: number;
    defaultImage?: string;
    [key: string]: any;
  }

  export interface ImageProps extends CloudinaryComponentProps {
    alt?: string;
    responsive?: boolean;
    responsiveUseBreakpoints?: boolean;
    dpr?: string | number;
    loading?: string;
    fetchFormat?: string;
    [key: string]: any;
  }

  export interface VideoProps extends CloudinaryComponentProps {
    controls?: boolean;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    preload?: string;
    poster?: string;
    [key: string]: any;
  }

  export interface TransformationProps extends CloudinaryComponentProps {
    [key: string]: any;
  }

  export class CloudinaryComponent<
    P extends CloudinaryComponentProps = CloudinaryComponentProps
  > extends React.Component<P> {}

  export class Image extends CloudinaryComponent<ImageProps> {}
  export class Video extends CloudinaryComponent<VideoProps> {}
  export class Transformation extends CloudinaryComponent<TransformationProps> {}

  export class CloudinaryContext extends React.Component<{
    cloudName?: string;
    secure?: boolean;
    [key: string]: any;
  }> {}
}