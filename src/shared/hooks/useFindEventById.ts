import { useQuery } from '@tanstack/react-query';
import useApi from './useApi';

export const FIND_EVENT_BY_ID = 'find_event_by_id';

export default function useFindEventById(id?: string) {
    const { client } = useApi();

    const { data, error, isPending } = useQuery({
        queryFn: async () => {
            if (!id) return undefined;
            const { data } = await client?.eventService.findById(id);
            return data;
        },
        queryKey: [FIND_EVENT_BY_ID, id],
        enabled: !!id,
        staleTime: 1000 * 60 * 1, // 1 minute
    });

    return { data, error, isPending };
}
