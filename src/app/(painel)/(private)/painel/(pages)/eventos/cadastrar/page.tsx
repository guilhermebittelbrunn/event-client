'use client';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { FormFooter } from '@/shared/components/form/footer';
import { Container } from '@/shared/components/ui';

import { FormProvider } from '@/shared/components/hookForm';
import { SubmitHandler, useForm } from 'react-hook-form';
import { EventForm } from '../(components)/EventForm';
import { useEventCrud } from '../(hooks)/useEventCrud';
import { yupResolver } from '@hookform/resolvers/yup';
import { createEventRequestSchema, CreateEventSchema } from '@/lib/services/event';
import { useEffect } from 'react';

export default function CreateEventPage() {
    const { createEventMutation } = useEventCrud();
    const form = useForm({
        resolver: yupResolver(createEventRequestSchema),
    });

    useEffect(() => {
        console.log('form.formState.errors :>> ', form.formState.errors);
    }, [form.formState.errors]);

    const onSubmit: SubmitHandler<CreateEventSchema> = (data) => {
        createEventMutation.mutate({
            name: data.name,
            slug: data.slug,
            startAt: data.dates[0]!,
            endAt: data.dates[1]!,
        });
    };

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
