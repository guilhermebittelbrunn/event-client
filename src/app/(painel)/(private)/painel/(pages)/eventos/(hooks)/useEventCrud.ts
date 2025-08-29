import { CreateEventRequest, eventService } from '@/lib/services/event';
import { useRedirect } from '@/shared/hooks';
import useAlert from '@/shared/hooks/useAlert';
import usePagination from '@/shared/hooks/usePagination';
import { handleClientError } from '@/shared/utils';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useEventCrud = () => {
    const { redirectWithDelay } = useRedirect();
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

    const useListPaginatedEvent = () =>
        useQuery({
            queryKey: ['events', currentPage, currentLimit, currentTerm],
            queryFn: () =>
                eventService.listPaginated({ page: currentPage, limit: currentLimit, term: currentTerm }),
            placeholderData: (previousData) => previousData,
        });

    return { createEventMutation, useListPaginatedEvent };
};
