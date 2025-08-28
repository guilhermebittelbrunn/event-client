import { cn } from '@/shared/utils/helpers/cn';
import Image from 'next/image';
import React from 'react';

export default function ResponsiveImage({
    src,
    alt,
    width,
    height,
    className,
}: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className: string;
}) {
    return (
        <div className="relative">
            <div className="overflow-hidden">
                <Image
                    src={src}
                    alt={alt}
                    className={cn('w-full border border-gray-200 rounded-xl dark:border-gray-800', className)}
                    width={width}
                    height={height}
                />
            </div>
        </div>
    );
}
