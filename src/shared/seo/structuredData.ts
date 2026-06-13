/**
 * Dados estruturados (schema.org) da aplicação.
 *
 * `Organization` + `WebSite` são site-wide (raiz). `SoftwareApplication` e
 * `FAQPage` ficam na home. Tudo em pt-BR, refletindo o conteúdo visível.
 */

const rawUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://qinstante.com.br';
export const SITE_URL = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

const LOGO_URL = new URL('/images/shared/qinstante.png', SITE_URL).href;

export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'QInstante',
    url: SITE_URL,
    logo: LOGO_URL,
    description:
        'QInstante é a plataforma de fotos colaborativas para casamentos e eventos: convidados registram e compartilham fotos em tempo real por QR code.',
    sameAs: ['https://www.instagram.com/qinstante/'],
    contactPoint: {
        '@type': 'ContactPoint',
        email: 'qinstante@gmail.com',
        contactType: 'customer support',
        availableLanguage: ['Portuguese'],
    },
};

export const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QInstante',
    url: SITE_URL,
    inLanguage: 'pt-BR',
    publisher: { '@type': 'Organization', name: 'QInstante' },
};

export const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QInstante',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    inLanguage: 'pt-BR',
    description:
        'Crie um álbum de fotos colaborativo para o seu casamento ou evento. Os convidados acessam por QR code e enviam fotos que aparecem em tempo real.',
    // Sem `offers`: ainda não temos preço fixo público; um Offer sem `price`
    // pode ser sinalizado como inválido pelo Google. Adicionar quando houver plano fixo.
};

/** Perguntas frequentes — deve espelhar o conteúdo visível na home. */
const faqItems: { question: string; answer: string }[] = [
    {
        question: 'O que é o QInstante?',
        answer: 'Um jeito diferente e cheio de significado de eternizar o grande dia: os convidados se tornam parte da história, registrando seus próprios momentos por um QR code disponível em todo o evento.',
    },
    {
        question: 'Quais são as formas de pagamento?',
        answer: 'Atualmente aceitamos pagamentos via cartão de crédito.',
    },
    {
        question: 'Quanto tempo demora para receber o QR code?',
        answer: 'Após a confirmação do pagamento você recebe o QR code na hora. Seus convidados podem acessar o evento a qualquer momento durante a celebração.',
    },
    {
        question: 'Até quando posso acessar o evento?',
        answer: 'Você tem acesso irrestrito ao evento para acessar os álbuns de fotos e compartilhar com seus amigos.',
    },
    {
        question: 'Como falo com o suporte ao cliente?',
        answer: 'Você pode falar com o nosso suporte pelo e-mail qinstante@gmail.com.',
    },
];

export const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
};
