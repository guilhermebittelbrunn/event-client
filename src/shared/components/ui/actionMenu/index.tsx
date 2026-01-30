import { MoreIcon } from '@/shared/icons';
import { cn } from '@/shared/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';

export type ActionMenuItem = {
    icon: React.ReactNode;
    key: string;
    label: string;
    style?: React.CSSProperties;
    onClick?: () => void;
};

interface ActionsMenuProps {
    onEdit?: () => void;
    onDelete?: () => void;
    items?: ActionMenuItem[];
    className?: string;
}

export function ActionsMenu({ onEdit, onDelete, items, className }: ActionsMenuProps) {
    return (
        <Dropdown
            trigger={['click']}
            placement="bottomRight"
            menu={{
                items: [
                    ...(onEdit
                        ? [
                              {
                                  icon: <EditOutlined style={{ scale: 1.25 }} />,
                                  key: 'edit',
                                  label: 'Editar',
                                  style: { margin: 4, fontSize: 14 },
                                  onClick: onEdit,
                              },
                          ]
                        : []),
                    ...(items || []).map(item => ({
                        ...item,
                        style: { margin: 4, fontSize: 14, ...item.style },
                    })),
                    ...(onDelete
                        ? [
                              {
                                  icon: <DeleteOutlined style={{ scale: 1.25 }} />,
                                  key: 'delete',
                                  label: 'Excluir',
                                  danger: true,
                                  style: { margin: 4, fontSize: 14 },
                                  onClick: onDelete,
                              },
                          ]
                        : []),
                ],
            }}
        >
            <div
                className={cn(
                    'flex items-center justify-center w-full h-full rounded-full p-2 hover:cursor-pointer hover:opacity-40',
                    className,
                )}
            >
                <MoreIcon className="fill-gray-500 dark:fill-gray-400" />
            </div>
        </Dropdown>
    );
}
