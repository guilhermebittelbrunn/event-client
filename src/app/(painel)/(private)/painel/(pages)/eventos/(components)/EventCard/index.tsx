import { useRouter } from 'next/navigation';
import { Fallback } from '@/shared/components/common/fallback';

import { EditFilled, ShareAltOutlined } from '@ant-design/icons';
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

    const actions = [
        {
            key: 'share',
            label: 'Acessos',
            icon: <ShareAltOutlined className="text-soft-gold dark:text-soft-gold-dark scale-150" />,
            onClick: () => {
                router.push(`/painel/eventos/${event.id}/acessos`);
            },
        },
        {
            key: 'edit',
            label: 'Editar',
            icon: <EditFilled className="text-soft-gold dark:text-soft-gold-dark scale-150" />,
            onClick: () => {
                router.push(`/painel/eventos/${event.id}/editar`);
            },
        },
    ];

    if (detailed) {
        return (
            <div className="bg-gray-200 dark:bg-neutral-800 rounded-xl shadow-lg p-4 flex gap-4 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300">
                <Fallback condition={Boolean(event.file && event.file?.url)}>
                    <ResponsiveImage
                        src={event.file?.url}
                        alt="Event image"
                        width={30}
                        height={30}
                        className="rounded-md"
                    />
                </Fallback>
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between flex-row">
                            <h3 className="font-bold text-neutral-800 dark:text-white text-lg mb-1">
                                {event.name}
                            </h3>
                            <div className="flex flex-row gap-6">
                                <ShareAltOutlined
                                    className="text-soft-gold dark:text-soft-gold-dark scale-150"
                                    onClick={() => {
                                        router.push(`/painel/eventos/${event.id}/acessos`);
                                    }}
                                />
                                <EditFilled
                                    className="text-soft-gold dark:text-soft-gold-dark scale-150"
                                    onClick={() => {
                                        router.push(`/painel/eventos/${event.id}/editar`);
                                    }}
                                />
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{formatDate(event.startAt)}</p>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-soft-gold dark:text-soft-gold-dark text-sm">350</span>
                            <span className="dark:text-snow-white text-sm"> fotos</span>
                        </div>
                        <div>
                            <span className="text-soft-gold dark:text-soft-gold-dark text-sm">10</span>
                            <span className="dark:text-snow-white text-sm"> dias de armazenamento</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-200 dark:bg-neutral-800 rounded-xl shadow-lg p-4 flex gap-4 hover:cursor-pointer hover:opacity-60 transition-opacity duration-300">
            <div className="flex flex-row items-center gap-4  w-full">
                <p className="font-bold text-neutral-800 dark:text-white text-lg mb-1">{event.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{formatDate(event.startAt)}</p>
            </div>
            <div className="w-full flex items-end justify-end ">
                <div>
                    <ActionsMenu items={actions} className="text-matte-black dark:text-snow-white" />
                </div>
            </div>
        </div>
    );
};
