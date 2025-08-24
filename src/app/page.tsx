'use client';

import { Card, LinkButton, Paragraph, Title } from '@/shared/components/ui';
import { Box } from '@/shared/components/ui/box';
import ThemeToggleButton from '@/shared/components/ui/themeToggleButton';
import React from 'react';

export default function Home() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Association Promotion Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-3">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="text-center md:text-left">
                            <h2 className="mb-3 text-2xl font-bold text-white">Faça parte da mudança</h2>
                            <p className="text-white/90">
                                Amplie seu alcance e conecte mais animais a lares amorosos. Junte-se à nossa
                                rede de parceiros e faça a diferença na vida de muitos animais.
                            </p>
                        </div>
                        <LinkButton href="./painel/entrar">Saiba mais</LinkButton>
                    </div>
                </div>
            </section>

            {/* Hero Section */}
            <Box primary className="relative flex flex-col items-center justify-center px-6 py-32 text-center">
                <Title className="mb-6 text-4xl font-bold text-white/90 sm:text-5xl xl:text-6xl">
                    Bem-vindo ao XXXX
                </Title>
                <Paragraph className="mb-8 max-w-2xl text-lg">
                    Conectando animais que precisam de um lar com pessoas que têm muito amor para dar. Faça
                    parte dessa história de amor e transformação.
                </Paragraph>
                <div className="flex flex-col gap-4 sm:flex-row max-sm:w-full max-sm:px-12">
                    <LinkButton type="default" href="./entrar" className="w-[120px]">
                        Entrar
                    </LinkButton>
                    <LinkButton href="./cadastro" className="w-[120px]">
                        Cadastre-se
                    </LinkButton>
                </div>
            </Box>

            {/* Features Section */}
            <Box className="px-6 py-16">
                <Box className="mx-auto max-w-7xl">
                    <Title className="mb-12 text-center text-3xl">Como Funciona</Title>
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <Card
                            title="Encontre seu Amigo"
                            description="Explore nossa lista de animais disponíveis para adoção e encontre seu novo melhor amigo."
                            icon={
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            }
                        />

                        {/* Feature 2 */}
                        <Card
                            title="Processo Seguro"
                            description="Todo o processo de adoção é acompanhado e verificado para garantir a segurança dos animais."
                            icon={
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                    />
                                </svg>
                            }
                        />

                        {/* Feature 3 */}
                        <Card
                            title="Encontre seu Amigo"
                            description="Ao adotar, você não só muda a vida de um animal, mas também a sua própria vida."
                            icon={
                                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            }
                        />
                    </div>
                </Box>
            </Box>

            <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                <ThemeToggleButton type="secondary" />
            </div>

            <footer className="mt-auto py-6 text-center bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Event-Client. Todos os direitos reservados.
                </p>
            </footer>
        </div>
    );
}
