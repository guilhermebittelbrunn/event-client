import { cn } from '@/shared/utils';

interface LoadingProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}
const sizeMap = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-10 w-10',
};

export function Loading({ className, size = 'medium' }: LoadingProps) {
    return (
        <div
            className={cn(
                'animate-spin rounded-full border-4 border-gray-200 border-t-soft-gold dark:border-gray-700 dark:border-t-soft-gold',
                sizeMap[size],
                className,
            )}
        />
    );
}
