import { cn } from '@/shared/utils/helpers';

export interface TitleProps {
    children?: React.ReactNode;
    className?: string;
    primary?: boolean;
    onClick?: () => void;
}

export function Title({ children, className, primary = false, onClick, ...props }: TitleProps) {
    return (
        <h1
            className={cn(
                'py-4 flex items-center font-bold justify-center text-2xl transition ',
                primary ? 'text-soft-gold dark:text-soft-gold-dark' : 'text-gray-800 dark:text-white/90',
                onClick && 'cursor-pointer',
                className,
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </h1>
    );
}
