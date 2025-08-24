import { cn } from '@/shared/utils/cn';

interface FormFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function FormFooter({ children, className }: FormFooterProps) {
    return <div className={cn('flex flex-col sm:flex-row justify-end gap-4 mt-8', className)}>{children}</div>;
}
