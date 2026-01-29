import { CreateEventRequest, ListPaginatedEventRequest, UpdateEventRequest } from '@/lib/services/event';
import useAlert from '@/shared/hooks/useAlert';
import useApi from '@/shared/hooks/useApi';
import usePagination from '@/shared/hooks/usePagination';
import { EventDTO, EventStatusEnum } from '@/shared/types/dtos';
import { PaginationRequestWithOrderAndDate } from '@/shared/types/utils';
import { handleClientError } from '@/shared/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const LIST_EVENTS_PAGINATED_QUERY_KEY = 'events_paginated_query_key';

type ListPaginatedEventRequestWithOrderAndDate = PaginationRequestWithOrderAndDate<EventDTO> &
    ListPaginatedEventRequest;

export const useEventCrud = () => {
    const queryClient = useQueryClient();
    const { client } = useApi();
    const { successAlert, errorAlert } = useAlert();
    const { currentPage, currentTerm, currentLimit } = usePagination();

    const createEventMutation = useMutation({
        mutationFn: (data: CreateEventRequest) => client.eventService.create(data),
        onSuccess: ({ data }) => {
            successAlert('Evento criado com sucesso');

            if (data.status === EventStatusEnum.PENDING_PAYMENT) {
                setTimeout(() => {
                    window.location.href = `/painel/eventos/${data.id}/confirmar-pagamento`;
                }, 300);
                return;
            }

            setTimeout(() => {
                window.location.href = '/painel/eventos';
            }, 300);
        },
        onError: error => errorAlert(handleClientError(error)),
    });

    const updateEventMutation = useMutation({
        mutationFn: (data: UpdateEventRequest) => client.eventService.update(data),
        onSuccess: () => {
            successAlert('Evento atualizado com sucesso');
            setTimeout(() => {
                window.location.href = '/painel/eventos';
            }, 300);
        },
        onError: error => errorAlert(handleClientError(error)),
    });

    const useListPaginatedEvent = (dto: ListPaginatedEventRequestWithOrderAndDate = {}) =>
        useQuery({
            queryKey: [LIST_EVENTS_PAGINATED_QUERY_KEY, currentPage, currentLimit, currentTerm, dto],
            queryFn: () =>
                client.eventService.listPaginated({
                    page: currentPage,
                    limit: currentLimit,
                    term: currentTerm,
                    ...dto,
                }),
            placeholderData: previousData => previousData,
            refetchOnWindowFocus: true,
        });

    const deleteEventMutation = useMutation({
        mutationFn: (id: string) => client.eventService.delete(id),
        onSuccess: () => {
            successAlert('Evento deletado com sucesso');
            queryClient.invalidateQueries({ queryKey: [LIST_EVENTS_PAGINATED_QUERY_KEY] });
        },
        onError: error => errorAlert(handleClientError(error)),
    });

    return {
        createEventMutation,
        deleteEventMutation,
        useListPaginatedEvent,
        updateEventMutation,
    };
};
