import { useInfiniteQuery } from '@tanstack/react-query';
import useApi from './useApi';
import { ListPaginatedMemoryRequest } from '@/lib/services';

export const INFINITE_MEMORY_QUERY_KEY = 'infinite_memory_query_key';

interface UseInfiniteMemoryQueryProps extends Omit<ListPaginatedMemoryRequest, 'page'> {
    eventId: string;
    limit?: number;
}

export const useInfiniteMemoryQuery = ({
    eventId,
    limit = 20,
    order = 'desc',
    orderBy = 'createdAt',
    ...rest
}: UseInfiniteMemoryQueryProps) => {
    const { client } = useApi();

    return useInfiniteQuery({
        queryKey: [INFINITE_MEMORY_QUERY_KEY, eventId, limit, order, orderBy, rest],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await client.memoryService.listPaginated({
                page: pageParam,
                limit,
                eventId,
                order,
                orderBy,
                ...rest,
            });
            return response;
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.data || lastPage.data.length < limit) {
                return undefined;
            }
            return allPages.length + 1;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

export default useInfiniteMemoryQuery;
