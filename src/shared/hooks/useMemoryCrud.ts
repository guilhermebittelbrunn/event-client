import { LIST_MEMORY_PAGINATED_QUERY_KEY } from '@/app/(painel)/(private)/painel/(pages)/eventos/(pages)/[id]/detalhes/(hooks)/useListMemories';
import { DownloadMemoriesRequest, UpdateMemoryBulkRequest, UpdateMemoryRequest } from '@/lib/services';
import { CreateEventRequest } from '@/lib/services/event';
import useAlert from '@/shared/hooks/useAlert';
import useApi from '@/shared/hooks/useApi';

import { handleClientError } from '@/shared/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMemoryCrud = () => {
    const queryClient = useQueryClient();
    const { client } = useApi();
    const { successAlert, errorAlert } = useAlert();

    const createMemoryMutation = useMutation({
        mutationFn: (data: CreateEventRequest) => client.memoryService.create(data),
        onSuccess: () => {
            successAlert('Memória criada com sucesso');
        },
        onError: error => errorAlert(handleClientError(error)),
    });

    const deleteMemoryMutation = useMutation({
        mutationFn: (id: string) => client.memoryService.delete(id),
        onSuccess: () => {
            successAlert('Memória deletada com sucesso');
            queryClient.invalidateQueries({ queryKey: [LIST_MEMORY_PAGINATED_QUERY_KEY] });
        },
        onError: error => errorAlert(handleClientError(error)),
    });

    const deleteBulkMemoryMutation = useMutation({
        mutationFn: (ids: string[]) => client.memoryService.deleteBulk(ids),
        onSuccess: () => {
            successAlert('Memórias deletadas com sucesso');
            queryClient.invalidateQueries({ queryKey: [LIST_MEMORY_PAGINATED_QUERY_KEY] });
        },
        onError: error => errorAlert(handleClientError(error)),
    });

    const downloadMemoryMutation = useMutation({
        mutationFn: (dto: DownloadMemoriesRequest) => client.memoryService.download(dto),
        onSuccess: ({ data }) => {
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'memories.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            successAlert('Memórias baixadas com sucesso');
        },
        onError: error => errorAlert(handleClientError(error)),
    });

    const changeMemoryVisibilityMutation = useMutation({
        mutationFn: (dto: UpdateMemoryRequest) => client.memoryService.update(dto),
        onSuccess: () => successAlert('Visibilidade da memória alterada com sucesso'),
        onError: error => errorAlert(handleClientError(error)),
    });

    const changeBulkMemoryVisibilityMutation = useMutation({
        mutationFn: (dto: UpdateMemoryBulkRequest) => client.memoryService.updateBulk(dto),
        onSuccess: () => successAlert('Visibilidade das memórias alterada com sucesso'),
        onError: error => errorAlert(handleClientError(error)),
    });

    return {
        createMemoryMutation,
        deleteMemoryMutation,
        deleteBulkMemoryMutation,
        downloadMemoryMutation,
        changeMemoryVisibilityMutation,
        changeBulkMemoryVisibilityMutation,
    };
};
