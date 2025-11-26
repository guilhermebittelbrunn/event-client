
const config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        letterSpacing: {
            tighter: '-0.075em',
            tight: '-0.05em',
            normal: '-0.025em',
            wide: '0em',
            wider: '0.025em',
            widest: '0.05em',
        },
        extend: {
            colors: {
                // Cores do sistema baseadas em variáveis CSS
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                'background-neutral': 'hsl(var(--background-neutral))',
                foreground: 'hsl(var(--foreground))',

                // Cores primárias do sistema
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                'primary-darker': {
                    DEFAULT: 'hsl(var(--primary-darker))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },

                // Cores personalizadas do Qinstante com variações
                'snow-white': {
                    DEFAULT: 'hsl(var(--snow-white))',
                    25: 'hsl(var(--snow-white-25))',
                    50: 'hsl(var(--snow-white-50))',
                    100: 'hsl(var(--snow-white-100))',
                    200: 'hsl(var(--snow-white-200))',
                    300: 'hsl(var(--snow-white-300))',
                    400: 'hsl(var(--snow-white-400))',
                    500: 'hsl(var(--snow-white-500))',
                    600: 'hsl(var(--snow-white-600))',
                    700: 'hsl(var(--snow-white-700))',
                    800: 'hsl(var(--snow-white-800))',
                    900: 'hsl(var(--snow-white-900))',
                    950: 'hsl(var(--snow-white-950))',
                },
                'champagne': {
                    DEFAULT: 'hsl(var(--champagne))',
                    25: 'hsl(var(--champagne-25))',
                    50: 'hsl(var(--champagne-50))',
                    100: 'hsl(var(--champagne-100))',
                    200: 'hsl(var(--champagne-200))',
                    300: 'hsl(var(--champagne-300))',
                    400: 'hsl(var(--champagne-400))',
                    500: 'hsl(var(--champagne-500))',
                    600: 'hsl(var(--champagne-600))',
                    700: 'hsl(var(--champagne-700))',
                    800: 'hsl(var(--champagne-800))',
                    900: 'hsl(var(--champagne-900))',
                    950: 'hsl(var(--champagne-950))',
                },
                'matte-black': {
                    DEFAULT: 'hsl(var(--matte-black))',
                    25: 'hsl(var(--matte-black-25))',
                    50: 'hsl(var(--matte-black-50))',
                    100: 'hsl(var(--matte-black-100))',
                    200: 'hsl(var(--matte-black-200))',
                    300: 'hsl(var(--matte-black-300))',
                    400: 'hsl(var(--matte-black-400))',
                    500: 'hsl(var(--matte-black-500))',
                    600: 'hsl(var(--matte-black-600))',
                    700: 'hsl(var(--matte-black-700))',
                    800: 'hsl(var(--matte-black-800))',
                    900: 'hsl(var(--matte-black-900))',
                    950: 'hsl(var(--matte-black-950))',
                },
                'gray': {
                    DEFAULT: 'hsl(var(--gray))',
                    25: 'hsl(var(--gray-25))',
                    50: 'hsl(var(--gray-50))',
                    100: 'hsl(var(--gray-100))',
                    200: 'hsl(var(--gray-200))',
                    300: 'hsl(var(--gray-300))',
                    400: 'hsl(var(--gray-400))',
                    500: 'hsl(var(--gray-500))',
                    600: 'hsl(var(--gray-600))',
                    700: 'hsl(var(--gray-700))',
                    800: 'hsl(var(--gray-800))',
                    900: 'hsl(var(--gray-900))',
                    950: 'hsl(var(--gray-950))',
                },
                'soft-gold': {
                    DEFAULT: 'hsl(var(--soft-gold))',
                    25: 'hsl(var(--soft-gold-25))',
                    50: 'hsl(var(--soft-gold-50))',
                    100: 'hsl(var(--soft-gold-100))',
                    200: 'hsl(var(--soft-gold-200))',
                    300: 'hsl(var(--soft-gold-300))',
                    400: 'hsl(var(--soft-gold-400))',
                    500: 'hsl(var(--soft-gold-500))',
                    600: 'hsl(var(--soft-gold-600))',
                    700: 'hsl(var(--soft-gold-700))',
                    800: 'hsl(var(--soft-gold-800))',
                    900: 'hsl(var(--soft-gold-900))',
                    950: 'hsl(var(--soft-gold-950))',
                },

                // Cores de texto semânticas
                'text': {
                    primary: 'hsl(var(--text-primary))',
                    secondary: 'hsl(var(--text-secondary))',
                    tertiary: 'hsl(var(--text-tertiary))',
                    inverse: 'hsl(var(--text-inverse))',
                },

                // Cores da marca
                'brand': {
                    primary: 'hsl(var(--brand-primary))',
                    secondary: 'hsl(var(--brand-secondary))',
                    accent: 'hsl(var(--brand-accent))',
                    background: 'hsl(var(--brand-background))',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'slide-in-from-top': {
                    from: { transform: 'translateY(-100%)' },
                    to: { transform: 'translateY(0)' },
                },
                'slide-in-from-bottom': {
                    from: { transform: 'translateY(100%)' },
                    to: { transform: 'translateY(0)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
                'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
                cursive: ['var(--font-cursive)', 'cursive'],
                'nanum-brush': ['var(--font-nanum-brush-script)', 'cursive'],
            },
            fontSize: {
                xxs: ['0.55rem', '0.8rem'],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            },
        },
    },
};

export default config;
