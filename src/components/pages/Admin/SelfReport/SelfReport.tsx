import React, { useState, useEffect } from 'react';
import { getSelfReport } from '@/services/company.service';
import Card from '@/components/atoms/Card';
import Table, { TableColumn } from '@/components/atoms/Table';
import Title from '@/components/atoms/Title';
import DateRange from '@/components/atoms/DateRange/DateRange';
import * as XLSX from 'xlsx';
import { Button } from '@/components/atoms';

interface UserStats {
    userId: string;
    firstName: string;
    lastName: string;
    totalOrders: number;
    totalSpent: number;
    averageSpent: number;
    lastOrderDate: string | null;
}

interface MonthlyStats {
    month: number;
    year: number;
    average: number;
    orderCount: number;
    totalSpent: number;
}

interface SelfReportResponse {
    report: {
        companyId: string;
        companyName: string;
        userCount: number;
        averageSpent: number;
        totalSpent: number;
        totalOrders: number;
        lastOrderDate: string | null;
        users: UserStats[];
    };
    monthlyStats: MonthlyStats[];
    usersPageNumber: number;
    usersPageSize: number;
    totalPages: number;
    totalUsers: number;
}

const SelfReport: React.FC = () => {
    const [report, setReport] = useState<SelfReportResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const fetchReport = async () => {
        try {
            setIsLoading(true);
            const response = await getSelfReport(1, 10, {
                startDate: startDate?.toJSON() || null,
                endDate: endDate?.toJSON() || null,
                users: []
            });
            setReport(response);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [startDate, endDate]);

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

    const exportToExcel = () => {
        if (!report) return;

        // Prepare company data
        const companyData = [{
            'Company Name': report.report.companyName,
            'User Count': report.report.userCount,
            'Total Orders': report.report.totalOrders,
            'Average Spent': formatCurrency(report.report.averageSpent),
            'Total Spent': formatCurrency(report.report.totalSpent),
            'Last Order': formatDate(report.report.lastOrderDate)
        }];

        // Prepare user data
        const userData = report.report.users.map(user => ({
            'Name': `${user.firstName} ${user.lastName}`,
            'Total Orders': user.totalOrders,
            'Total Spent': formatCurrency(user.totalSpent),
            'Average Spent': formatCurrency(user.averageSpent),
            'Last Order': formatDate(user.lastOrderDate)
        }));

        // Prepare monthly stats data
        const monthlyData = report.monthlyStats.map(stat => ({
            'Month': `${stat.month}/${stat.year}`,
            'Order Count': stat.orderCount,
            'Total Spent': formatCurrency(stat.totalSpent),
            'Average Spent': formatCurrency(stat.average)
        }));

        // Create worksheets
        const companySheet = XLSX.utils.json_to_sheet(companyData);
        const userSheet = XLSX.utils.json_to_sheet(userData);
        const monthlySheet = XLSX.utils.json_to_sheet(monthlyData);

        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, companySheet, 'Company Overview');
        XLSX.utils.book_append_sheet(workbook, userSheet, 'User Statistics');
        XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monthly Statistics');

        // Export the workbook
        XLSX.writeFile(workbook, 'CompanySelfReport.xlsx');
    };

    const userColumns: TableColumn<UserStats>[] = [
        {
            header: 'Name',
            accessor: (user) => `${user.firstName} ${user.lastName}`
        },
        {
            header: 'Total Orders',
            accessor: (user) => user.totalOrders
        },
        {
            header: 'Total Spent',
            accessor: (user) => formatCurrency(user.totalSpent)
        },
        {
            header: 'Average Spent',
            accessor: (user) => formatCurrency(user.averageSpent)
        },
        {
            header: 'Last Order',
            accessor: (user) => formatDate(user.lastOrderDate)
        }
    ];

    const monthlyColumns: TableColumn<MonthlyStats>[] = [
        {
            header: 'Month',
            accessor: (stat) => `${stat.month}/${stat.year}`
        },
        {
            header: 'Order Count',
            accessor: (stat) => stat.orderCount
        },
        {
            header: 'Total Spent',
            accessor: (stat) => formatCurrency(stat.totalSpent)
        },
        {
            header: 'Average Spent',
            accessor: (stat) => formatCurrency(stat.average)
        }
    ];

    if (isLoading && !report) {
        return <div className="text-center py-8 text-gray-900">Loading...</div>;
    }

    return (
        <div className="text-gray-900">
            <div className="flex justify-between items-center mb-6">
                <Title variant="h2">Company Report</Title>
                <Button label="Export to Excel" onClick={exportToExcel} className="mr-2 mt-2" />
            </div>

            <div className="flex flex-col gap-4">
                <Card padding="medium" className="w-full">
                    <div className="flex flex-col gap-4">
                        <div className="w-full md:w-96">
                            <DateRange
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(start, end) => {
                                    setStartDate(start);
                                    setEndDate(end);
                                }}
                                label="Date Range"
                            />
                        </div>
                    </div>
                </Card>

                {report && (
                    <>
                        <Card padding="medium" className="w-full">
                            <h3 className="text-xl font-semibold mb-4">Company Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Orders</div>
                                    <div className="text-2xl font-semibold">{report.report.totalOrders}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Spent</div>
                                    <div className="text-2xl font-semibold">{formatCurrency(report.report.totalSpent)}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-500">Average Spent</div>
                                    <div className="text-2xl font-semibold">{formatCurrency(report.report.averageSpent)}</div>
                                </div>
                            </div>
                        </Card>

                        <Card padding="medium" className="w-full">
                            <h3 className="text-xl font-semibold mb-4">User Statistics</h3>
                            <Table
                                data={report.report.users}
                                columns={userColumns}
                                isLoading={isLoading}
                                emptyMessage="No user data available"
                            />
                        </Card>

                        <Card padding="medium" className="w-full">
                            <h3 className="text-xl font-semibold mb-4">Monthly Statistics</h3>
                            <Table
                                data={report.monthlyStats}
                                columns={monthlyColumns}
                                isLoading={isLoading}
                                emptyMessage="No monthly data available"
                            />
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};

export default SelfReport; 