import { cn } from '@/shared/utils';
import { Table as AntdTable, TableProps as AntdTableProps } from 'antd';
import { ColumnType as RcColumnType } from 'antd/lib/table';

export interface TableProps<T> extends Omit<AntdTableProps<T>, 'columns'> {
    columns: any[];
}

export interface ColumnType<T = any, K extends keyof T = keyof T>
    extends Omit<RcColumnType<T>, 'title' | 'dataIndex' | 'key' | 'render'> {
    title: string;
    dataIndex: K;
    key: K;
    render?: (value: T[K], record: T, index: number) => React.ReactNode;
}

export function createColumn<T, K extends keyof T>(
    column: {
        title: string;
        key: K;
        render?: (value: T[K], record: T, index: number) => React.ReactNode;
        condition?: boolean;
    } & Omit<RcColumnType<T>, 'title' | 'dataIndex' | 'key' | 'render'>,
) {
    const { condition = true, ...rest } = column;

    if (!condition) {
        return { hidden: true };
    }

    return {
        ...rest,
        dataIndex: column.key,
    };
}

export function Table<T>({ columns, className, ...props }: TableProps<T>) {
    return <AntdTable className={cn('w-full', className)} columns={columns} {...props} />;
}
