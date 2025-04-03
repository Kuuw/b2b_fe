import { ReactNode } from 'react';

export interface TableColumn<T> {
    header: string;
    accessor: keyof T | ((item: T) => ReactNode);
    className?: string;
}

export interface TableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    className?: string;
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
} 