'use client';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { FormFooter } from '@/shared/components/form/footer';
import { Container } from '@/shared/components/ui';

import { FormProvider } from '@/shared/components/hookForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { EventForm } from '../../(components)/EventForm';
import { useEventCrud } from '../../../../../../../../shared/hooks/useEventCrud';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEventRequestSchema, CreateEventSchema } from '@/lib/services/event';
import { useAuth } from '@/shared/store/useAuth';
import { useEffect } from 'react';
import { UserTypeEnum } from '@/shared/types/dtos';

export default function CreateEventPage() {
    const { createEventMutation } = useEventCrud();

    const user = useAuth(state => state.user);
    const isAdmin = user?.type === UserTypeEnum.ADMIN;

    const form = useForm({
        resolver: yupResolver(createEventRequestSchema),
    });

    const onSubmit: SubmitHandler<CreateEventSchema> = data => {
        const { userId, ...rest } = data;

        createEventMutation.mutate({
            ...rest,
            startAt: data.dates[0]!,
            endAt: data.dates[1]!,
            image: data?.image?.[0]?.originFileObj,
            ...(isAdmin && userId && { userId }),
        });
    };

    useEffect(() => {
        if (user && user.type === UserTypeEnum.ADMIN) {
            form.setValue('userId', user.id);
        }
    }, [user, form]);

    return (
        <>
            <PageBreadcrumb
                pageTitle="Cadastrar Evento"
                breadcrumbItems={[{ label: 'Eventos', href: '/painel/eventos' }]}
            />
            <Container title="Preencha os dados do evento" className="mt-2 ">
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <EventForm />
                        <FormFooter isLoading={createEventMutation.isPending} />
                    </form>
                </FormProvider>
            </Container>
        </>
    );
}
