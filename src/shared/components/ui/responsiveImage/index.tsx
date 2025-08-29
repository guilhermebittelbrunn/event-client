import { cn } from '@/shared/utils/helpers/cn';
import Image from 'next/image';
import React from 'react';
import { Fallback } from '../../common/fallback';

export default function ResponsiveImage({
    src,
    alt,
    width,
    height,
    className,
}: {
    src?: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}) {
    return (
        <Fallback condition={Boolean(src)}>
            <div className={`relative w-${width} h-${height} rounded-full overflow-hidden`}>
                <Image src={src!} alt={alt} fill className={cn('w-full object-cover', className)} />
            </div>
        </Fallback>
    );
}
