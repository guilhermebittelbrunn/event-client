'use client';

import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { InputSearch, Select } from '@/shared/components/form';
import { AddButton, Container, PaginationTable, createColumn } from '@/shared/components/ui';
import { ActionsMenu } from '@/shared/components/ui/actionMenu';
import { Box } from '@/shared/components/ui/box';
import { formatDate } from '@/shared/utils/helpers';
import { useEventCrud } from './(hooks)/useEventCrud';
import { Fallback } from '@/shared/components/common/fallback';
import { EventDTO, EventStatusOptions } from '@/shared/types/dtos';
import ResponsiveImage from '@/shared/components/ui/responsiveImage';

export default function EventsPage() {
    const router = useRouter();
    const { useListPaginatedEvent } = useEventCrud();

    const { data, isLoading } = useListPaginatedEvent();

    const { data: events, meta } = data || {};

    const columns = [
        createColumn<EventDTO, 'file'>({
            title: 'Foto',
            key: 'file',
            fixed: 'left',
            render: (file) => (
                <Fallback condition={Boolean(file && file?.url)}>
                    <ResponsiveImage src={file?.url} alt="Event image" width={10} height={10} />
                </Fallback>
            ),
        }),
        createColumn<EventDTO, 'name'>({
            title: 'Nome',
            key: 'name',
        }),
        createColumn<EventDTO, 'description'>({
            title: 'Descrição',
            key: 'description',
        }),
        createColumn<EventDTO, 'status'>({
            title: 'Status',
            key: 'status',
            render: (status) => EventStatusOptions.find((option) => option.value === status)?.label,
        }),
        createColumn<EventDTO, 'startAt'>({
            title: 'Data de início',
            key: 'startAt',
            render: (startAt) => formatDate(startAt),
        }),
        createColumn<EventDTO, 'endAt'>({
            title: 'Data de término',
            key: 'endAt',
            render: (endAt) => formatDate(endAt),
        }),
        {
            title: 'Ações',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_: unknown, record) => (
                <ActionsMenu
                    items={[]}
                    onEdit={() => {
                        router.push(`/painel/animais/${record.id}`);
                    }}
                    onDelete={() => {
                        // TODO: Implement delete action
                        console.log('Delete', record);
                    }}
                />
            ),
        },
    ];

    return (
        <Box className="dark:bg-matte-black-contrast ">
            <PageBreadcrumb
                pageTitle="Eventos"
                sideElement={
                    <AddButton
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            router.push('/painel/eventos/cadastrar');
                        }}
                    >
                        Novo Evento
                    </AddButton>
                }
            />
            <Container>
                <Box className="mb-4 space-y-4">
                    <Box className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white">
                        <Select
                            mode="multiple"
                            name="status"
                            changeUrl
                            placeholder="Status"
                            allowClear
                            options={EventStatusOptions}
                        />

                        <InputSearch changeUrl placeholder="Nome do evento" trigger={['onChange']} />
                    </Box>
                </Box>
                <Box className="w-full overflow-x-auto ">
                    <PaginationTable data={events || []} meta={meta} columns={columns} isLoading={isLoading} />
                </Box>
            </Container>
        </Box>
    );
}
