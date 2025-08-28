'use client';

import { PlusOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import type { TablePaginationConfig } from 'antd/es/table';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { InputSearch, Select } from '@/shared/components/form';
import { AddButton, Container, Table } from '@/shared/components/ui';
import { ActionsMenu } from '@/shared/components/ui/actionMenu';
import { ColumnType } from 'antd/lib/table';
import { Box } from '@/shared/components/ui/box';
import { formatDate } from '@/shared/utils/helpers';

const mockData = {
    data: [
        {
            id: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
            userId: 'a73ddbcf-5945-426d-a8c3-1d5cef9cf8a6',
            fileId: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
            name: 'festival',
            slug: 'brava-fest7',
            status: 'draft',
            description: 'descrição qualquer',
            startAt: '2025-08-01T02:11:46.241Z',
            endAt: '2025-08-30T02:11:46.241Z',
            createdAt: '2025-08-25T01:20:05.917Z',
            updatedAt: '2025-08-25T01:20:05.917Z',
            deletedAt: null,
            config: {
                id: 'e585303c-c69e-4561-9500-312b00e265e6',
                eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
                primaryColor: '#000000',
                secondaryColor: '#000000',
                primaryContrast: '#ffffff',
                secondaryContrast: '#000000',
                backgroundColor: '#ffffff',
                backgroundContrast: '#f2f2f2',
                textColorPrimary: '#000000',
                textColorSecondary: '#000000',
                welcomeMessage: 'Bem-vindo ao nosso evento!',
            },
            guestAccess: {
                id: '1fcf7358-0e69-43ad-af90-24eb8155e40b',
                eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
                url: '/brava-fest7?t=1fcf7358-0e69-43ad-af90-24eb8155e40b',
                type: 'guest',
                createdAt: '2025-08-25T01:20:05.924Z',
                updatedAt: '2025-08-25T01:20:05.924Z',
                deletedAt: null,
            },
            file: {
                id: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
                name: 'b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
                path: 'event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
                size: 10288,
                url: 'https://acapra.s3.us-east-1.amazonaws.com/event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168%202.jpg',
                createdAt: '2025-08-25T01:20:05.911Z',
                updatedAt: '2025-08-25T01:20:05.911Z',
                deletedAt: null,
            },
        },
        {
            id: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
            userId: 'a73ddbcf-5945-426d-a8c3-1d5cef9cf8a6',
            fileId: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
            name: 'festival',
            slug: 'brava-fest7',
            status: 'draft',
            description: 'descrição qualquer',
            startAt: '2025-08-01T02:11:46.241Z',
            endAt: '2025-08-30T02:11:46.241Z',
            createdAt: '2025-08-25T01:20:05.917Z',
            updatedAt: '2025-08-25T01:20:05.917Z',
            deletedAt: null,
            config: {
                id: 'e585303c-c69e-4561-9500-312b00e265e6',
                eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
                primaryColor: '#000000',
                secondaryColor: '#000000',
                primaryContrast: '#ffffff',
                secondaryContrast: '#000000',
                backgroundColor: '#ffffff',
                backgroundContrast: '#f2f2f2',
                textColorPrimary: '#000000',
                textColorSecondary: '#000000',
                welcomeMessage: 'Bem-vindo ao nosso evento!',
            },
            guestAccess: {
                id: '1fcf7358-0e69-43ad-af90-24eb8155e40b',
                eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
                url: '/brava-fest7?t=1fcf7358-0e69-43ad-af90-24eb8155e40b',
                type: 'guest',
                createdAt: '2025-08-25T01:20:05.924Z',
                updatedAt: '2025-08-25T01:20:05.924Z',
                deletedAt: null,
            },
            file: {
                id: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
                name: 'b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
                path: 'event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
                size: 10288,
                url: 'https://acapra.s3.us-east-1.amazonaws.com/event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168%202.jpg',
                createdAt: '2025-08-25T01:20:05.911Z',
                updatedAt: '2025-08-25T01:20:05.911Z',
                deletedAt: null,
            },
        },
        {
            id: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
            userId: 'a73ddbcf-5945-426d-a8c3-1d5cef9cf8a6',
            fileId: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
            name: 'festival',
            slug: 'brava-fest7',
            status: 'draft',
            description: 'descrição qualquer',
            startAt: '2025-08-01T02:11:46.241Z',
            endAt: '2025-08-30T02:11:46.241Z',
            createdAt: '2025-08-25T01:20:05.917Z',
            updatedAt: '2025-08-25T01:20:05.917Z',
            deletedAt: null,
            config: {
                id: 'e585303c-c69e-4561-9500-312b00e265e6',
                eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
                primaryColor: '#000000',
                secondaryColor: '#000000',
                primaryContrast: '#ffffff',
                secondaryContrast: '#000000',
                backgroundColor: '#ffffff',
                backgroundContrast: '#f2f2f2',
                textColorPrimary: '#000000',
                textColorSecondary: '#000000',
                welcomeMessage: 'Bem-vindo ao nosso evento!',
            },
            guestAccess: {
                id: '1fcf7358-0e69-43ad-af90-24eb8155e40b',
                eventId: 'a3e4c15a-b5cd-4a9d-b04e-f4f553aff33e',
                url: '/brava-fest7?t=1fcf7358-0e69-43ad-af90-24eb8155e40b',
                type: 'guest',
                createdAt: '2025-08-25T01:20:05.924Z',
                updatedAt: '2025-08-25T01:20:05.924Z',
                deletedAt: null,
            },
            file: {
                id: '188911d3-79fe-4d13-8ae8-3f7654810ac9',
                name: 'b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
                path: 'event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168 2.jpg',
                size: 10288,
                url: 'https://acapra.s3.us-east-1.amazonaws.com/event/188911d3-79fe-4d13-8ae8-3f7654810ac9/1756084805247-b210bbac-79b9-4dcd-a737-3a0ede315ed1_d8a4fa3f-4ffa-42ce-8fb7-82fc3812883c_300x168%202.jpg',
                createdAt: '2025-08-25T01:20:05.911Z',
                updatedAt: '2025-08-25T01:20:05.911Z',
                deletedAt: null,
            },
        },
    ],
    meta: {
        total: 27,
        page: 1,
        limit: 10,
        pages: 3,
        hasNextPage: true,
    },
};
interface EventsResponse {
    data: any[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
        hasNextPage: boolean;
    };
}

export default function EventsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EventsPageContent />
        </Suspense>
    );
}

function EventsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [events, setEvents] = useState<EventsResponse | null>(null);

    const currentPage = Number(searchParams.get('page')) || 1;
    const currentStatus = searchParams.get('status') || undefined;
    const currentGender = searchParams.get('gender') || undefined;
    const currentSize = searchParams.get('size') || undefined;
    const currentSearch = searchParams.get('search') || undefined;

    const columns: ColumnType<any>[] = [
        {
            title: 'Foto',
            dataIndex: 'file',
            key: 'file',
            width: 100,
            fixed: 'left',
            render: (file) => (
                <div className="flex items-center gap-2">
                    <div
                        className="w-12 h-12 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${file?.url})` }}
                    />
                </div>
            ),
        },
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => status,
        },
        {
            title: 'Data de início',
            dataIndex: 'startAt',
            key: 'startAt',
            render: (startAt) => formatDate(startAt),
        },
        {
            title: 'Data de término',
            dataIndex: 'endAt',
            key: 'endAt',
            render: (endAt) => formatDate(endAt),
        },

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

    const handleTableChange = (pagination: TablePaginationConfig) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pagination.current?.toString() || '1');
        router.push(`?${params.toString()}`);
    };

    useEffect(() => {
        setEvents(mockData);
    }, [currentPage, currentStatus, currentGender, currentSize, currentSearch]);

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
                            value={currentStatus}
                            allowClear
                            options={[
                                {
                                    value: 'AVAILABLE',
                                    label: 'Disponível',
                                },
                            ]}
                        />

                        <InputSearch changeUrl placeholder="Nome do animal" trigger={['onChange']} />
                    </Box>
                </Box>
                <Box className="w-full overflow-x-auto ">
                    <Table
                        columns={columns}
                        dataSource={events?.data}
                        rowKey="id"
                        loading={!events}
                        pagination={{
                            current: currentPage,
                            pageSize: 10,
                            total: events?.meta.total,
                            showSizeChanger: false,
                        }}
                        onChange={handleTableChange}
                    />
                </Box>
            </Container>
        </Box>
    );
}
