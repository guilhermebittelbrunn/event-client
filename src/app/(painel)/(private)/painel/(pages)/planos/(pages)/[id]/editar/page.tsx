'use client';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { FormFooter } from '@/shared/components/form/footer';
import { Container, LoadingScreen } from '@/shared/components/ui';

import { FormProvider } from '@/shared/components/hookForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePlanCrud } from '@/shared/hooks/usePlanCrud';
import useFindPlanById from '@/shared/hooks/useFindPlanById';
import { updatePlanRequestSchema, UpdatePlanSchema } from '@/lib/services/plan';
import { PlanForm } from '../../../(components)/PlanForm';

export default function EditPlanPage() {
    const { id } = useParams() as { id: string };
    const { updatePlanMutation } = usePlanCrud();
    const { data: plan, isPending } = useFindPlanById(id);

    const form = useForm({
        resolver: yupResolver(updatePlanRequestSchema),
    });

    const onSubmit: SubmitHandler<UpdatePlanSchema> = data => {
        if (id) {
            updatePlanMutation.mutate({
                id,
                description: data.description || '',
                price: data.price ? data.price * 100 : undefined,
                enabled: data.enabled,
                accessDays: data.accessDays,
            });
        }
    };

    useEffect(() => {
        if (plan) {
            form.reset({
                ...plan,
                description: plan.description || '',
                price: plan.price ? plan.price / 100 : undefined,
                accessDays: plan.accessDays ?? undefined,
                enabled: plan.enabled,
            });
        }
    }, [plan, form]);

    if (isPending) {
        return <LoadingScreen />;
    }

    return (
        <>
            <PageBreadcrumb
                pageTitle="Editar Plano"
                breadcrumbItems={[{ label: 'Planos', href: '/painel/planos' }]}
            />
            <Container title="Edite os dados do plano" className="mt-2">
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <PlanForm />
                        <FormFooter isLoading={updatePlanMutation.isPending} />
                    </form>
                </FormProvider>
            </Container>
        </>
    );
}
