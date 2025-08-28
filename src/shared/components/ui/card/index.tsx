import { cn } from '@/shared/utils/helpers/cn';

interface CardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    primary?: boolean;
    className?: string;
}

export function Card({ title, description, icon = <></>, primary = false, className }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-theme-xs',
                primary ? 'bg-soft-gold dark:bg-brand-900' : 'bg-white dark:bg-gray-800',
                className,
            )}
        >
            <div className="text-gray-800 dark:text-gray-50">{icon}</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-50">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    );
}
