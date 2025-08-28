import { cn } from '@/shared/utils/helpers/cn';

interface StepProps {
    number: number;
    children: React.ReactNode;
    className?: string;
}

export function Step({ number, children, className }: StepProps) {
    return (
        <div className={cn('flex items-start gap-4', className)}>
            <div className="flex-shrink-0 w-8 h-8 bg-soft-gold dark:bg-soft-gold-dark dark:text-white text-snow-white rounded-full flex items-center justify-center font-bold text-sm">
                {number}
            </div>
            <p className="text-matte-black dark:text-snow-white text-lg">{children}</p>
        </div>
    );
}
