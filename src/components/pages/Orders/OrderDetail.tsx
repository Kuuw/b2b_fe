import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { selfGetOrderOne } from '../../../services/order.service';
import { Order } from '../../../models/order';
import Card from '../../atoms/Card';
import Title from '../../atoms/Title';
import Button from '../../atoms/Button/Button';
import ButtonStyles from '../../atoms/Button/Button.styles';
import { OrderDetailProps } from './OrderDetail.types';
import clsx from 'clsx';

const OrderDetail: React.FC<OrderDetailProps> = ({ className }) => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            try {
                setIsLoading(true);
                const response = await selfGetOrderOne(orderId);
                setOrder(response);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const handleBackClick = () => {
        navigate('/orders');
    };

    const getTotalAmount = () => {
        if (order) {
            const total = order.orderItems.reduce((sum, item) => {
                return sum + (item.quantity * item.product.price);
            }, 0);
            setTotalAmount(total);
        }
    }

    useEffect(() => {
        getTotalAmount();
    }, [order]);

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
        <div className={clsx("w-full min-h-screen bg-gray-50", className)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                        <p className="text-sm text-gray-500">Status</p>
                                        <p className="font-medium text-black">{order.status.statusName}</p>
                                    </div>
                                </div>
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
                                                <p className="text-gray-500">Unit Price: {item.product.price} {item.product.currency}</p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {item.quantity * item.product.price} {item.product.currency}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div>
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
                                        {totalAmount} {order.orderItems[0]?.product.currency}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
