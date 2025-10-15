'use client';

import { PictureOutlined, PlusOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { InputSearch, Select } from '@/shared/components/form';
import { AddButton, Container, PaginationTable, Tooltip, createColumn } from '@/shared/components/ui';
import { ActionsMenu } from '@/shared/components/ui/actionMenu';
import { Box } from '@/shared/components/ui/box';
import { formatDate } from '@/shared/utils/helpers';
import { useEventCrud } from '../../../../../../../shared/hooks/useEventCrud';
import { EventDTO, EventStatusEnum, EventStatusOptions, UserTypeEnum } from '@/shared/types/dtos';
import ResponsiveImage from '@/shared/components/ui/responsiveImage';
import { useAuth } from '@/shared/store/useAuth';
import { Fallback } from '@/shared/components/common/fallback';
import { EVENT_STATUS_OPTIONS } from '@/shared/consts/event';
import useQueryParams from '@/shared/hooks/useQueryParams';

export default function EventsPage() {
    const router = useRouter();

    const { apiParams } = useQueryParams({
        params: [
            { key: 'statuses', defaultValue: [], initialValue: [EventStatusEnum.IN_PROGRESS], multiple: true },
            { key: 'order', defaultValue: '', initialValue: 'asc' },
            { key: 'orderBy', defaultValue: '', initialValue: 'startAt' },
        ],
    });

    const { useListPaginatedEvent, deleteEventMutation } = useEventCrud();
    const user = useAuth((state) => state.user);

    const { data, isLoading } = useListPaginatedEvent(apiParams);

    const isAdmin = user?.type === UserTypeEnum.ADMIN;

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
            sort: true,
        }),
        createColumn<EventDTO, 'user'>({
            title: 'Criado por',
            key: 'user',
            render: (user) => <Tooltip title={user?.email}>{user?.name}</Tooltip>,
            condition: isAdmin,
        }),
        createColumn<EventDTO, 'status'>({
            title: 'Status',
            key: 'status',
            render: (status) => EventStatusOptions.find((option) => option.value === status)?.label,
            sort: true,
        }),
        createColumn<EventDTO, 'startAt'>({
            title: 'Data de início',
            key: 'startAt',
            render: (startAt) => formatDate(startAt),
            sort: true,
        }),
        createColumn<EventDTO, 'endAt'>({
            title: 'Data de término',
            key: 'endAt',
            render: (endAt) => formatDate(endAt),
            sort: true,
        }),
        {
            title: 'Ações',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_: unknown, record) => (
                <ActionsMenu
                    items={[
                        {
                            icon: <PictureOutlined style={{ scale: 1.25 }} />,
                            key: 'details',
                            label: 'Fotos',
                            onClick: () => {
                                router.push(`/painel/eventos/${record.id}/detalhes`);
                            },
                        },
                        {
                            icon: <QrcodeOutlined style={{ scale: 1.25 }} />,
                            key: 'qrcode',
                            label: 'Acessos',
                            onClick: () => {
                                router.push(`/painel/eventos/${record.id}/acessos`);
                            },
                        },
                    ]}
                    onEdit={() => router.push(`/painel/eventos/${record.id}/editar`)}
                    onDelete={() => deleteEventMutation.mutate(record.id)}
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
                    <Box className="flex flex-col gap-2 justify-end items-end md:flex-row">
                        <Select
                            options={EVENT_STATUS_OPTIONS}
                            placeholder="Status"
                            paramKey="statuses"
                            changeUrl
                            className="w-full md:w-2/5"
                            multiple
                        />
                        <InputSearch
                            changeUrl
                            placeholder="Nome do evento"
                            trigger={['onChange']}
                            className="w-full md:w-2/5"
                        />
                    </Box>
                </Box>
                <Box className="w-full">
                    <PaginationTable data={events || []} meta={meta} columns={columns} isLoading={isLoading} />
                </Box>
            </Container>
        </Box>
    );
}
