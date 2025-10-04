import { cn } from '@/shared/utils/helpers/cn';
import Image from 'next/image';
import React from 'react';
import { Fallback } from '../../common/fallback';

interface ResponsiveImageProps {
    src?: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}

export default function ResponsiveImage({ src, alt, width, height, className }: ResponsiveImageProps) {
    const shimmer = `
        relative before:absolute before:inset-0 before:animate-pulse
        before:bg-gradient-to-r before:from-gray-200 before:via-gray-300 before:to-gray-200
    `;

    return (
        <Fallback condition={Boolean(src)}>
            <div className={cn(`relative w-${width} h-${height} rounded-full overflow-hidden`, className)}>
                <Image src={src!} alt={alt} fill className={cn('w-full object-cover', shimmer)} priority />
            </div>
        </Fallback>
    );
}
