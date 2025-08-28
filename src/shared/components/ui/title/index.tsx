import { cn } from '@/shared/utils/helpers';

export interface TitleProps {
    children?: React.ReactNode;
    className?: string;
    primary?: boolean;
}

export function Title({ children, className, primary = false, ...props }: TitleProps) {
    return (
        <h1
            className={cn(
                'py-4 flex items-center font-bold justify-center text-2xl transition ',
                primary ? 'text-brand-500 dark:text-brand-900' : 'text-gray-800 dark:text-white/90',
                className,
            )}
            {...props}
        >
            {children}
        </h1>
    );
}
