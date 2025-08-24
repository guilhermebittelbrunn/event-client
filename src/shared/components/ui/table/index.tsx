import { Table as AntdTable, TableProps as AntdTableProps } from 'antd';

type TableProps = AntdTableProps;

export function Table({ ...props }: TableProps) {
    return <AntdTable {...props} />;
}
