import { ListPaginatedUserRequest } from '@/lib/services';
import { useApi } from '@/shared/hooks';
import usePagination from '@/shared/hooks/usePagination';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ISelectOption } from '../components/form';

export const LIST_USERS_QUERY_KEY = 'users_query_key';

interface UseListUsersProps {
    enabled?: boolean;
}

export const useListUsers = (dto: ListPaginatedUserRequest, props: UseListUsersProps = {}) => {
    const { client } = useApi();
    const { currentPage, currentTerm, currentLimit } = usePagination();

    const { data, isLoading, error } = useQuery({
        queryKey: [LIST_USERS_QUERY_KEY, currentPage, currentLimit, currentTerm, dto],
        queryFn: () =>
            client.userService.listPaginated({
                page: currentPage,
                limit: currentLimit,
                term: currentTerm,
                ...dto,
            }),
        placeholderData: previousData => previousData,
        enabled: props.enabled,
    });

    const options: ISelectOption[] = useMemo(() => {
        return (
            data?.data?.map(user => ({
                label: user.name,
                value: user.id,
            })) || []
        );
    }, [data]);

    return {
        data,
        options,
        isLoading,
        error,
    };
};
