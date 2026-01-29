'use client';

import { CreditCardOutlined, PictureOutlined, PlusOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

import PageBreadcrumb from '@/shared/components/ui/pageBreadCrumb';
import { InputSearch, Select } from '@/shared/components/form';
import { AddButton, Container, PaginationTable, Tooltip, createColumn } from '@/shared/components/ui';
import { ActionMenuItem, ActionsMenu } from '@/shared/components/ui/actionMenu';
import { Box } from '@/shared/components/ui/box';
import { formatDate } from '@/shared/utils/helpers';
import { useEventCrud } from '../../../../../../../shared/hooks/useEventCrud';
import { EventDTO, EventStatusEnum, EventStatusOptions, UserTypeEnum } from '@/shared/types/dtos';
import ResponsiveImage from '@/shared/components/ui/responsiveImage';
import { useAuth } from '@/shared/store/useAuth';
import { Fallback } from '@/shared/components/common/fallback';
import { EVENT_STATUS_OPTIONS } from '@/shared/consts/event';
import useQueryParams from '@/shared/hooks/useQueryParams';
import { PaymentStatusEnum } from '@/shared/types/dtos/billing/payment';

export default function EventsPage() {
    const router = useRouter();
    const user = useAuth(state => state.user);
    const isAdmin = user?.type === UserTypeEnum.ADMIN;

    const { apiParams } = useQueryParams({
        params: [
            {
                key: 'statuses',
                defaultValue: [],
                initialValue: isAdmin ? [EventStatusEnum.IN_PROGRESS] : [],
                multiple: true,
            },
            { key: 'order', defaultValue: '', initialValue: 'asc' },
            { key: 'orderBy', defaultValue: '', initialValue: 'startAt' },
        ],
    });

    const { useListPaginatedEvent, deleteEventMutation } = useEventCrud();

    const { data, isLoading } = useListPaginatedEvent(apiParams);

    const { data: events, meta } = data || {};

    const columns = [
        createColumn<EventDTO, 'file'>({
            title: 'Foto',
            key: 'file',
            fixed: 'left',
            render: file => (
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
            render: user => <Tooltip title={user?.email}>{user?.name}</Tooltip>,
            condition: isAdmin,
        }),
        createColumn<EventDTO, 'status'>({
            title: 'Status',
            key: 'status',
            render: status => EventStatusOptions.find(option => option.value === status)?.label,
            sort: true,
        }),
        createColumn<EventDTO, 'startAt'>({
            title: 'Data de início',
            key: 'startAt',
            render: startAt => formatDate(startAt),
            sort: true,
        }),
        createColumn<EventDTO, 'endAt'>({
            title: 'Data de término',
            key: 'endAt',
            render: endAt => formatDate(endAt),
            sort: true,
        }),
        {
            title: 'Ações',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_: unknown, event: EventDTO) => {
                const isPendingPayment =
                    event.status === EventStatusEnum.PENDING_PAYMENT &&
                    event.payment?.status === PaymentStatusEnum.PENDING;

                const isExpiredPayment =
                    event.payment?.status === PaymentStatusEnum.EXPIRED &&
                    event.status !== EventStatusEnum.PENDING_PAYMENT;

                const isConfirmedStatus = event.status === EventStatusEnum.PUBLISHED;

                const actionsForPendingPayment = [
                    {
                        icon: <CreditCardOutlined style={{ scale: 1.25 }} />,
                        key: 'confirm-payment',
                        label: 'Pagamento',
                        onClick: () => {
                            router.push(`/painel/eventos/${event.id}/confirmar-pagamento`);
                        },
                    },
                ];

                const actionsForConfirmedStatus = [
                    {
                        icon: <PictureOutlined style={{ scale: 1.25 }} />,
                        key: 'details',
                        label: 'Fotos',
                        onClick: () => {
                            router.push(`/painel/eventos/${event.id}/detalhes`);
                        },
                    },
                    {
                        icon: <QrcodeOutlined style={{ scale: 1.25 }} />,
                        key: 'qrcode',
                        label: 'Acessos',
                        onClick: () => {
                            router.push(`/painel/eventos/${event.id}/acessos`);
                        },
                    },
                ];

                const actions: ActionMenuItem[] = [];

                if (isPendingPayment) {
                    actions.push(...actionsForPendingPayment);
                }

                if (isConfirmedStatus) {
                    actions.push(...actionsForConfirmedStatus);
                }

                if (isExpiredPayment) {
                    actions.filter(_ => false);
                }

                return (
                    <ActionsMenu
                        items={actions}
                        onEdit={
                            isExpiredPayment
                                ? undefined
                                : () => router.push(`/painel/eventos/${event.id}/editar`)
                        }
                        onDelete={() => deleteEventMutation.mutate(event.id)}
                    />
                );
            },
        },
    ];

    return (
        <Box className="bg-snow-white dark:bg-matte-black-contrast ">
            <PageBreadcrumb
                pageTitle="Eventos"
                sideElement={
                    <AddButton
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push('/painel/eventos/cadastrar')}
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
                    <PaginationTable
                        bordered
                        data={events}
                        meta={meta}
                        columns={columns}
                        isLoading={isLoading}
                    />
                </Box>
            </Container>
        </Box>
    );
}
