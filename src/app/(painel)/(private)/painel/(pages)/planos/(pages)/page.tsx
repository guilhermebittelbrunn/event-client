'use client';

import { useRouter } from 'next/navigation';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { Container, PaginationTable, createColumn } from '@/shared/components/ui';
import { ActionsMenu } from '@/shared/components/ui/actionMenu';
import { Box } from '@/shared/components/ui/box';
import { formatPrice } from '@/shared/utils/helpers';
import { usePlanCrud } from '../../../../../../../shared/hooks/usePlanCrud';
import { PlanDTO, PlanTypeOptions } from '@/shared/types/dtos/billing/plan';
import { Switch } from '@/shared/components/form';

export default function PlansPage() {
    const router = useRouter();

    const { useListPaginatedPlan, toggleStatusPlanMutation } = usePlanCrud();

    const { data, isLoading } = useListPaginatedPlan();

    const { data: plans, meta } = data || {};

    const columns = [
        createColumn<PlanDTO, 'description'>({
            title: 'Descrição',
            key: 'description',
        }),
        createColumn<PlanDTO, 'type'>({
            title: 'Tipo',
            key: 'type',
            render: type => PlanTypeOptions.find(option => option.value === type)?.label,
        }),
        createColumn<PlanDTO, 'price'>({
            title: 'Preço',
            key: 'price',
            render: price => formatPrice(price / 100),
        }),
        createColumn<PlanDTO, 'enabled'>({
            title: 'Ativo',
            key: 'enabled',
            align: 'center',
            render: (_, plan) => (
                <div className="flex justify-center">
                    <Switch
                        checked={!!plan.enabled}
                        onChange={() => toggleStatusPlanMutation.mutate({ id: plan.id, status: !plan.enabled })}
                        disabled={toggleStatusPlanMutation.isPending}
                    />
                </div>
            ),
        }),
        {
            title: 'Ações',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_: unknown, plan: PlanDTO) => {
                return <ActionsMenu onEdit={() => router.push(`/painel/planos/${plan.id}/editar`)} />;
            },
        },
    ];

    return (
        <Box className="bg-snow-white dark:bg-matte-black-contrast ">
            <PageBreadcrumb pageTitle="Planos" />
            <Container>
                <Box className="w-full">
                    <PaginationTable
                        bordered
                        data={plans}
                        meta={meta}
                        columns={columns}
                        isLoading={isLoading}
                    />
                </Box>
            </Container>
        </Box>
    );
}
