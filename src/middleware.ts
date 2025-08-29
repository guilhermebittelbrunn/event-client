import { NextRequest, NextResponse } from 'next/server';
import { getTokenPayload } from './shared/utils/helpers/token';
import { UserTokenPayload } from './shared/types/dtos/user/auth';

export const publicRoutes = [
    { path: '/', whenAuthenticated: 'next' },
    { path: '/entrar', whenAuthenticated: 'redirect' },
    { path: '/cadastro', whenAuthenticated: 'redirect' },
] as const;

const PUBLIC_REDIRECT_URL_WHEN_AUTHENTICATED = '/painel';
const REDIRECT_URL_WHEN_UNAUTHENTICATED = '/entrar';

export default function middleware(request: NextRequest) {
    const authToken = request.cookies.get('accessToken')?.value;
    const tokenPayload = getTokenPayload<UserTokenPayload>(authToken);
    const isAuthenticated = !!authToken && !!tokenPayload?.sub;

    const { pathname } = request.nextUrl;
    const publicRoute = publicRoutes.find((route) => route.path === pathname);

    if (!isAuthenticated && publicRoute) {
        return NextResponse.next();
    }

    if (!isAuthenticated && !publicRoute) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_URL_WHEN_UNAUTHENTICATED;

        return NextResponse.redirect(redirectUrl);
    }

    if (isAuthenticated && publicRoute?.whenAuthenticated === 'redirect') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = PUBLIC_REDIRECT_URL_WHEN_AUTHENTICATED;

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
