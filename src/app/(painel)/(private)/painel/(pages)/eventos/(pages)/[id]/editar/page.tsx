'use client';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { FormFooter } from '@/shared/components/form/footer';
import { Container, LoadingScreen } from '@/shared/components/ui';

import { FormProvider } from '@/shared/components/hookForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { EventForm } from '@/app/(painel)/(private)/painel/(pages)/eventos/(components)/EventForm';
import { useEventCrud } from '@/shared/hooks/useEventCrud';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEventRequestSchema, CreateEventSchema } from '@/lib/services/event';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAlert, useRedirect } from '@/shared/hooks';
import useFindEventById from '@/shared/hooks/useFindEventById';
import { EventStatusEnum } from '@/shared/types/dtos';

export default function EditEventPage() {
    const { id } = useParams() as { id: string };
    const { errorAlert } = useAlert();
    const { redirect } = useRedirect();

    const { data: event, isPending } = useFindEventById(id);
    const { updateEventMutation } = useEventCrud();

    const form = useForm({
        resolver: yupResolver(createEventRequestSchema),
    });

    const onSubmit: SubmitHandler<CreateEventSchema> = (data) => {
        updateEventMutation.mutate({
            id: id,
            name: data.name,
            description: data.description,
            slug: data.slug,
            startAt: data.dates[0]!,
            endAt: data.dates[1]!,
            image: data?.image?.[0]?.originFileObj,
            ...(data.status && { status: data.status as EventStatusEnum }),
        });
    };

    useEffect(() => {
        if (event) {
            form.reset({
                name: event.name,
                slug: event.slug,
                description: event.description || '',
                dates: [new Date(event.startAt), new Date(event.endAt)],
                status: event.status,
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
    }, [event, form]);

    useEffect(() => {
        if (!isPending && !event) {
            errorAlert('Evento não encontrado');
            redirect('/painel/eventos');
        }
    }, [isPending, event, errorAlert, redirect]);

    if (isPending) {
        return <LoadingScreen />;
    }

    return (
        <>
            <PageBreadcrumb
                pageTitle="Editar Evento"
                breadcrumbItems={[{ label: 'Eventos', href: '/painel/eventos' }]}
            />
            <Container title="Edite os dados do evento" className="mt-2">
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <EventForm />
                        <FormFooter isLoading={updateEventMutation.isPending} />
                    </form>
                </FormProvider>
            </Container>
        </>
    );
}
