import React, { useState, useEffect } from 'react';
import { getReports } from '@/services/company.service';
import { getUsers } from '@/services/user.service';
import Card from '@/components/atoms/Card';
import Table, { TableColumn } from '@/components/atoms/Table';
import Title from '@/components/atoms/Title';
import SearchableDropdown from '@/components/atoms/SearchableDropdown';
import { FormField } from '@/components/atoms/FormField';
import Pagination from '@/components/atoms/Pagination';
import { User } from '@/models/user';
import * as XLSX from 'xlsx';
import clsx from 'clsx';
import { Button } from '@/components/atoms';

interface ReportPagedResponse {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    items: Report[];
}

interface Report {
    companyId: string;
    companyName: string;
    userCount: number;
    averageSpent: number;
    totalSpent: number;
    totalOrders: number;
    lastOrderDate: string | null;
}

const Reports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [minSpent, setMinSpent] = useState<number | null>(null);
    const [maxSpent, setMaxSpent] = useState<number | null>(null);
    const [minOrder, setMinOrder] = useState<number | null>(null);
    const [maxOrder, setMaxOrder] = useState<number | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [userSearchQuery, setUserSearchQuery] = useState('');

        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

        // Export the workbook as an Excel file
        XLSX.writeFile(workbook, 'CompanyReports.xlsx');
    };

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const response = await getReports(currentPage, pageSize, {
                search: '',
                users: selectedUsers,
                startDate: startDate?.toJSON() || null,
                endDate: endDate?.toJSON() || null,
                minSpent,
                maxSpent,
                minOrder,
                maxOrder
            });
            if (response && 'items' in response) {
                setReports(response.items);
                const calculatedTotalPages = Math.ceil(response.total / pageSize);
                setTotalPages(response.totalPages || calculatedTotalPages);
            } else {
                console.log('Invalid response format');
                setReports([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            setReports([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async (query: string = '') => {
        try {
            const response = await getUsers(1, 100);
            setUsers(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };

    useEffect(() => {
        console.log('Reports request:', {
            currentPage,
            pageSize,
            filter: {
                users: selectedUsers,
                startDate: startDate?.toJSON() || null,
                endDate: endDate?.toJSON() || null
            }
        });
        fetchReports();
    }, [currentPage, selectedUsers, startDate, endDate, minSpent, maxSpent, minOrder, maxOrder]);

    useEffect(() => {
        fetchUsers(userSearchQuery);
    }, [userSearchQuery]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No orders';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleUserSearch = (query: string) => {
        setUserSearchQuery(query);
    };

    const handleUserChange = (values: string[]) => {
        setSelectedUsers(values);
        setCurrentPage(1);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            setStartDate(value ? new Date(new Date(value).setHours(23, 59, 59)) : null);
        } else {
            setEndDate(value ? new Date(value) : null);
        }
        setCurrentPage(1);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = value === '' ? null : Number(value);

        switch (name) {
            case 'minSpent':
                setMinSpent(numValue);
                break;
            case 'maxSpent':
                setMaxSpent(numValue);
                break;
            case 'minOrder':
                setMinOrder(numValue);
                break;
            case 'maxOrder':
                setMaxOrder(numValue);
                break;
        }
        setCurrentPage(1);
    };

    const columns: TableColumn<Report>[] = [
        {
            header: 'Company Name',
            accessor: (report) => report.companyName
        },
        {
            header: 'User Count',
            accessor: (report) => report.userCount
        },
        {
            header: 'Total Orders',
            accessor: (report) => report.totalOrders
        },
        {
            header: 'Average Spent',
            accessor: (report) => formatCurrency(report.averageSpent)
        },
        {
            header: 'Total Spent',
            accessor: (report) => formatCurrency(report.totalSpent)
        },
        {
            header: 'Last Order',
            accessor: (report) => formatDate(report.lastOrderDate)
        }
    ];

    const userOptions = users.map(user => ({
        value: user.userId,
        label: `${user.firstName} ${user.lastName} (${user.email})`
    }));

    return (
        <div className="text-gray-900">
            <div className="flex justify-between items-center mb-6">
                <Title variant="h2">Company Reports</Title>
            </div>
            <Card padding="medium">
                <div className="flex flex-wrap gap-4 mb-6">
                    <SearchableDropdown
                        options={userOptions}
                        value={selectedUsers}
                        onChange={handleUserChange}
                        onSearch={handleUserSearch}
                        placeholder="Filter by users..."
                        className="w-md"
                    />
                    <div className="flex items-center gap-2">
                        <text className="text-gray-500 text-sm">Date Range:</text>
                        <FormField
                            type="date"
                            name="startDate"
                            value={startDate ? `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}` : ''}
                            onChange={handleDateChange}
                            placeholder="Start date"
                            className="w-min"
                        />
                        <text className="text-gray-500 text-sm">to</text>
                        <FormField
                            type="date"
                            name="endDate"
                            value={endDate ? `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}` : ''}
                            onChange={handleDateChange}
                            placeholder="End date"
                            className="w-min"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <text className="text-gray-500 text-sm">Spent Range:</text>
                        <FormField
                            type="text"
                            name="minSpent"
                            value={minSpent || ''}
                            onChange={handleNumberChange}
                            placeholder="Min spent"
                            className="w-32"
                        />
                        <text className="text-gray-500 text-sm">to</text>
                        <FormField
                            type="text"
                            name="maxSpent"
                            value={maxSpent || ''}
                            onChange={handleNumberChange}
                            placeholder="Max spent"
                            className="w-32"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <text className="text-gray-500 text-sm">Order Range:</text>
                        <FormField
                            type="text"
                            name="minOrder"
                            value={minOrder || ''}
                            onChange={handleNumberChange}
                            placeholder="Min orders"
                            className="w-32"
                        />
                        <text className="text-gray-500 text-sm">to</text>
                        <FormField
                            type="text"
                            name="maxOrder"
                            value={maxOrder || ''}
                            onChange={handleNumberChange}
                            placeholder="Max orders"
                            className="w-32"
                        />
                    </div>
                </div>

                <Table
                    data={reports}
                    columns={columns}
                    isLoading={isLoading}
                    emptyMessage="No reports found"
                />

                {totalPages > 0 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </Card>
        </div >
    );
};

export default Reports; 