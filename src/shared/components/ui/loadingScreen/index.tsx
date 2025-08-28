import { cn } from '@/shared/utils';
import { Title } from '../title';
import { Box } from '../box';

interface LoadingScreenProps {
    loading?: boolean;
    className?: string;
    description?: string;
}

export function LoadingScreen({ loading = true, className, description }: LoadingScreenProps) {
    if (!loading) {
        return <></>;
    }

    return (
        <div
            className={cn(
                'flex h-screen w-screen items-center justify-center bg-snow-white dark:bg-matte-black',
                className,
            )}
        >
            <Box className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-soft-gold dark:border-gray-700 dark:border-t-soft-gold" />
                <Title className="text-sm text-matte-black dark:text-snow-white">
                    {description || 'Carregando...'}
                </Title>
            </Box>
        </div>
    );
}
