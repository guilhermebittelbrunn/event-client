'use client';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { Card, Row, Col, Descriptions, Tag, Typography, Space } from 'antd';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const mockAnimalData: { data: any } = {
    data: {
        id: 'b2c20b3b-df40-4233-ac92-3e5d0063eaa7',
        associationId: 'ea42918b-749d-4c9a-a1c3-fa278350f310',
        specieId: 'b7b06e5b-3eab-4461-9563-6abd857a9109',
        breed: 'pastor alemão',
        isFavorite: false,
        name: 'Roberto',
        description: null,
        age: 1,
        weight: 4,
        status: 'IN_ADOPTION',
        gender: 'MALE',
        size: 'SMALL',
        createdAt: '2025-04-01T23:57:53.516Z',
        updatedAt: '2025-04-01T23:57:53.516Z',
        specie: {
            id: 'b7b06e5b-3eab-4461-9563-6abd857a9109',
            associationId: 'ea42918b-749d-4c9a-a1c3-fa278350f310',
            specieBaseId: '71b4e62a-9d4a-4018-be27-1f7154171819',
            sequence: null,
            name: 'Cachorrão',
            enabled: true,
        },
        tags: [
            {
                id: 'b9d11c20-3454-4c21-9a2e-3c14cf40a080',
                associationId: 'ea42918b-749d-4c9a-a1c3-fa278350f310',
                name: 'atencioso',
                enabled: true,
            },
        ],
        pictures: [
            {
                id: 'cd1ba5a8-4a9f-454a-b373-3616bd6ecef3',
                entityId: 'b2c20b3b-df40-4233-ac92-3e5d0063eaa7',
                url: 'https://acapra.s3.us-east-1.amazonaws.com/acapra/56060da3-17e2-473a-9bef-809a3bda2da5/1745365597343-filhote-de-cachorro-bichon-frise-fofo-posando-no-estudio_1303-27287.avif',
                originalName: 'filhote-de-cachorro-bichon-frise-fofo-posando-no-estudio_1303-27287.avif',
                path: 'acapra/56060da3-17e2-473a-9bef-809a3bda2da5/1745365597343-filhote-de-cachorro-bichon-frise-fofo-posando-no-estudio_1303-27287.avif',
                sequence: null,
                enabled: true,
                createdAt: '2025-04-22T23:46:38.197Z',
                updatedAt: '2025-04-22T23:46:38.197Z',
            },
        ],
    },
};

export default function AnimalPage() {
    const { id } = useParams();
    const animal = mockAnimalData.data;

    return (
        <div>
            <PageBreadcrumb
                pageTitle={`${animal.name} - ${id?.slice(0, 8)}`}
                breadcrumbItems={[{ label: 'Animais', href: '/painel/animais' }]}
            />

            <Row gutter={[24, 24]} className="mt-6">
                <Col xs={12} md={6}>
                    <Card>
                        <Image
                            src={animal.pictures[0]?.url}
                            alt={animal.name}
                            className="w-full rounded-lg"
                            width={300}
                            height={500}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card>
                        <Space direction="vertical" size="large" className="w-full">
                            <div>
                                <Typography.Title level={3}>{animal.name}</Typography.Title>
                                <Space>
                                    <Tag color="blue">{animal.specie.name}</Tag>
                                    <Tag color="green">{animal.breed}</Tag>
                                    <Tag color={animal.status === 'IN_ADOPTION' ? 'green' : 'orange'}>
                                        {animal.status === 'IN_ADOPTION'
                                            ? 'Disponível para adoção'
                                            : 'Em processo de adoção'}
                                    </Tag>
                                </Space>
                            </div>

                            <Descriptions column={1}>
                                <Descriptions.Item label="Idade">{animal.age} anos</Descriptions.Item>
                                <Descriptions.Item label="Peso">{animal.weight} kg</Descriptions.Item>
                                <Descriptions.Item label="Gênero">
                                    {animal.gender === 'MALE' ? 'Macho' : 'Fêmea'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Porte">
                                    {animal.size === 'SMALL'
                                        ? 'Pequeno'
                                        : animal.size === 'MEDIUM'
                                          ? 'Médio'
                                          : 'Grande'}
                                </Descriptions.Item>
                            </Descriptions>

                            {animal.tags && animal.tags.length > 0 && (
                                <div>
                                    <Typography.Title level={5}>Características</Typography.Title>
                                    <Space wrap>
                                        {animal.tags.map((tag) => (
                                            <Tag key={tag.id}>{tag.name}</Tag>
                                        ))}
                                    </Space>
                                </div>
                            )}

                            {animal.description && (
                                <div>
                                    <Typography.Title level={5}>Sobre</Typography.Title>
                                    <Typography.Paragraph>{animal.description}</Typography.Paragraph>
                                </div>
                            )}
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
