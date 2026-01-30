'use client';

import { Title, AddButton, LoadingScreen, Container, Box } from '@/shared/components/ui';
import { useRedirect } from '@/shared/hooks';

import React from 'react';
import { useEventCrud } from '../../../../../shared/hooks/useEventCrud';
import { EventCard } from './eventos/(components)/EventCard';
import { startOfDay } from 'date-fns';
import { EventStatusEnum } from '@/shared/types/dtos';

const today = startOfDay(new Date());

export default function Home() {
    const { redirect } = useRedirect();

    const { data, isLoading } = useEventCrud().useListPaginatedEvent({
        order: 'asc',
        orderBy: 'startAt',
        limit: 5,
        dateType: 'startAt',
        startDate: today,
        statuses: [EventStatusEnum.IN_PROGRESS, EventStatusEnum.PENDING_PAYMENT, EventStatusEnum.PUBLISHED],
    });

    const { data: events } = data || {};

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Container>
            <Box className="flex flex-row justify-between items-center">
                <Title className="text-xl font-bold text-neutral-800 dark:text-white">Próximo evento</Title>
                <AddButton type="primary" onClick={() => redirect('/painel/eventos/cadastrar')}>
                    Novo evento
                </AddButton>
            </Box>

            {Boolean(events?.length) && events?.[0] ? (
                <>
                    <EventCard event={events[0]} detailed />

                    {Boolean(events?.length > 1) && (
                        <>
                            <Title className="text-xl font-bold text-neutral-800 dark:text-white">
                                Outros eventos
                            </Title>
                            {events?.slice(1).map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </>
                    )}
                </>
            ) : (
                <>
                    <Title className="text-xl font-bold text-neutral-800 dark:text-white">
                        Nenhum evento encontrado
                    </Title>
                </>
            )}
        </Container>
    );
}
