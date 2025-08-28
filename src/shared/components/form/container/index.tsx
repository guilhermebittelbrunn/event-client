import { cn } from '@/shared/utils/helpers/cn';

interface FormContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function FormContainer({ children, className }: FormContainerProps) {
    return (
        <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 md:space-y-6 ', className)}>
            {children}
        </div>
    );
}
