import { Logo } from '@/shared/assets/icons';
import { LinkButton } from '@/shared/components/ui';
import { Title } from '@/shared/components/ui/title';
import React from 'react';

export default function NotFound() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
            <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px] flex flex-col items-center justify-center">
                <Title className="text-4xl">Página não encontrada</Title>

                <div className="flex items-center justify-center">
                    <Logo width={72} height={72} />
                </div>

                <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
                    Ops! Parece que este pet ainda não encontrou um lar. Vamos voltar para a página inicial e
                    encontrar outros animais que precisam de um lar amoroso!
                </p>

                <LinkButton href="/">Voltar para a Página Inicial</LinkButton>
            </div>

            <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Event-Client - Todos os direitos reservados
            </p>
        </div>
    );
}
