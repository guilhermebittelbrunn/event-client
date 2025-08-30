import { MoreIcon } from '@/shared/icons';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';

type MenuItem = {
    icon: React.ReactNode;
    key: string;
    label: string;
    style?: React.CSSProperties;
    onClick?: () => void;
};

interface ActionsMenuProps {
    onEdit?: () => void;
    onDelete?: () => void;
    items?: MenuItem[];
}

export function ActionsMenu({ onEdit, onDelete, items }: ActionsMenuProps) {
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
                                  style: { margin: 4, fontSize: 16 },
                                  onClick: onEdit,
                              },
                          ]
                        : []),
                    ...(items || []),
                    ...(onDelete
                        ? [
                              {
                                  icon: <DeleteOutlined style={{ scale: 1.25 }} />,
                                  key: 'delete',
                                  label: 'Excluir',
                                  danger: true,
                                  style: { margin: 4, fontSize: 16 },
                                  onClick: onDelete,
                              },
                          ]
                        : []),
                ],
            }}
        >
            <div className="flex items-center justify-center w-full h-full rounded-full p-2 hover:cursor-pointer hover:opacity-40">
                <MoreIcon className="fill-gray-500 dark:fill-gray-400" />
            </div>
        </Dropdown>
    );
}
