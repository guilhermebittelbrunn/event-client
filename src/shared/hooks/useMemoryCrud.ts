import { ListPaginatedMemoryRequest, DownloadMemoriesRequest } from '@/lib/services';
import { CreateEventRequest } from '@/lib/services/event';
import useAlert from '@/shared/hooks/useAlert';
import useApi from '@/shared/hooks/useApi';
import usePagination from '@/shared/hooks/usePagination';

import { handleClientError } from '@/shared/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const LIST_MEMORY_PAGINATED_QUERY_KEY = 'memory_paginated_query_key';

export const useMemoryCrud = () => {
    const queryClient = useQueryClient();
    const { client } = useApi();
    const { successAlert, errorAlert } = useAlert();
    const { currentPage, currentTerm, currentLimit } = usePagination();

    const createMemoryMutation = useMutation({
        mutationFn: (data: CreateEventRequest) => client.memoryService.create(data),
        onSuccess: () => {
            successAlert('Memória criada com sucesso');
        },
        onError: (error) => errorAlert(handleClientError(error)),
    });

    const useListPaginatedMemory = (dto: ListPaginatedMemoryRequest) =>
        useQuery({
            queryKey: [LIST_MEMORY_PAGINATED_QUERY_KEY, currentPage, currentLimit, currentTerm, dto],
            queryFn: () =>
                client.memoryService.listPaginated({
                    page: currentPage,
                    limit: currentLimit,
                    term: currentTerm,
                    ...dto,
                }),
            placeholderData: (previousData) => previousData,
            refetchOnWindowFocus: true,
        });

    const deleteMemoryMutation = useMutation({
        mutationFn: (id: string) => client.memoryService.delete(id),
        onSuccess: () => {
            successAlert('Memória deletada com sucesso');
            queryClient.invalidateQueries({ queryKey: [LIST_MEMORY_PAGINATED_QUERY_KEY] });
        },
        onError: (error) => errorAlert(handleClientError(error)),
    });

    const deleteBulkMemoryMutation = useMutation({
        mutationFn: (ids: string[]) => client.memoryService.deleteBulk(ids),
        onSuccess: () => {
            successAlert('Memórias deletadas com sucesso');
            queryClient.invalidateQueries({ queryKey: [LIST_MEMORY_PAGINATED_QUERY_KEY] });
        },
        onError: (error) => errorAlert(handleClientError(error)),
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
        onError: (error) => errorAlert(handleClientError(error)),
    });

    return {
        createMemoryMutation,
        deleteMemoryMutation,
        useListPaginatedMemory,
        deleteBulkMemoryMutation,
        downloadMemoryMutation,
    };
};
