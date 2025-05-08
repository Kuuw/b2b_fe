import React, { useState, useEffect } from 'react';
import { getReports } from '@/services/company.service';
import Card from '@/components/atoms/Card';
import Table, { TableColumn } from '@/components/atoms/Table';
import Title from '@/components/atoms/Title';
import Button from '@/components/atoms/Button';
import ButtonStyles from '@/components/atoms/Button/Button.styles';

interface Report {
    companyId: string;
    companyName: string;
    userCount: number;
    averageSpent: number;
    totalSpent: number;
    totalOrders: number;
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
            header: 'Average Spent',
            accessor: (report) => `${report.averageSpent.toFixed(2)}`
        },
        {
            header: 'Total Orders',
            accessor: (report) => report.totalOrders
        },
        {
            header: 'Total Spent',
            accessor: (report) => `$${report.totalSpent.toFixed(2)}`
        },
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