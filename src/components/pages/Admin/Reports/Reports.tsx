import React, { useState, useEffect } from 'react';
import { getReports } from '@/services/company.service';
import Card from '@/components/atoms/Card';
import Table, { TableColumn } from '@/components/atoms/Table';
import Title from '@/components/atoms/Title';

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
    const [pageSize] = useState(10);

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const response = await getReports(currentPage, pageSize);
            setReports(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setReports([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [currentPage]);

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

    return (
        <div className="text-gray-900">
            <div className="flex justify-between items-center mb-6">
                <Title variant="h2">Company Reports</Title>
            </div>

            <Card padding="medium">
                <Table
                    data={reports}
                    columns={columns}
                    isLoading={isLoading}
                    emptyMessage="No reports found"
                />
            </Card>
        </div>
    );
};

export default Reports; 