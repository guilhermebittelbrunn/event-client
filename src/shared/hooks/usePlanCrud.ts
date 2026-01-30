import client from '@/lib/clients/client';
import { UpdatePlanRequest } from '@/lib/services/plan';
import useAlert from '@/shared/hooks/useAlert';
import usePagination from '@/shared/hooks/usePagination';
import { handleClientError } from '@/shared/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaginationRequest, ToggleStatusParams } from '../types/utils';

const LIST_PLANS_PAGINATED_QUERY_KEY = 'plans_paginated_query_key';

export const usePlanCrud = () => {
    const { successAlert, errorAlert } = useAlert();
    const { currentPage, currentTerm, currentLimit } = usePagination();
    const queryClient = useQueryClient();

    const updatePlanMutation = useMutation({
        mutationFn: (data: UpdatePlanRequest) => client.planService.update(data),
        onSuccess: () => {
            successAlert('Plano atualizado com sucesso');
            setTimeout(() => {
                window.location.href = '/painel/planos';
            }, 300);
        },
        onError: error => errorAlert(handleClientError(error)),
    });

    const toggleStatusPlanMutation = useMutation({
        mutationFn: (dto: ToggleStatusParams) => client.planService.update({ enabled: dto.status, id: dto.id }),
        onSuccess: () => {
            successAlert('Status do plano atualizado com sucesso');
            queryClient.invalidateQueries({ queryKey: [LIST_PLANS_PAGINATED_QUERY_KEY] });
        },
        onError: error => errorAlert(handleClientError(error)),
    });

    const useListPaginatedPlan = (dto: PaginationRequest = {}) =>
        useQuery({
            queryKey: [LIST_PLANS_PAGINATED_QUERY_KEY, currentPage, currentLimit, currentTerm, dto],
            queryFn: () =>
                client.planService.listPaginated({
                    page: currentPage,
                    limit: currentLimit,
                    term: currentTerm,
                    ...dto,
                }),
            placeholderData: previousData => previousData,
            refetchOnWindowFocus: true,
        });

    return { useListPaginatedPlan, updatePlanMutation, toggleStatusPlanMutation };
};
