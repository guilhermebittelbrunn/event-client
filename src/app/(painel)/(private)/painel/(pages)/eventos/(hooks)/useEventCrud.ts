import { CreateEventRequest, eventService } from '@/lib/services/event';
import useAlert from '@/shared/hooks/useAlert';
import { handleClientError } from '@/shared/utils';
import { useMutation } from '@tanstack/react-query';

export const useEventCrud = () => {
    const { successAlert, errorAlert } = useAlert();

    const createEventMutation = useMutation({
        mutationFn(data: CreateEventRequest) {
            return eventService.create(data);
        },
        onSuccess: () => {
            successAlert('Evento criado com sucesso');
        },
        onError: (error) => errorAlert(handleClientError(error)),
    });

    return { createEventMutation };
};
