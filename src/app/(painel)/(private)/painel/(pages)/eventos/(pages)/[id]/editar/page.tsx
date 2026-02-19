'use client';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { FormFooter } from '@/shared/components/form/footer';
import { Container } from '@/shared/components/ui';

import { FormProvider } from '@/shared/components/hookForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { EventForm } from '@/app/(painel)/(private)/painel/(pages)/eventos/(components)/EventForm';
import { useEventCrud } from '@/shared/hooks/useEventCrud';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEventRequestSchema, UpdateEventSchema } from '@/lib/services/event';
import { useEffect } from 'react';
import { EventStatusEnum, UserTypeEnum } from '@/shared/types/dtos';
import { useEventPage } from '@/app/(painel)/(private)/painel/(pages)/eventos/(store)/useEventPage';
import { useAuth } from '@/shared/store/useAuth';

export default function EditEventPage() {
    const { event } = useEventPage();
    const { updateEventMutation } = useEventCrud();
    const user = useAuth(state => state.user);
    const isAdmin = user?.type === UserTypeEnum.ADMIN;

    const form = useForm({
        resolver: yupResolver(createEventRequestSchema),
    });

    const onSubmit: SubmitHandler<UpdateEventSchema> = data => {
        if (event) {
            updateEventMutation.mutate({
                ...event,
                startAt: data.dates[0]!,
                endAt: data.dates[1]!,
                image: data?.image?.[0]?.originFileObj,
                ...(isAdmin && data.userId && { userId: data.userId }),
                ...(data.status && { status: data.status as EventStatusEnum }),
            });
        }
    };

    useEffect(() => {
        if (event) {
            form.reset({
                ...event,
                description: event.description || '',
                dates: [new Date(event.startAt), new Date(event.endAt)],
                userId: user?.type === UserTypeEnum.ADMIN ? event.userId : undefined,
                ...(event.file && {
                    image: [
                        {
                            uid: event.file.id,
                            name: event.file.name,
                            status: 'done',
                            url: event.file.url,
                            thumbUrl: event.file.url,
                        },
                    ],
                }),
            });
        }
    }, [event, form, user?.type]);

    return (
        <>
            <PageBreadcrumb
                pageTitle="Editar Evento"
                breadcrumbItems={[{ label: 'Eventos', href: '/painel/eventos' }]}
            />
            <Container title="Edite os dados do evento" className="mt-2">
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <EventForm action="update" />
                        <FormFooter isLoading={updateEventMutation.isPending} />
                    </form>
                </FormProvider>
            </Container>
        </>
    );
}
