import { cn } from '@/shared/utils';

export interface ParagraphProps {
    children?: React.ReactNode;
    className?: string;
    primary?: boolean;
}

export function Paragraph({ children, className, primary = false, ...props }: ParagraphProps) {
    return (
        <p
            className={cn(
                'py-4 flex items-center justify-center text-2xl transition ',
                primary ? 'text-brand-500 dark:text-brand-900' : 'text-gray-800 dark:text-white/90',
                className,
            )}
            {...props}
        >
            {children}
        </p>
    );
}
