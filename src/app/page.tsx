'use client';

import { LinkButton, Title, Step, Paragraph } from '@/shared/components/ui';
import { Box } from '@/shared/components/ui/box';
import ThemeToggleButton from '@/shared/components/ui/themeToggleButton';

export default function Home() {
    return (
        <Box>
            <header className="sticky w-full top-0 z-50 mx-auto flex justify-center px-6 bg-white dark:bg-matte-black">
                <Box className="flex flex-row w-full justify-between max-w-screen-xl bg-white dark:bg-matte-black">
                    <div className="flex items-center gap-4">
                        <Title className="text-2xl font-bold text-matte-black dark:text-snow-white font-nanum-brush">
                            Qinstante
                        </Title>
                    </div>

                    <div className="flex items-center gap-2">
                        <LinkButton type="secondary" href="/entrar" className="bg-white">
                            Fazer login
                        </LinkButton>
                        <LinkButton type="primary" href="/cadastro">
                            Cadastre-se
                        </LinkButton>
                    </div>
                </Box>
            </header>
            <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
                <ThemeToggleButton type="secondary" />
            </div>

            <Box className="flex flex-col items-center justify-center py-8">
                <Box className="text-center items-center justify-center mb-12 max-w-2xl px-4">
                    <Title className="text-3xl md:text-4xl py-10 font-bold text-matte-black dark:text-snow-white mb-6 leading-tight">
                        Capture e guarde os melhores momentos do seu dia mais especial
                    </Title>
                    <Paragraph className="italic opacity-70 text-lg">
                        Qinstante é uma plataforma totalmente online, sem a necessidade de instalar aplicativos.
                        É a forma mais simples de capturar os melhores momentos do seu casamento com as pessoas
                        que você ama.
                    </Paragraph>
                </Box>

                <Box type="secondary" className="mb-8 w-full p-6 ">
                    <Box type="secondary" className="max-w-2xl mx-auto justify-start items-start">
                        <Title className="text-2xl font-bold text-matte-black dark:text-snow-white mb-8">
                            É muuuito fácil!
                        </Title>

                        <Box type="secondary" className="mx-auto space-y-4 justify-start items-start">
                            <Step number={1}>Faça o seu cadastro</Step>
                            <Step number={2}>Escolha o seu plano</Step>
                            <Step number={3}>Gere o seu QRCode</Step>
                            <Step number={4}>Imprima e distribua por todo o seu evento</Step>
                            <Step number={5}>
                                As fotos serão armazenadas na sua conta pelo tempo contratado
                            </Step>
                        </Box>
                    </Box>
                </Box>

                <Box className="flex items-center justify-center">
                    <LinkButton
                        type="primary"
                        href="/cadastro"
                        className="text-lg py-6 w-[360px] rounded-xl max-w-[95%]"
                    >
                        Fazer o cadastro agora
                    </LinkButton>
                </Box>
            </Box>
        </Box>
    );
}
