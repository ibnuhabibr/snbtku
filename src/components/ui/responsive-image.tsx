import { useState, useEffect } from 'react';
import { useOptimizedImage, ResponsiveImageProps } from '@/lib/image-optimization';

/**
 * Responsive image component with lazy loading and optimization
 * This component optimizes images for different device sizes and loading scenarios
 */
export default function ResponsiveImage({
  src,
  alt,
  sizes = '100vw',
  className = '',
  loading = 'lazy',
  width,
  height
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const optimizedSrc = useOptimizedImage(src, 'medium');
  const placeholderSrc = useOptimizedImage(src, 'thumbnail');
  
  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
  }, [src]);
  
  // Handle image loading
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  // Handle image loading error
  const handleError = () => {
    setIsError(true);
    console.error(`Failed to load image: ${src}`);
  };
  
  // Placeholder for failed images
  if (isError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
        style={{ width: width || '100%', height: height || 200 }}
        role="img"
        aria-label={alt}
      >
        <span className="text-sm">Image not available</span>
      </div>
    );
  }
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Low quality placeholder */}
      {!isLoaded && (
        <img
          src={placeholderSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover filter blur-sm transition-opacity duration-300"
          aria-hidden="true"
          width={width}
          height={height}
        />
      )}
      
      {/* Main image with srcSet for responsive loading */}
      <img
        src={optimizedSrc}
        srcSet={`
          ${useOptimizedImage(src, 'thumbnail')} 150w,
          ${useOptimizedImage(src, 'medium')} 600w,
          ${useOptimizedImage(src, 'large')} 1200w
        `}
        sizes={sizes}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        width={width}
        height={height}
      />
    </div>
  );
}
