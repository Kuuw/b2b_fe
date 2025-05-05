import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdersAdmin } from '@/services/order.service';
import { getStatuses } from '@/services/status.service';
import { Order } from '@/models/order';
import { Status } from '@/models/status';
import Card from '@/components/atoms/Card';
import Table, { TableColumn } from '@/components/atoms/Table';
import Button from '@/components/atoms/Button/Button';
import ButtonStyles from '@/components/atoms/Button/Button.styles';
import clsx from 'clsx';

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    useEffect(() => {
        loadStatuses();
    }, []);

    useEffect(() => {
        loadOrders();
    }, [currentPage, selectedStatus]);

    const loadStatuses = async () => {
        try {
            const response = await getStatuses();
            setStatuses(response);
        } catch (error) {
            console.error('Error loading statuses:', error);
        }
    };

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const response = await getOrdersAdmin(currentPage, pageSize, selectedStatus);
            if (Array.isArray(response)) {
                setOrders(response);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOrderClick = (order: Order) => {
        navigate(`/admin/orders/${order.orderId}`);
    };

    const columns: TableColumn<Order>[] = [
        {
            header: 'Order ID',
            accessor: (order) => order.orderId,
        },
        {
            header: 'Customer',
            accessor: (order) => order.user.email,
        },
        {
            header: 'Status',
            accessor: (order) => (
                <span className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    {
                        'bg-green-100 text-green-800': order.status.statusName === 'Completed',
                        'bg-yellow-100 text-yellow-800': order.status.statusName === 'Pending',
                        'bg-blue-100 text-blue-800': order.status.statusName === 'Processing',
                        'bg-red-100 text-red-800': order.status.statusName === 'Cancelled',
                    }
                )}>
                    {order.status.statusName}
                </span>
            ),
        },
        {
            header: 'Items',
            accessor: (order) => order.orderItems.length,
        },
        {
            header: 'Total Amount',
            accessor: (order) => {
                const total = order.orderItems.reduce(
                    (sum, item) => sum + (item.quantity * (item.product?.price || 0)),
                    0
                );
                return `$${total.toFixed(2)}`;
            },
        },
        {
            header: 'Actions',
            accessor: (order) => (
                <Button
                    label="View Details"
                    onClick={() => handleOrderClick(order)}
                    variant={ButtonStyles.Blue}
                />
            ),
        },
    ];

    return (
        <div className="text-gray-900">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Orders Management</h2>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value={undefined}>All Statuses</option>
                        {statuses.map((status) => (
                            <option key={status.statusId} value={status.statusId}>
                                {status.statusName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <Card padding="medium">
                <Table
                    data={orders}
                    columns={columns}
                    isLoading={isLoading}
                    onRowClick={handleOrderClick}
                />
                {!isLoading && orders.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                        No orders found
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Orders; 