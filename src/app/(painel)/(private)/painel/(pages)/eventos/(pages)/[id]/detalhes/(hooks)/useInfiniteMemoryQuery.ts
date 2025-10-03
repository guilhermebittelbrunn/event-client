import { useInfiniteQuery } from '@tanstack/react-query';
import useApi from '../../../../../../../../../../shared/hooks/useApi';
import { ListPaginatedMemoryRequest } from '@/lib/services';

export const INFINITE_MEMORY_QUERY_KEY = 'infinite_memory_query_key';

interface UseInfiniteMemoryQueryProps extends Omit<ListPaginatedMemoryRequest, 'page'> {
    eventId: string;
    limit?: number;
}

export const useInfiniteMemoryQuery = (props: UseInfiniteMemoryQueryProps) => {
    const { eventId, limit = 20, order, orderBy, ...rest } = props;
    const { client } = useApi();

    return useInfiniteQuery({
        queryKey: [INFINITE_MEMORY_QUERY_KEY, eventId, limit, order, orderBy, rest],
        queryFn: ({ pageParam = 1 }) =>
            client.memoryService.listPaginated({
                page: pageParam,
                limit,
                eventId,
                order,
                orderBy,
                ...rest,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.data || lastPage.data.length < limit) {
                return undefined;
            }
            return allPages.length + 1;
        },
        placeholderData: (previousData) => previousData,
        initialPageParam: 1,
        refetchInterval: 1 * 60 * 1000, // 1 minute
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};

export default useInfiniteMemoryQuery;
