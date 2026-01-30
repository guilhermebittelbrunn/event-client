import { useApi } from '@/shared/hooks';
import { useQuery } from '@tanstack/react-query';

export const FIND_PENDING_PAYMENT_EVENT = 'find_pending_payment_event';

export default function useFindPendingPaymentEvent(id?: string) {
    const { client } = useApi();

    const { data, error, isPending } = useQuery({
        queryFn: async () => {
            if (!id) return undefined;
            const { data } = await client?.eventService.findById(id);
            return data;
        },
        queryKey: [FIND_PENDING_PAYMENT_EVENT, id],
        enabled: !!id,
        refetchOnWindowFocus: true,
        refetchInterval: 5 * 1000, // 5 seconds
        refetchIntervalInBackground: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        placeholderData: previousData => previousData,
    });

    return { data, error, isLoading: isPending };
}
