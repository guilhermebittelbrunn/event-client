import { useInfiniteQuery } from '@tanstack/react-query';
import useApi from '../../../../../../../../../../shared/hooks/useApi';
import { ListPaginatedMemoryRequest } from '@/lib/services';

export const INFINITE_MEMORY_QUERY_KEY = 'infinite_memory_query_key';

interface UseInfiniteMemoryQueryProps extends Omit<ListPaginatedMemoryRequest, 'page' | 'eventId'> {
    eventId?: string;
    limit?: number;
}

export const useInfiniteMemoryQuery = (props: UseInfiniteMemoryQueryProps) => {
    const { eventId, limit = 20, order, orderBy, hidden, ...rest } = props;
    const { client } = useApi();

    return useInfiniteQuery({
        queryKey: [INFINITE_MEMORY_QUERY_KEY, eventId, limit, order, orderBy, hidden, rest],
        queryFn: ({ pageParam = 1 }) => {
            if (!eventId) {
                return { data: [], meta: { total: 0, page: 0, limit: 0, pages: 0, hasNextPage: false } };
            }
            return client.memoryService.listPaginated({
                page: pageParam,
                limit,
                eventId,
                order,
                orderBy,
                hidden,
                ...rest,
            });
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.data || lastPage.data.length < limit) {
                return undefined;
            }
            return allPages.length + 1;
        },
        placeholderData: previousData => previousData,
        initialPageParam: 1,
        refetchInterval: 1 * 60 * 1000, // 1 minute
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        enabled: !!eventId,
    });
};

export default useInfiniteMemoryQuery;
