import { cn } from '@/shared/utils/helpers/cn';

interface FormContainerProps {
    children: React.ReactNode;
    className?: string;
    columns?: 1 | 2 | 3 | 4;
}

// Classes LITERAIS — o Tailwind só gera o que enxerga como string; `md:grid-cols-${n}`
// dinâmico não era compilado e os forms ficavam em 1 coluna mesmo no desktop.
const columnsClass: Record<NonNullable<FormContainerProps['columns']>, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
};

export function FormContainer({ children, className, columns = 2 }: FormContainerProps) {
    return (
        <div className={cn('grid grid-cols-1 gap-2 md:gap-8 md:space-y-6', columnsClass[columns], className)}>
            {children}
        </div>
    );
}
