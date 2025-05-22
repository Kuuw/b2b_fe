import React, { useState, useEffect } from 'react';
import { getReports } from '@/services/company.service';
import { getUsers } from '@/services/user.service';
import Card from '@/components/atoms/Card';
import Table, { TableColumn } from '@/components/atoms/Table';
import Title from '@/components/atoms/Title';
import SearchableDropdown from '@/components/atoms/SearchableDropdown';
import { FormField } from '@/components/atoms/FormField';
import Pagination from '@/components/atoms/Pagination';
import RangeSlider from '@/components/atoms/RangeSlider/RangeSlider';
import DateRange from '@/components/atoms/DateRange/DateRange';
import { User } from '@/models/user';
import * as XLSX from 'xlsx';
import clsx from 'clsx';
import { Button } from '@/components/atoms';

interface ReportPagedResponse {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    items: Report[];
    maxSpent: number;
    maxOrder: number;
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
    const [spentRange, setSpentRange] = useState<[number, number]>([0, 0]);
    const [orderRange, setOrderRange] = useState<[number, number]>([0, 0]);
    const [maxSpentValue, setMaxSpentValue] = useState(0);
    const [maxOrderValue, setMaxOrderValue] = useState(0);

    const exportToExcel = () => {
        // Prepare the data for export
        const data = reports.map(report => ({
            'Company Name': report.companyName,
            'User Count': report.userCount,
            'Total Orders': report.totalOrders,
            'Average Spent': report.averageSpent,
            'Total Spent': report.totalSpent,
            'Last Order': report.lastOrderDate ? new Date(report.lastOrderDate).toLocaleDateString('en-US') : 'No orders'
        }));

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
                if (maxSpentValue === 0) {
                    setMaxSpentValue(response.maxSpent || 0);
                    setSpentRange([0, response.maxSpent || 0]);
                }
                if (maxOrderValue === 0) {
                    setMaxOrderValue(response.maxOrderCount || 0);
                    setOrderRange([0, response.maxOrderCount || 0]);
                }
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

    const handleSpentRangeChange = (value: [number, number]) => {
        setSpentRange(value);
        setMinSpent(value[0]);
        setMaxSpent(value[1]);
        setCurrentPage(1);
    };

    const handleOrderRangeChange = (value: [number, number]) => {
        setOrderRange(value);
        setMinOrder(value[0]);
        setMaxOrder(value[1]);
        setCurrentPage(1);
    };

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

    const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
        setStartDate(startDate);
        setEndDate(endDate);
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
                <Button label='Export to Excel' onClick={exportToExcel} className='mr-2 mt-2' />
            </div>

            <div className="flex flex-col gap-4">
                <Card padding="medium" className='w-full'>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-4">
                            <SearchableDropdown
                                options={userOptions}
                                value={selectedUsers}
                                onChange={handleUserChange}
                                onSearch={handleUserSearch}
                                placeholder="Filter by users..."
                                className="w-full md:w-64 mr-3"
                            />
                            <div className="w-full md:w-96 mr-3">
                                <DateRange
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={handleDateRangeChange}
                                    label="Date Range"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="w-full md:w-96 mr-3">
                                <RangeSlider
                                    label="Spent Range"
                                    min={0}
                                    max={maxSpentValue}
                                    value={spentRange}
                                    onChange={handleSpentRangeChange}
                                    formatValue={formatCurrency}
                                />
                            </div>
                            <div className="w-full md:w-96">
                                <RangeSlider
                                    label="Order Range"
                                    min={0}
                                    max={maxOrderValue}
                                    value={orderRange}
                                    onChange={handleOrderRangeChange}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card padding="medium">
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
            </div>
        </div>
    );
};

export default Reports; 