'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/utils';
import { PhotoSkeleton } from '../PhotoSkeleton';

interface ProgressiveImageProps {
    src?: string;
    alt: string;
    className?: string;
    containerClassName?: string;
    fill?: boolean;
    width?: number;
    height?: number;
    priority?: boolean;
    sizes?: string;
    onLoad?: () => void;
    onError?: () => void;
    showSkeleton?: boolean;
}

export const ProgressiveImage = ({
    src,
    alt,
    className,
    containerClassName,
    fill = true,
    width,
    height,
    priority = false,
    sizes = '(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw',
    onLoad,
    onError,
    showSkeleton = true,
}: ProgressiveImageProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | undefined>(src);

    useEffect(() => {
        setImageSrc(src);
        setIsLoading(true);
        setHasError(false);
    }, [src]);

    const handleLoad = () => {
        setIsLoading(false);
        onLoad?.();
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
        onError?.();
    };

    // se não tem src, mostra skeleton ou erro
    if (!imageSrc) {
        return (
            <div className={cn('relative aspect-square', containerClassName)}>
                {showSkeleton ? (
                    <PhotoSkeleton />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                        <span className="text-xs">Sem imagem</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={cn('relative aspect-square', containerClassName)}>
            {isLoading && showSkeleton && (
                <div className="absolute inset-0 z-10">
                    <PhotoSkeleton />
                </div>
            )}

            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                    <div className="text-center">
                        <svg
                            className="w-8 h-8 mx-auto mb-2 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="text-xs">Erro ao carregar</span>
                    </div>
                </div>
            )}

            {!hasError && (
                <Image
                    src={imageSrc}
                    alt={alt}
                    fill={fill}
                    width={fill ? undefined : width}
                    height={fill ? undefined : height}
                    sizes={sizes}
                    priority={priority}
                    className={cn(
                        'object-cover transition-opacity duration-500',
                        isLoading ? 'opacity-0' : 'opacity-100',
                        className,
                    )}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={priority ? 'eager' : 'lazy'}
                    quality={85}
                    unoptimized={false}
                />
            )}
        </div>
    );
};
