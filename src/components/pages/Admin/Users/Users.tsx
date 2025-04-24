import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../../../services/user.service';
import { User } from '../../../../models/user';
import Table, { TableColumn } from '../../../atoms/Table';
import Card from '../../../atoms/Card';
import Title from '../../../atoms/Title';
import Button from '../../../atoms/Button';
import ButtonStyles from '../../../atoms/Button/Button.styles';
import Modal from '../../../molecules/Modal/Modal';
import UserForm from './UserForm';
import clsx from 'clsx';

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const pageSize = 10;

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await getUsers(currentPage, pageSize);
            setUsers(Array.isArray(response) ? response : []);
            setTotalPages(1);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                deleteUser(userId);
                console.log('Delete user:', userId);
                await fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleFormSubmit = async () => {
        await fetchUsers();
        handleModalClose();
    };

    const columns: TableColumn<User>[] = [
        {
            header: 'Name',
            accessor: (user: User) => (
                <div className="flex items-center">
                    {user.profileImageUrl ? (
                        <img
                            className="h-10 w-10 rounded-full"
                            src={user.profileImageUrl}
                            alt={`${user.firstName} ${user.lastName}`}
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">
                                {user.firstName[0]}{user.lastName[0]}
                            </span>
                        </div>
                    )}
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Company',
            accessor: (user: User) => user.company.companyName
        },
        {
            header: 'Role',
            accessor: (user: User) => user.role.roleName
        },
        {
            header: 'Status',
            accessor: (user: User) => (
                <span className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    {
                        'bg-green-100 text-green-800': user.status.statusName === 'Active',
                        'bg-red-100 text-red-800': user.status.statusName === 'Inactive',
                    }
                )}>
                    {user.status.statusName}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: (user: User) => (
                <div className="flex space-x-2">
                    <Button
                        label="Edit"
                        onClick={() => handleEdit(user)}
                        className="mr-2"
                    />
                    <Button
                        label="Delete"
                        onClick={() => handleDelete(user.userId)}
                        variant={ButtonStyles.Red}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="text-gray-900">
            <div className="flex justify-between items-center mb-6">
                <Title variant="h2">Users Management</Title>
                <Button
                    label="Add New User"
                    onClick={() => {
                        setSelectedUser(null);
                        setIsModalOpen(true);
                    }}
                />
            </div>

            <Card padding="medium">
                <Table
                    data={users}
                    columns={columns}
                    isLoading={isLoading}
                    emptyMessage="No users found"
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={selectedUser ? "Edit User" : "Add New User"}
            >
                <UserForm
                    user={selectedUser}
                    onSubmit={handleFormSubmit}
                />
            </Modal>
        </div>
    );
};

export default Users;
