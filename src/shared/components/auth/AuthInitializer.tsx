'use client';

import { useEffect } from 'react';
import { useAuth } from '@/shared/store/useAuth';
import { LoadingScreen } from '../ui';
import { usePathname } from 'next/navigation';
import { publicRoutes } from '@/middleware';
import { useAlert } from '@/shared/hooks';

interface AuthInitializerProps {
    children: React.ReactNode;
}

export function AuthInitializer({ children }: AuthInitializerProps) {
    const pathname = usePathname();
    const { warningAlert } = useAlert();

    const [initializeAuth, signOut, error, isInitialized, isLoading, isAuthenticated] = useAuth((state) => [
        state.initializeAuth,
        state.signOut,
        state.error,
        state.isInitialized,
        state.isLoading,
        state.isAuthenticated,
    ]);

    const isPublicRoute = publicRoutes.find(({ path }) => path === pathname);

    useEffect(() => {
        if (!isPublicRoute) {
            initializeAuth();
        }
    }, [initializeAuth, isPublicRoute]);

    useEffect(() => {
        const handleSessionExpired = () => {
            warningAlert('Sessão expirada, faça login novamente');
            signOut();

            setTimeout(() => {
                window.location.href = '/entrar';
            }, 500);
        };

        window.addEventListener('auth:session-expired', handleSessionExpired);

        return () => {
            window.removeEventListener('auth:session-expired', handleSessionExpired);
        };
    }, [signOut, warningAlert]);

    useEffect(() => {
        const handleLogout = () => {
            if (typeof window !== 'undefined') {
                // limpa histórico indo para home
                window.history.replaceState(null, '', '/');
                window.location.replace('/entrar');
            }
        };

        window.addEventListener('auth:logout', handleLogout);

        return () => {
            window.removeEventListener('auth:logout', handleLogout);
        };
    }, []);

    useEffect(() => {
        if (error && !isPublicRoute && !isAuthenticated && isInitialized) {
            warningAlert(error);

            const timer = setTimeout(() => {
                window.location.href = '/entrar';
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [error, isPublicRoute, isAuthenticated, isInitialized, warningAlert]);

    const shouldShowLoading = !isPublicRoute && (!isInitialized || isLoading);

    if (shouldShowLoading) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
}
