import { Container } from '@/shared/components/ui/container';
import { Table } from 'antd';
import Link from 'antd/es/typography/Link';

const requestsMocks = Array.from({ length: 4 }, (_, index) => {
    return {
        id: index,
        animal: {
            mainPicture: {
                url: 'https://acapra.s3.us-east-1.amazonaws.com/acapra/56060da3-17e2-473a-9bef-809a3bda2da5/1745365597343-filhote-de-cachorro-bichon-frise-fofo-posando-no-estudio_1303-27287.avif',
            },
            name: 'Rex',
            age: 2,
            specie: {
                name: 'Cachorro',
            },
        },
        requestedByUser: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
        },
        status: 'pending',
        createdAt: '2021-01-01',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    };
});

export default function LastRequests() {
    const columns = [
        {
            title: 'Animal',
            dataIndex: 'animal',
            render: (animal) => (
                <div className="flex items-center gap-2">
                    <div
                        className="w-10 h-10 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${animal.mainPicture.url})` }}
                    />
                    <div>
                        <div className="font-medium">{animal.name}</div>
                        <div className="text-xs text-gray-500">
                            {animal.specie.name}, {animal.age} {animal.age > 1 ? 'anos' : 'ano'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Interessado',
            dataIndex: 'requestedByUser',
            render: (user) => (
                <div className="flex items-center gap-2">
                    <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                const map = {
                    pending: { label: 'Pendente', color: 'bg-gray-200 text-gray-800' },
                    approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
                    rejected: { label: 'Recusado', color: 'bg-red-100 text-red-800' },
                };
                const { label, color } = map[status] || map.pending;
                return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{label}</span>;
            },
        },
        {
            title: 'Data',
            dataIndex: 'createdAt',
            render: (date) => <span>{new Date(date).toLocaleDateString('pt-BR')}</span>,
        },
        {
            title: 'Observação',
            dataIndex: 'description',
            render: (desc) => (
                <span className="truncate block max-w-xs" title={desc}>
                    {desc}
                </span>
            ),
        },
        {
            title: '',
            dataIndex: 'seeMore',
            render: (_, record) => (
                <Link href={`/associacao/requests/${record.id}`}>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-primary-100 text-primary-700 hover:bg-primary-200 text-xs font-medium transition-colors">
                        Visualizar
                        <svg
                            width="16"
                            height="16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="inline-block"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </span>
                </Link>
            ),
        },
    ];

    return (
        <div className="col-span-12 space-y-5 sm:space-y-6">
            <Container
                title="Últimas Requisições de Adoção"
                subTitle={<Link href="/associacao/requests">Ver todas</Link>}
            >
                <div className="w-full overflow-x-auto">
                    <Table columns={columns} dataSource={requestsMocks} pagination={false} rowKey="id" />
                </div>
            </Container>
        </div>
    );
}
