import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { selfGetOrder } from '../../../services';
import { Order } from '../../../models/order';
import Card from '../../atoms/Card';
import Title from '../../atoms/Title';
import Table, { TableColumn } from '../../atoms/Table';
import clsx from 'clsx';

interface OrdersProps {
    className?: string;
}

const Orders: React.FC<OrdersProps> = ({ className }) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await selfGetOrder();
                setOrders(response);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleOrderClick = (order: Order) => {
        navigate(`/orders/${order.orderId}`);
    };

    const columns: TableColumn<Order>[] = [
        {
            header: 'Order ID',
            accessor: (order) => order.orderId,
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
                    (sum, item) => sum + (item.quantity * item.unitPrice),
                    0
                );
                return `$${total.toFixed(2)}`;
            },
        },
    ];

    return (
        <div className={clsx("container mx-auto px-4 py-8 bg-gray-50", className)}>
            <div className="mb-6">
                <Title variant="h2">Orders</Title>
            </div>

            <Card padding="medium">
                <Table
                    data={orders}
                    columns={columns}
                    isLoading={isLoading}
                    onRowClick={handleOrderClick}
                />
            </Card>
        </div>
    );
};

export default Orders; 