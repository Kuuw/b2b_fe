import React from 'react';
import { TableProps } from './Table.types';
import clsx from 'clsx';

function Table<T>({ 
    data, 
    columns, 
    className,
    onRowClick,
    isLoading = false,
    emptyMessage = 'No data available'
}: TableProps<T>) {
    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={clsx("overflow-x-auto", className)}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className={clsx(
                                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                                    column.className
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, rowIndex) => (
                        <tr 
                            key={rowIndex}
                            onClick={() => onRowClick && onRowClick(item)}
                            className={clsx(
                                onRowClick && "cursor-pointer hover:bg-gray-50"
                            )}
                        >
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={clsx(
                                        "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                                        column.className
                                    )}
                                >
                                    {typeof column.accessor === 'function'
                                        ? column.accessor(item)
                                        : String(item[column.accessor])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table; 