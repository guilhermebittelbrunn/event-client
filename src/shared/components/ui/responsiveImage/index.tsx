'use client';

import { cn } from '@/shared/utils/helpers/cn';
import Image from 'next/image';
import { useState } from 'react';
import { Fallback } from '../../common/fallback';

interface ResponsiveImageProps {
    src?: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
}

export default function ResponsiveImage({
    src,
    alt,
    width,
    height,
    className,
    priority = false,
}: ResponsiveImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <Fallback condition={Boolean(src)}>
            <div className={cn(`relative w-${width} h-${height} rounded-full overflow-hidden`, className)}>
                {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
                )}

                {hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <svg
                            className="w-6 h-6 text-gray-400 dark:text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                )}

                {!hasError && (
                    <Image
                        src={src!}
                        alt={alt}
                        fill
                        className={cn(
                            'w-full object-cover transition-opacity duration-300',
                            isLoading ? 'opacity-0' : 'opacity-100',
                        )}
                        priority={priority}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}
            </div>
        </Fallback>
    );
}
