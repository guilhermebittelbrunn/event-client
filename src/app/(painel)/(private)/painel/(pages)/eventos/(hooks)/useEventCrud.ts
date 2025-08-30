import { CreateEventRequest, eventService, UpdateEventRequest } from '@/lib/services/event';
import { useRedirect } from '@/shared/hooks';
import useAlert from '@/shared/hooks/useAlert';
import usePagination from '@/shared/hooks/usePagination';
import { handleClientError } from '@/shared/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const LIST_EVENTS_PAGINATED_QUERY_KEY = 'events_paginated_query_key';
const FIND_EVENT_BY_ID_QUERY_KEY = 'find_event_by_id_query_key';

export const useEventCrud = () => {
    const { redirectWithDelay } = useRedirect();
    const queryClient = useQueryClient();
    const { successAlert, errorAlert } = useAlert();
    const { currentPage, currentTerm, currentLimit } = usePagination();

    const createEventMutation = useMutation({
        mutationFn(data: CreateEventRequest) {
            return eventService.create(data);
        },
        onSuccess: () => {
            successAlert('Evento criado com sucesso');
            redirectWithDelay('/painel/eventos', 300);
        },
        onError: (error) => errorAlert(handleClientError(error)),
    });

    const updateEventMutation = useMutation({
        mutationFn(data: UpdateEventRequest) {
            return eventService.update(data);
        },
        onSuccess: () => {
            successAlert('Evento atualizado com sucesso');
            redirectWithDelay('/painel/eventos', 300);
        },
        onError: (error) => errorAlert(handleClientError(error)),
    });

    const useFindEventById = (id: string) =>
        useQuery({
            queryKey: [FIND_EVENT_BY_ID_QUERY_KEY, id],
            queryFn: () => eventService.findById(id),
        });

    const useListPaginatedEvent = () =>
        useQuery({
            queryKey: [LIST_EVENTS_PAGINATED_QUERY_KEY, currentPage, currentLimit, currentTerm],
            queryFn: () =>
                eventService.listPaginated({ page: currentPage, limit: currentLimit, term: currentTerm }),
            placeholderData: (previousData) => previousData,
        });

    const deleteEventMutation = useMutation({
        mutationFn(id: string) {
            return eventService.delete(id);
        },
        onSuccess: () => {
            successAlert('Evento deletado com sucesso');
            queryClient.invalidateQueries({ queryKey: [LIST_EVENTS_PAGINATED_QUERY_KEY] });
        },
        onError: (error) => errorAlert(handleClientError(error)),
    });

    return {
        createEventMutation,
        deleteEventMutation,
        useListPaginatedEvent,
        useFindEventById,
        updateEventMutation,
    };
};
