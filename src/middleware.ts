import { NextRequest, NextResponse } from 'next/server';
import { getTokenPayload } from './shared/utils/token';

const publicRoutes = [
    { path: '/', whenAuthenticated: 'next' },
    { path: '/entrar', whenAuthenticated: 'redirect' },
    { path: '/cadastro', whenAuthenticated: 'redirect' },
    { path: '/painel/entrar', whenAuthenticated: 'redirect' },
    { path: '/painel/cadastro', whenAuthenticated: 'redirect' },
] as const;

const ASSOCIATION_REDIRECT_URL_WHEN_AUTHENTICATED = '/painel';
const PUBLIC_REDIRECT_URL_WHEN_AUTHENTICATED = '/animais';
// const REDIRECT_URL_WHEN_UNAUTHENTICATED = '/entrar'

export default function middleware(request: NextRequest) {
    const authToken = request.cookies.get('token');
    const tokenPayload = getTokenPayload(authToken?.value);
    const isAuthenticated = !!authToken && !!tokenPayload?.role;

    const { pathname } = request.nextUrl;
    const accessForAssociation = pathname.startsWith('/painel');
    const publicRoute = publicRoutes.find((route) => route.path === pathname);

    if (!isAuthenticated && publicRoute) {
        return NextResponse.next();
    }

    // if(!isAuthenticated && !publicRoute ){
    //     const redirectUrl = request.nextUrl.clone()
    //     redirectUrl.pathname = `${accessForAssociation ? '/painel' : ''}${REDIRECT_URL_WHEN_UNAUTHENTICATED}`

    //     return NextResponse.redirect(redirectUrl)
    // }

    if (isAuthenticated && publicRoute?.whenAuthenticated === 'redirect') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname =
            accessForAssociation && tokenPayload?.role === 'partner'
                ? ASSOCIATION_REDIRECT_URL_WHEN_AUTHENTICATED
                : PUBLIC_REDIRECT_URL_WHEN_AUTHENTICATED;

        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
