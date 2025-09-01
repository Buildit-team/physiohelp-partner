import React from 'react';

interface Column<T> {
    header: string;
    key: keyof T | string;
    render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyMessage?: string;
}

export function Table<T>({ data, columns, loading = false, emptyMessage = "No data found" }: TableProps<T>) {
    return (
        <div className="mt-8 flex flex-col">
            <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((column, index) => (
                                        <th
                                            key={index}
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                        >
                                            {column.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="px-3 py-4 text-sm text-gray-500 text-center"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="px-3 py-4 text-sm text-gray-500 text-center"
                                        >
                                            {emptyMessage}
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {columns.map((column, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                                >
                                                    {column.render
                                                        ? column.render(item)
                                                        : String(item[column.key as keyof T] || '')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
