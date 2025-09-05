import { useQuery } from '@tanstack/react-query';
import useApi from './useApi';

export const FIND_EVENT_BY_ID = 'find_event_by_id';

export async function findEventById(id?: string, client?: any) {
    if (!id) return undefined;
    const { data } = await client?.eventService.findById(id);
    return data;
}

export default function useFindEventById(id?: string) {
    const { client } = useApi();

    const { data, error, isPending } = useQuery({
        queryFn: () => findEventById(id, client),
        queryKey: [FIND_EVENT_BY_ID, id],
        enabled: !!id,
    });

    return { data, error, isPending };
}
