/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from '@tanstack/react-query';
import useAlert from '../hooks/useAlert';
import { getTokenPayload } from '../utils';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { EventDTO } from '../types/dtos';
import { LoadingScreen } from '../components/ui';
import { getCookie, setCookie } from '../utils/helpers/cookies';
import { SignInByTokenResponse } from '@/lib/services';
import { EventTokenPayload } from '../types/dtos/user/auth';
import { usePathname } from 'next/navigation';
import useApi from '../hooks/useApi';
import EventRedirect from '../components/common/eventRedirect';

interface EventContextData {
    isEventAuthenticated: boolean;
    authenticating: boolean;
    event?: EventDTO;
}

const EventContext = createContext({} as EventContextData);

const getTokenFromCookies = () => {
    const eventToken = getCookie('eventToken');
    return { eventToken };
};

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
    const [event, setEvent] = useState<EventDTO | undefined>(undefined);
    const [isClient, setIsClient] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const { client } = useApi();

    const { warningAlert } = useAlert();
    const pathname = usePathname();

    const signInByTokenMutation = useMutation({
        mutationFn: (token: string) => client.authService.signInByToken(token),
        onSuccess: ({ data: eventData, meta }: SignInByTokenResponse) => {
            const { token } = meta;
            setCookie('eventToken', token.accessToken, token.expiresIn);
            setEvent(eventData);
        },
        onSettled: () => {
            setIsAuthenticating(false);
        },
    });

    const findEventByIdMutation = useMutation({
        mutationFn: (id: string) => client.eventService.findByIdForGuest(id),
        onSuccess: ({ data }) => {
            setEvent(data);
        },
        onSettled: () => {
            setIsAuthenticating(false);
        },
    });

    const handleFailedAuthentication = useCallback(() => {
        setEvent(undefined);
        warningAlert('Não foi possível acessar o evento');
    }, []);

    // const revalidateAuthentication = useCallback(async () => {
    //     if (!isClient) return;

    //     const { eventToken: cookieEventToken } = getTokenFromCookies();
    //     const tokenPayload = getTokenPayload<EventTokenPayload>(cookieEventToken);

    //     if (!cookieEventToken || !tokenPayload) {
    //         setEvent(undefined);
    //         handleFailedAuthentication();
    //         return;
    //     }

    //     try {
    //         await findEventByIdMutation.mutateAsync(tokenPayload.sub, {
    //             onSuccess: ({ data }) => setEvent(data),
    //             onError: handleFailedAuthentication,
    //         });
    //     } catch {
    //         handleFailedAuthentication();
    //     }
    // }, [isClient, findEventByIdMutation, handleFailedAuthentication]);

    useEffect(() => {
        if (!isClient) return;

        const { eventToken: cookieEventToken } = getTokenFromCookies();
        const { sub } = getTokenPayload<EventTokenPayload>(cookieEventToken) || {};

        const url = new URLSearchParams(window.location.search);
        const tokenByParams = url.get('t');

        (async () => {
            if (tokenByParams) {
                await signInByTokenMutation.mutateAsync(tokenByParams, {
                    onSuccess: ({ data }) => {
                        setEvent(data);
                        window.history.replaceState({}, '', pathname.replace(tokenByParams, ''));
                    },
                    onError: handleFailedAuthentication,
                });
                return;
            }

            if (cookieEventToken && sub) {
                await findEventByIdMutation.mutateAsync(sub, {
                    onSuccess: ({ data }) => setEvent(data),
                    onError: handleFailedAuthentication,
                });
                return;
            }

            handleFailedAuthentication();
        })();
    }, [isClient]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Listener para detectar quando o usuário volta para a aba
    // useEffect(() => {
    //     if (!isClient) return;

    //     const handleVisibilityChange = () => {
    //         if (!document.hidden) {
    //             revalidateAuthentication();
    //         }
    //     };

    //     const handleFocus = () => {
    //         revalidateAuthentication();
    //     };

    //     document.addEventListener('visibilitychange', handleVisibilityChange);
    //     window.addEventListener('focus', handleFocus);

    //     return () => {
    //         document.removeEventListener('visibilitychange', handleVisibilityChange);
    //         window.removeEventListener('focus', handleFocus);
    //     };
    // }, [isClient, revalidateAuthentication]);

    return (
        <EventContext.Provider
            value={{
                isEventAuthenticated: Boolean(event),
                authenticating: isAuthenticating,
                event,
            }}
        >
            {!isClient || isAuthenticating ? <LoadingScreen /> : event ? children : <EventRedirect />}
        </EventContext.Provider>
    );
};

export default function useEvent() {
    const context = useContext(EventContext);

    if (!context) {
        throw new Error('useEvent must be used within an EventProvider');
    }

    return context;
}
