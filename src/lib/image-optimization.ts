/**
 * Image optimization utilities for SNBTKU
 * This file contains utilities for optimizing images and lazy loading them
 */

// Image lazy loading hook
export function useOptimizedImage(src: string, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string {
  // If it's already an optimized image URL (e.g., from a CDN), return as is
  if (src.includes('imagedelivery.net') || src.includes('optimized=true')) {
    return src;
  }

  // Create size parameters
  const dimensions = {
    thumbnail: 'width=150',
    medium: 'width=600',
    large: 'width=1200'
  };

  // Add image optimization parameters
  const baseUrl = import.meta.env.VITE_IMAGE_OPTIMIZATION_URL || '';
  
  if (baseUrl && src.startsWith('/')) {
    // For local images
    return `${baseUrl}${src}?${dimensions[size]}&quality=80&format=webp`;
  } else if (baseUrl && src.startsWith('http')) {
    // For remote images
    return `${baseUrl}?url=${encodeURIComponent(src)}&${dimensions[size]}&quality=80&format=webp`;
  }
  
  // Fallback to original image if no optimization service is available
  return src;
}

// Prefetch critical images
export function prefetchCriticalImages(imagePaths: string[]): void {
  if (typeof window === 'undefined') return;
  
  // Use requestIdleCallback for better performance
  const prefetch = () => {
    imagePaths.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = path;
      document.head.appendChild(link);
    });
  };
  
  if ('requestIdleCallback' in window) {
    // @ts-ignore - requestIdleCallback is not in TypeScript's lib.dom.d.ts
    window.requestIdleCallback(prefetch, { timeout: 2000 });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(prefetch, 1000);
  }
}

// Responsive image component props
export interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

// Check if webp is supported
export function supportsWebp(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (canvas) {
    return canvas.getContext && canvas.getContext('2d') 
      ? canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      : false;
  }
  return false;
}

// Get the appropriate image format based on browser support
export function getOptimalImageFormat(): 'webp' | 'jpg' {
  return supportsWebp() ? 'webp' : 'jpg';
}
