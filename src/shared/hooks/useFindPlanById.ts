import { useQuery } from '@tanstack/react-query';
import client from '@/lib/clients/client';

export const FIND_PLAN_BY_ID = 'find_plan_by_id';

export default function useFindPlanById(id?: string) {
    const { data, error, isPending } = useQuery({
        queryFn: async () => {
            if (!id) return undefined;
            const { data } = await client.planService.findById(id);
            return data;
        },
        queryKey: [FIND_PLAN_BY_ID, id],
        enabled: !!id,
    });

    return { data, error, isPending };
}
