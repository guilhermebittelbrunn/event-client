'use client';

import { LinkButton, Title, Paragraph, Button } from '@/shared/components/ui';
import { Box } from '@/shared/components/ui/box';
import ThemeToggleButton from '@/shared/components/ui/themeToggleButton';
import { useAuth } from '@/shared/store/useAuth';
import { InstagramEmbed } from 'react-social-media-embed';
import Image from 'next/image';

import coupleH from '../../public/images/couple-h.png';
import mockupIos from '../../public/images/home/mockup-ios.png';
import mockupDesktop from '../../public/images/home/mockup-desktop.png';
import { Collapse } from 'antd';

import { SiGmail } from 'react-icons/si';
import { FaInstagram } from 'react-icons/fa';

const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
};

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <Box className="w-full max-w-[1470px] mx-auto">
            <header className="sticky w-full top-0 z-50 mx-auto flex justify-center px-6 bg-white dark:bg-matte-black">
                <Box className="flex flex-row w-full justify-between max-w-screen-xl bg-white dark:bg-matte-black">
                    <div className="flex items-center gap-4">
                        <Title className="text-2xl font-bold text-matte-black dark:text-snow-white font-nanum-brush">
                            Qinstante
                        </Title>
                    </div>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <LinkButton type="secondary" href="/painel">
                                Painel
                            </LinkButton>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <LinkButton type="secondary" href="/entrar" className="bg-white p-2 sm:p-4">
                                Fazer login
                            </LinkButton>
                            <LinkButton type="primary" href="/cadastro" className="p-2 sm:p-4">
                                Cadastre-se
                            </LinkButton>
                        </div>
                    )}
                </Box>
            </header>
            <div className="fixed bottom-6 right-6 z-50  sm:block">
                <ThemeToggleButton type="secondary" />
            </div>

            {/* Hero: imagem com bg-cover (sem esticar), degradê opaco até o início da imagem */}
            <div id="inicio" className="relative w-full min-h-[660px] overflow-hidden">
                {/* Camada da imagem: cover para não esticar, posicionada mais alta */}
                <div
                    className="absolute inset-0 bg-no-repeat bg-cover bg-[50%_5%]"
                    style={{ backgroundImage: `url(${coupleH.src})` }}
                />
                {/* Degradê opaco do topo até o início da imagem */}
                <div
                    className="absolute inset-0 pointer-events-none dark:hidden"
                    style={{
                        background:
                            'linear-gradient(to bottom, rgb(255 255 255) 0%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.6) 42%, transparent 50%)',
                    }}
                />
                <div
                    className="absolute inset-0 pointer-events-none hidden dark:block"
                    style={{
                        background:
                            'linear-gradient(to bottom, rgb(28 28 28) 0%, rgba(28,28,28,0.95) 30%, rgba(28,28,28,0.6) 42%, transparent 50%)',
                    }}
                />
                <div className="relative flex flex-col items-center justify-center gap-4 pt-8 pb-20 px-4">
                    <div className="flex flex-col py-8 max-w-2xl text-center">
                        <h1 className="text-4xl md:text-5xl font-playfair font-semibold text-matte-black dark:text-snow-white">
                            Transforme seu evento em uma experiência ao vivo
                        </h1>
                        <Paragraph className="text-lg font-montserrat text-matte-black/90 dark:text-snow-white/90 mt-3">
                            Seus convidados tiram fotos, curtem e se divertem — e tudo aparece na TV, em tempo
                            real.
                        </Paragraph>
                    </div>
                    <div className="flex flex-row flex-wrap gap-4 justify-center mt-2">
                        <Button type="primary" className="px-20 py-5 md:px-10">
                            Criar meu evento
                        </Button>
                        <Button
                            type="secondary"
                            className="px-20 py-5 md:px-10"
                            onClick={() => scrollToSection('instagram-demo')}
                        >
                            Ver como funciona
                        </Button>
                    </div>
                </div>
            </div>

            {/* Seção que invade o hero (margin negativo + z-10 para ficar por cima) */}
            <div
                id="demonstracao"
                className="flex flex-row justify-center items-center w-full -mt-28 sm:-mt-36 relative z-10 px-4"
            >
                <Box className="gap-4 w-full max-w-5xl p-8 sm:p-10 rounded-2xl shadow-xl">
                    <div className="flex flex-row justify-center items-center gap-8">
                        <Image src={mockupIos} alt="Mockup iOS" className="w-[60px] sm:w-[75px] md:w-[150px]" />
                        <Image
                            src={mockupDesktop}
                            alt="Mockup Desktop"
                            className="pl-0 w-[200px] sm:w-[250px] md:w-[500px] md:pl-2"
                        />
                    </div>
                </Box>
            </div>

            {/* Como funciona */}
            <div id="como-funciona" className="flex flex-col items-center justify-center gap-6 py-12 px-4">
                <h2 className="text-2xl font-montserrat font-bold text-matte-black dark:text-snow-white">
                    Como funciona?
                </h2>
                <div className="flex flex-row gap-4">
                    <ul className="flex flex-col justify-center items-center gap-6 w-full max-w-4xl mt-2 md:flex-row">
                        <li className="flex flex-col gap-3 items-center justify-center font-semibold border-soft-gold border-1 rounded-2xl p-4 w-[320px] h-[120px]">
                            <div className="flex flex-row gap-3  items-center">
                                <p className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-soft-gold text-white rounded-full font-bold font-montserrat">
                                    1
                                </p>
                                <p className="font-montserrat text-matte-black dark:text-snow-white/90">
                                    Crie o evento e pague online
                                </p>
                            </div>
                        </li>
                        <li className="flex flex-col gap-3 items-center justify-center font-semibold border-soft-gold border-1 rounded-2xl p-4 w-[320px] h-[120px]">
                            <div className="flex flex-row gap-3  items-center">
                                <p className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-soft-gold text-white rounded-full font-bold font-montserrat">
                                    2
                                </p>
                                <p className="font-montserrat text-matte-black dark:text-snow-white/90">
                                    Distribua o QR Code para seus convidados
                                </p>
                            </div>
                        </li>
                        <li className="flex flex-col gap-3 items-center justify-center font-semibold border-soft-gold border-1 rounded-2xl p-4 w-[320px] h-[120px]">
                            <div className="flex flex-row gap-3  items-center">
                                <p className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-soft-gold text-white rounded-full font-bold font-montserrat">
                                    3
                                </p>
                                <p className="font-montserrat text-matte-black dark:text-snow-white/90">
                                    Veja as fotos chegando ao vivo em um álbum organizado
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div id="instagram-demo" className="flex flex-col items-center justify-center gap-6 px-4">
                <h2 className="text-2xl font-montserrat font-bold text-matte-black dark:text-snow-white">
                    Vídeo de demonstração
                </h2>
                <div className="flex justify-center items-center w-full max-w-[428px] mx-auto">
                    <InstagramEmbed
                        url="https://www.instagram.com/p/DPykL4Yjb13/"
                        className="w-full max-w-[428px]"
                    />
                </div>
            </div>

            <div id="faq" className="flex flex-col items-center justify-center gap-6 px-4 py-4 mt-10">
                <h2 className="text-2xl font-montserrat font-bold text-matte-black dark:text-snow-white">
                    Perguntas frequentes
                </h2>

                <Collapse
                    size="large"
                    accordion
                    className="w-full max-w-4xl rounded-xl font-semibold text-matte-black dark:text-snow-white"
                    items={[
                        {
                            key: '1',
                            label: 'O que é o Qinstante?',
                            children: (
                                <div className="flex flex-col gap-2">
                                    <p>Um jeito diferente e cheio de significado de eternizar o grande dia!</p>
                                    <p>
                                        Os convidados se tornaram parte da história, registrando seus próprios
                                        momentos através de um QR Code disponível em todo o evento.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            key: '2',
                            label: 'Quais são as formas de pagamento?',
                            children: <p>Atualmente, aceitamos pagamentos via Cartão de Crédito.</p>,
                        },
                        {
                            key: '3',
                            label: 'Quanto tempo demora para receber o QR Code?',
                            children: (
                                <div className="flex flex-col gap-2">
                                    <p>Após a confirmação do pagamento você receberá o QR Code na hora.</p>
                                    <p>
                                        Seus convidados poderão acessar o evento em qualquer momento durante o
                                        evento.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            key: '4',
                            label: 'Até quando posso acessar o evento?',
                            children: (
                                <div className="flex flex-col gap-2">
                                    <p>
                                        Você tem acesso irrestrito ao evento para que possa acessar os álbuns de
                                        fotos e compartilhar com seus amigos.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            key: '5',
                            label: 'Como faço para entrar em contato com o suporte ao cliente?',
                            children: (
                                <p>
                                    Você pode entrar em contato com nosso suporte ao cliente através do e-mail
                                    qinstante@gmail.com.
                                </p>
                            ),
                        },
                    ]}
                    defaultActiveKey={['1']}
                />
            </div>

            {/* Footer */}
            <footer className="mt-20 border-t border-soft-gold/30 dark:border-soft-gold-dark/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-6 px-6 max-w-screen-xl mx-auto">
                    {/* Logo e contato */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div>
                            <h6 className="text-2xl font-bold text-matte-black dark:text-snow-white font-nanum-brush text-center md:text-left">
                                Qinstante
                            </h6>
                            <p className="text-center text-sm text-matte-black/70 dark:text-snow-white/70 font-montserrat mt-2 md:mt-0">
                                Transforme seu evento em uma experiência ao vivo
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center md:justify-start md:items-start gap-3 w-full md:gap-6 md:flex-row">
                            <a
                                href="https://www.instagram.com/qinstante/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex scale-80 items-center gap-2 text-matte-black dark:text-snow-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors font-montserrat md:scale-100"
                            >
                                <FaInstagram className="w-6 h-6" />
                                @qinstante
                            </a>
                            <a
                                href="mailto:Qinstante@teste.com"
                                className="flex scale-80 items-center gap-2 text-matte-black dark:text-snow-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors font-montserrat md:scale-100"
                            >
                                <SiGmail className="w-6 h-6" />
                                qinstante@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Navegação */}
                    <nav className="flex flex-wrap flex-col justify-center gap-6">
                        <h5 className="text-md text-center font-bold opacity-90 text-gray-800 dark:text-white/90 md:text-left">
                            NAVEGAR
                        </h5>
                        <div className="flex flex-wrap flex-col justify-center items-center gap-2 md:flex-row md:justify-start md:items-start md:gap-6">
                            <button
                                type="button"
                                onClick={() => scrollToSection('inicio')}
                                className="text-matte-black dark:text-snow-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors font-montserrat font-medium"
                            >
                                Início
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollToSection('demonstracao')}
                                className="text-matte-black dark:text-snow-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors font-montserrat font-medium"
                            >
                                Demonstração
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollToSection('como-funciona')}
                                className="text-matte-black dark:text-snow-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors font-montserrat font-medium"
                            >
                                Como funciona
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollToSection('instagram-demo')}
                                className="text-matte-black dark:text-snow-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors font-montserrat font-medium"
                            >
                                Vídeo
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollToSection('faq')}
                                className="text-matte-black dark:text-snow-white hover:text-soft-gold dark:hover:text-soft-gold transition-colors font-montserrat font-medium"
                            >
                                FAQ
                            </button>
                        </div>
                    </nav>
                </div>

                <div className="border-t border-soft-gold/20 dark:border-soft-gold-dark/20 py-6 px-6">
                    <p className="text-center text-sm text-matte-black/70 dark:text-snow-white/70 font-montserrat">
                        © {new Date().getFullYear()} Qinstante. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </Box>
    );
}
