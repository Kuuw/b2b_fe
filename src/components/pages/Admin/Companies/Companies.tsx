import React, { useState, useEffect } from 'react';
import { getCompanies, deleteCompany } from '../../../../services/company.service';
import { Company } from '../../../../models/company';
import Table, { TableColumn } from '../../../atoms/Table';
import Card from '../../../atoms/Card';
import Title from '../../../atoms/Title';
import Button from '../../../atoms/Button';
import ButtonStyles from '../../../atoms/Button/Button.styles';
import Modal from '../../../molecules/Modal/Modal';
import CompanyForm from './CompanyForm';
import clsx from 'clsx';

const Companies: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const pageSize = 10;

    const fetchCompanies = async () => {
        try {
            setIsLoading(true);
            const response = await getCompanies(currentPage, pageSize);
            setCompanies(Array.isArray(response) ? response : []);
            setTotalPages(1);
        } catch (error) {
            console.error('Error fetching companies:', error);
            setCompanies([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [currentPage]);

    const handleEdit = (company: Company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleDelete = async (companyId: string) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await deleteCompany(companyId);
                await fetchCompanies();
            } catch (error) {
                console.error('Error deleting company:', error);
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCompany(null);
    };

    const handleFormSubmit = async () => {
        await fetchCompanies();
        handleModalClose();
    };

    const columns: TableColumn<Company>[] = [
        {
            header: 'Company Name',
            accessor: (company: Company) => (
                <div className="flex items-center">
                    {company.logoUrl ? (
                        <img
                            className="h-10 w-10 rounded-full"
                            src={company.logoUrl}
                            alt={company.companyName}
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">
                                {company.companyName[0]}
                            </span>
                        </div>
                    )}
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {company.companyName}
                        </div>
                        <div className="text-sm text-gray-500">{company.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Tax Number',
            accessor: (company: Company) => company.taxNumber
        },
        {
            header: 'Address',
            accessor: (company: Company) => (
                <div className="text-sm">
                    <div>{company.address.streetAddress}</div>
                    <div>{company.address.city}, {company.address.state} {company.address.postalCode}</div>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (company: Company) => (
                <span className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    {
                        'bg-green-100 text-green-800': company.status.statusName === 'Active',
                        'bg-red-100 text-red-800': company.status.statusName === 'Inactive',
                    }
                )}>
                    {company.status.statusName}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: (company: Company) => (
                <div className="flex space-x-2">
                    <Button
                        label="Edit"
                        onClick={() => handleEdit(company)}
                        className="mr-2"
                    />
                    <Button
                        label="Delete"
                        onClick={() => handleDelete(company.companyId)}
                        variant={ButtonStyles.Red}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="text-gray-900">
            <div className="flex justify-between items-center mb-6">
                <Title variant="h2">Companies Management</Title>
                <Button
                    label="Add New Company"
                    onClick={() => {
                        setSelectedCompany(null);
                        setIsModalOpen(true);
                    }}
                />
            </div>

            <Card padding="medium">
                <Table
                    data={companies}
                    columns={columns}
                    isLoading={isLoading}
                    emptyMessage="No companies found"
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={selectedCompany ? "Edit Company" : "Add New Company"}
            >
                <CompanyForm
                    company={selectedCompany}
                    onSubmit={handleFormSubmit}
                />
            </Modal>
        </div>
    );
};

export default Companies; 