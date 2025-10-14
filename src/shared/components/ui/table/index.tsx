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
    sort?: boolean;
}

export function createColumn<T, K extends keyof T>(
    column: {
        title: string;
        key: K;
        render?: (value: T[K], record: T, index: number) => React.ReactNode;
        condition?: boolean;
        sort?: boolean;
    } & Omit<RcColumnType<T>, 'title' | 'dataIndex' | 'key' | 'render'>,
) {
    const { condition = true, sort = false, ...rest } = column;

    if (!condition) {
        return { hidden: true };
    }

    const result: any = {
        ...rest,
        dataIndex: column.key,
    };

    if (sort) {
        result.sorter = true;
        result.sortDirections = ['ascend', 'descend'];
    }

    return result;
}

export function Table<T>({ columns, className, onChange, ...props }: TableProps<T>) {
    return <AntdTable className={cn('w-full', className)} columns={columns} {...props} onChange={onChange} />;
}
