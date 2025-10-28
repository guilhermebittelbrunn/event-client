import { useRouter } from 'next/navigation';

import { EditFilled, PictureOutlined, QrcodeOutlined } from '@ant-design/icons';
import ResponsiveImage from '@/shared/components/ui/responsiveImage';
import { formatDate } from '@/shared/utils';
import { EventDTO } from '@/shared/types/dtos';
import { ActionsMenu } from '@/shared/components/ui';

interface EventCardProps {
    event: EventDTO;
    detailed?: boolean;
}

export const EventCard = ({ event, detailed }: EventCardProps) => {
    const router = useRouter();

    const handleShowDetails = () => router.push(`/painel/eventos/${event.id}/detalhes`);

    const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        router.push(`/painel/eventos/${event.id}/acessos`);
    };

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        router.push(`/painel/eventos/${event.id}/editar`);
    };

    const actions = [
        {
            key: 'edit',
            label: 'Editar',
            icon: <EditFilled className="text-soft-gold dark:text-soft-gold-dark scale-150" />,
            onClick: () => router.push(`/painel/eventos/${event.id}/editar`),
        },
        {
            key: 'details',
            label: 'Fotos',
            icon: <PictureOutlined className="text-soft-gold dark:text-soft-gold-dark scale-150" />,
            onClick: () => router.push(`/painel/eventos/${event.id}/detalhes`),
        },
        {
            key: 'share',
            label: 'Acessos',
            icon: <QrcodeOutlined className="text-soft-gold dark:text-soft-gold-dark scale-150" />,
            onClick: () => router.push(`/painel/eventos/${event.id}/acessos`),
        },
    ];

    if (detailed) {
        return (
            <div
                className="bg-gray-200 dark:bg-neutral-800 rounded-xl shadow-lg p-4 flex gap-4 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
                onClick={handleShowDetails}
            >
                <div className="w-18 h-18">
                    <ResponsiveImage
                        src={event.file?.url}
                        alt={`imagem do evento ${event.name}`}
                        width={18}
                        height={18}
                        className="rounded-md"
                    />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between flex-row">
                            <h3 className="font-bold text-neutral-800 dark:text-white text-lg mb-1">
                                {event.name}
                            </h3>
                            <div className="flex flex-row gap-6">
                                <QrcodeOutlined
                                    className="text-soft-gold dark:text-soft-gold-dark scale-150"
                                    onClick={handleShare}
                                />
                                <EditFilled
                                    className="text-soft-gold dark:text-soft-gold-dark scale-150"
                                    onClick={handleEdit}
                                />
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{formatDate(event.startAt)}</p>
                    </div>
                    <div className="flex justify-between items-end">
                        {Boolean(event.totalMemories) && (
                            <div>
                                <span className="text-soft-gold dark:text-soft-gold-dark text-sm">
                                    {event.totalMemories}
                                </span>
                                <span className="dark:text-snow-white text-sm"> fotos</span>
                            </div>
                        )}

                        {/* <div>
                            <span className="text-soft-gold dark:text-soft-gold-dark text-sm">10</span>
                            <span className="dark:text-snow-white text-sm"> dias de armazenamento</span>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="bg-gray-200 dark:bg-neutral-800 rounded-xl shadow-lg p-4 flex gap-4 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300"
            onClick={handleShowDetails}
        >
            <div className="flex flex-row items-center gap-4  w-full">
                <p className="font-bold text-neutral-800 dark:text-white text-lg mb-1">{event.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{formatDate(event.startAt)}</p>
            </div>
            <div className="w-full flex items-end justify-end ">
                <div
                    className="flex flex-row gap-2 justify-center items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {Boolean(event.totalMemories) && (
                        <div className="flex flex-row gap-2">
                            <span className="text-soft-gold dark:text-soft-gold-dark text-sm">
                                {event.totalMemories}
                            </span>
                            <span className="dark:text-snow-white text-sm"> fotos</span>
                        </div>
                    )}
                    <ActionsMenu items={actions} className="text-matte-black dark:text-snow-white" />
                </div>
            </div>
        </div>
    );
};
