import { cn } from '@/shared/utils';
import { Box, Button, Paragraph, Title } from '../../ui';
import { useRedirect } from '@/shared/hooks';
import { EVENT_REDIRECT_SECONDS } from '@/shared/consts/event';
import { useEffect, useState } from 'react';

interface EventRedirectProps {
    seconds?: number;
    className?: string;
}

export default function EventRedirect({ seconds = EVENT_REDIRECT_SECONDS, className }: EventRedirectProps) {
    const { redirect } = useRedirect();
    const [countdown, setCountdown] = useState(seconds);

    useEffect(() => {
        const interval = setInterval(() => setCountdown(countdown - 1), 1000);
        return () => clearInterval(interval);
    }, [countdown]);

    return (
        <div
            className={cn(
                'flex h-screen w-screen items-center justify-center bg-white dark:bg-matte-black',
                className,
            )}
        >
            <Box className="flex flex-col items-center gap-4">
                <Title className="text-sm text-matte-black dark:text-snow-white">
                    Infelizmente o evento em que você está tentando acessar não está mais disponível no momento
                    ou você não tem permissão para acessá-lo.
                </Title>

                <Paragraph className="text-sm text-matte-black dark:text-snow-white">
                    Você será redirecionado em {countdown}...
                </Paragraph>

                <Button type="primary" onClick={() => redirect('/')}>
                    Voltar para a página inicial
                </Button>
            </Box>
        </div>
    );
}
