import { cn } from '@/shared/utils/helpers/cn';

interface FormContainerProps {
    children: React.ReactNode;
    className?: string;
    columns?: number;
}

export function FormContainer({ children, className, columns = 2 }: FormContainerProps) {
    return (
        <div className={cn(`grid grid-cols-1 md:grid-cols-${columns} gap-2 md:gap-8 md:space-y-6 `, className)}>
            {children}
        </div>
    );
}
