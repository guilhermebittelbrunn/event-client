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

const mockData = {
    data: [
        {
            id: '232f4592-8df2-403c-94b4-25410e0a85ef',
            name: 'bob',
            breed: 'pastor alemão',
            mainPicture: {
                url: 'https://acapra.s3.us-east-1.amazonaws.com/acapra/56060da3-17e2-473a-9bef-809a3bda2da5/1745365597343-filhote-de-cachorro-bichon-frise-fofo-posando-no-estudio_1303-27287.avif',
            },
            age: 1,
            weight: 4,
            specie: {
                id: '1',
                name: 'Cachorro',
                specieBaseId: '448f5914-76b6-4781-844a-abb9837875e8 ',
                sequence: 1,
                enabled: true,
                associationId: '61801745-716a-4207-a9ef-65c902984e4a',
            },
            status: 'AVAILABLE',
            gender: 'MALE',
            size: 'BIG',
        },
        {
            id: 'f77bb42b-a2ea-4e83-8f6d-f0b9325dbfb7',
            name: 'bob',
            breed: 'pastor alemão',
            mainPicture: {
                url: 'https://acapra.s3.us-east-1.amazonaws.com/acapra/56060da3-17e2-473a-9bef-809a3bda2da5/1745365597343-filhote-de-cachorro-bichon-frise-fofo-posando-no-estudio_1303-27287.avif',
            },
            specie: {
                id: '1',
                name: 'Cachorro',
                specieBaseId: '448f5914-76b6-4781-844a-abb9837875e8 ',
                sequence: 1,
                enabled: true,
                associationId: '61801745-716a-4207-a9ef-65c902984e4a',
            },
            age: 1,
            weight: 4,
            status: 'AVAILABLE',
            gender: 'MALE',
            size: 'BIG',
        },
        {
            id: '046fd308-ff68-4a68-a988-12d599634875',
            name: 'bob',
            breed: 'pastor alemão',
            mainPicture: {
                url: 'https://acapra.s3.us-east-1.amazonaws.com/acapra/56060da3-17e2-473a-9bef-809a3bda2da5/1745365597343-filhote-de-cachorro-bichon-frise-fofo-posando-no-estudio_1303-27287.avif',
            },
            specie: {
                id: '1',
                name: 'Cachorro',
                specieBaseId: '448f5914-76b6-4781-844a-abb9837875e8 ',
                sequence: 1,
                enabled: true,
                associationId: '61801745-716a-4207-a9ef-65c902984e4a',
            },
            age: 1,
            weight: 4,
            status: 'AVAILABLE',
            gender: 'MALE',
            size: 'BIG',
        },
        {
            id: 'e2f75746-5c92-45eb-a06e-ebeaddeb40bc',
            name: 'bob',
            breed: 'pastor alemão',
            mainPicture: {
                url: 'https://acapra.s3.us-east-1.amazonaws.com/acapra/56060da3-17e2-473a-9bef-809a3bda2da5/1745365597343-filhote-de-cachorro-bichon-frise-fofo-posando-no-estudio_1303-27287.avif',
            },
            specie: {
                id: '1',
                name: 'Cachorro',
                specieBaseId: '448f5914-76b6-4781-844a-abb9837875e8 ',
                sequence: 1,
                enabled: true,
                associationId: '61801745-716a-4207-a9ef-65c902984e4a',
            },
            age: 1,
            weight: 4,
            status: 'AVAILABLE',
            gender: 'MALE',
            size: 'BIG',
        },
        {
            id: '2b0a44c0-55cf-4266-a4be-4e45339ce8dd',
            name: 'bob',
            breed: 'pastor alemão',
            mainPicture: {
                url: 'https://acapra.s3.us-east-1.amazonaws.com/acapra/56060da3-17e2-473a-9bef-809a3bda2da5/1745365597343-filhote-de-cachorro-bichon-frise-fofo-posando-no-estudio_1303-27287.avif',
            },
            specie: {
                id: '1',
                name: 'Cachorro',
                specieBaseId: '448f5914-76b6-4781-844a-abb9837875e8 ',
                sequence: 1,
                enabled: true,
                associationId: '61801745-716a-4207-a9ef-65c902984e4a',
            },
            age: 1,
            weight: 4,
            status: 'AVAILABLE',
            gender: 'MALE',
            size: 'BIG',
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
interface AnimalsResponse {
    data: any[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
        hasNextPage: boolean;
    };
}

export default function AnimalsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AnimalsPageContent />
        </Suspense>
    );
}

function AnimalsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [animals, setAnimals] = useState<AnimalsResponse | null>(null);

    const currentPage = Number(searchParams.get('page')) || 1;
    const currentStatus = searchParams.get('status') || undefined;
    const currentGender = searchParams.get('gender') || undefined;
    const currentSize = searchParams.get('size') || undefined;
    const currentSearch = searchParams.get('search') || undefined;

    const columns: ColumnType<any>[] = [
        {
            title: 'Foto',
            dataIndex: 'mainPicture',
            key: 'mainPicture',
            width: 100,
            fixed: 'left',
            render: (picture) => (
                <div className="flex items-center gap-2">
                    <div
                        className="w-12 h-12 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${picture?.url})` }}
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
            title: 'Espécie',
            dataIndex: 'specie',
            key: 'specie',
            render: (specie) => specie?.name,
        },
        {
            title: 'Raça',
            dataIndex: 'breed',
            key: 'breed',
        },
        {
            title: 'Gênero',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => gender,
        },
        {
            title: 'Porte',
            dataIndex: 'size',
            key: 'size',
            render: (size) => size,
        },
        {
            title: 'Idade',
            dataIndex: 'age',
            key: 'age',
            render: (age: number) => `${age} ano${age !== 1 ? 's' : ''}`,
        },
        {
            title: 'Peso',
            dataIndex: 'weight',
            key: 'weight',
            render: (weight: number) => `${weight} kg`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => status,
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
        setAnimals(mockData);
    }, [currentPage, currentStatus, currentGender, currentSize, currentSearch]);

    return (
        <>
            <PageBreadcrumb
                pageTitle="Animais"
                sideElement={
                    <AddButton
                        icon={<PlusOutlined />}
                        onClick={() => {
                            router.push('/painel/animais/cadastrar');
                        }}
                    >
                        Novo Animal
                    </AddButton>
                }
            />
            <Container>
                <div className="mb-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        <Select
                            name="gender"
                            placeholder="Gênero"
                            changeUrl
                            value={currentGender}
                            allowClear
                            options={[
                                {
                                    value: 'AVAILABLE',
                                    label: 'Disponível',
                                },
                            ]}
                        />
                        <Select
                            name="size"
                            placeholder="Porte"
                            changeUrl
                            value={currentSize}
                            allowClear
                            options={[
                                {
                                    value: 'AVAILABLE',
                                    label: 'Disponível',
                                },
                            ]}
                        />
                        <InputSearch changeUrl placeholder="Nome do animal" trigger={['onChange']} />
                    </div>
                </div>
                <div className="w-full overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={animals?.data}
                        rowKey="id"
                        loading={!animals}
                        pagination={{
                            current: currentPage,
                            pageSize: 10,
                            total: animals?.meta.total,
                            showSizeChanger: false,
                        }}
                        onChange={handleTableChange}
                    />
                </div>
            </Container>
        </>
    );
}
