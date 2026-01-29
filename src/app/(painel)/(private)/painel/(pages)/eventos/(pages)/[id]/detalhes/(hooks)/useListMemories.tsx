import { ListPaginatedMemoryRequest } from '@/lib/services';
import { useApi } from '@/shared/hooks';
import usePagination from '@/shared/hooks/usePagination';
import { useQuery } from '@tanstack/react-query';

export const LIST_MEMORY_PAGINATED_QUERY_KEY = 'memory_paginated_query_key';

export const useListPaginatedMemory = (dto: ListPaginatedMemoryRequest) => {
    const { client } = useApi();
    const { currentPage, currentTerm, currentLimit } = usePagination();

    const { data, isLoading, error } = useQuery({
        queryKey: [LIST_MEMORY_PAGINATED_QUERY_KEY, currentPage, currentLimit, currentTerm, dto],
        queryFn: () =>
            client.memoryService.listPaginated({
                page: currentPage,
                limit: currentLimit,
                term: currentTerm,
                ...dto,
            }),
        placeholderData: previousData => previousData,
        refetchOnWindowFocus: true,
        refetchInterval: 30 * 1000, // 30 seconds
        refetchOnMount: true,
    });

    return {
        data,
        isLoading,
        error,
    };
};
