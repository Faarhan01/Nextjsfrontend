'use client';

import React, { useState, useEffect } from 'react';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  placeholderType?: string;
  fallbackTitle?: string;
  loading?: 'lazy' | 'eager';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '',
  className = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
  placeholderType,
  fallbackTitle,
  loading = 'lazy',
  referrerPolicy = 'no-referrer',
  ...props
}) => {
  const initialSrc = typeof src === 'string' && src.trim() !== '' ? src : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (typeof src === 'string' && src.trim() !== '') {
      setImgSrc(src);
      setHasError(false);
    } else {
      setImgSrc(fallbackSrc);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || fallbackTitle || ''}
      className={className}
      loading={loading}
      referrerPolicy={referrerPolicy}
      onError={handleError}
      {...props}
    />
  );
};

export default SafeImage;
