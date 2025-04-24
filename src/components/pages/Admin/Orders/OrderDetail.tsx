import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, updateOrder } from '@/services/order.service';
import { getStatuses } from '@/services/status.service';
import { Order, OrderUpdate } from '@/models/order';
import { Status } from '@/models/status';
import Card from '@/components/atoms/Card';
import Title from '@/components/atoms/Title';
import Button from '@/components/atoms/Button/Button';
import ButtonStyles from '@/components/atoms/Button/Button.styles';
import clsx from 'clsx';

const OrderDetail: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    useEffect(() => {
        if (orderId) {
            loadStatuses();
            loadOrder();
        }
    }, [orderId]);

    useEffect(() => {
        if (order) {
            setSelectedStatus(order.status.statusId);
        }
    }, [order]);

    const loadStatuses = async () => {
        try {
            const response = await getStatuses();
            setStatuses(response);
        } catch (error) {
            console.error('Error loading statuses:', error);
        }
    };

    const loadOrder = async () => {
        try {
            setIsLoading(true);
            const response = await getOrder(orderId!);
            setOrder(response);
        } catch (error) {
            console.error('Error loading order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async () => {
        if (!order) return;

        try {
            const orderUpdate: OrderUpdate = {
                orderId: order.orderId,
                userId: order.user.userId,
                statusId: selectedStatus,
                shippingAddressId: order.shippingAddressId,
                invoiceAddressId: order.invoiceAddressId,
                orderItems: order.orderItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                }))
            };

            await updateOrder(orderUpdate);
            await loadOrder();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleBackClick = () => {
        navigate('/admin/orders');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Title variant="h2">Order not found</Title>
                <Button
                    label="Back to Orders"
                    onClick={handleBackClick}
                    className="mt-4"
                    variant={ButtonStyles.Blue}
                />
            </div>
        );
    }

    return (
        <div className="text-gray-900">
            <div className="mb-6">
                <Button
                    label="← Back to Orders"
                    onClick={handleBackClick}
                    variant={ButtonStyles.Gray}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <Card padding="medium">
                        <div className="space-y-4">
                            <Title variant="h3">Order Information</Title>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-medium text-black">{order.orderId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Customer</p>
                                    <p className="font-medium text-black">{order.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        {statuses.map((status) => (
                                            <option key={status.statusId} value={status.statusId}>
                                                {status.statusName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <Button
                                label="Update Status"
                                onClick={handleStatusChange}
                                variant={ButtonStyles.Blue}
                            />
                        </div>
                    </Card>

                    <Card padding="medium">
                        <div className="space-y-4">
                            <Title variant="h3">Order Items</Title>
                            {order.orderItems.map((item) => (
                                <div key={item.orderItemId} className="flex items-center justify-between p-4 border-b">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={item.product.productImages[0]?.imageUrl}
                                            alt={item.product.productName}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{item.product.productName}</h4>
                                            <p className="text-gray-500">Quantity: {item.quantity}</p>
                                            <p className="text-gray-500">Unit Price: ${item.unitPrice}</p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        ${(item.quantity * item.unitPrice).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card padding="medium">
                        <div className="space-y-4">
                            <Title variant="h3">Order Summary</Title>
                            <div className="flex justify-between text-gray-900">
                                <span>Total Items:</span>
                                <span>{order.orderItems.length}</span>
                            </div>
                            <div className="flex justify-between text-gray-900">
                                <span>Total Amount:</span>
                                <span className="text-xl font-semibold">
                                    ${order.orderItems.reduce(
                                        (sum, item) => sum + (item.quantity * item.unitPrice),
                                        0
                                    ).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail; 