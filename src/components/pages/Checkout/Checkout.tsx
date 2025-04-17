import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { selfCreateOrder } from '../../../services';
import { OrderCreate, OrderItemCreate } from '../../../models/order';
import Card from '../../atoms/Card';
import Title from '../../atoms/Title';
import Button from '../../atoms/Button/Button';
import ButtonStyles from '../../atoms/Button/Button.styles';
import { useAuth } from '../../../contexts/AuthContext';
import { getSelfAddresses } from '../../../services/address.service';
import { Address } from '../../../models/common';
import { User } from '../../../contexts/AuthContext';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string>('');
    const [selectedInvoiceAddressId, setSelectedInvoiceAddressId] = useState<string>('');

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await getSelfAddresses();
                setAddresses(response);
                
                // Set default addresses if available
                if (response.length > 0) {
                    const defaultShippingAddress = response.find((addr: Address) => addr.isDefault);
                    const defaultInvoiceAddress = response.find((addr: Address) => addr.isDefault);
                    
                    if (defaultShippingAddress) {
                        setSelectedShippingAddressId(defaultShippingAddress.addressId);
                    }
                    if (defaultInvoiceAddress) {
                        setSelectedInvoiceAddressId(defaultInvoiceAddress.addressId);
                    }
                }
            } catch (err) {
                console.error('Error fetching addresses:', err);
                setError('Failed to load addresses');
            }
        };
        fetchAddresses();
    }, []);

    const handleCreateOrder = async () => {
        if (!user) {
            setError('You must be logged in to create an order');
            return;
        }

        if (!selectedShippingAddressId || !selectedInvoiceAddressId) {
            setError('Please select both shipping and invoice addresses');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const orderItems: OrderItemCreate[] = items.map(item => ({
                productId: item.product.productId,
                quantity: item.quantity,
                unitPrice: item.product.price
            }));

            const orderData: OrderCreate = {
                shippingAddressId: selectedShippingAddressId,
                invoiceAddressId: selectedInvoiceAddressId,
                orderItems
            };

            await selfCreateOrder(orderData);
            clearCart();
            navigate('/orders');
        } catch (err) {
            setError('Failed to create order. Please try again.');
            console.error('Error creating order:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Title variant="h2">Your cart is empty</Title>
                <Button
                    label="Continue Shopping"
                    onClick={() => navigate('/products')}
                    className="mt-4"
                    variant={ButtonStyles.Blue}
                />
            </div>
        );
    }

    const formatAddress = (address: Address) => {
        return `${address.streetAddress}, ${address.city}, ${address.state} ${address.postalCode}`;
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Title variant="h2">Checkout</Title>
                
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card padding="medium">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900">Shipping Address</h3>
                                <select
                                    value={selectedShippingAddressId}
                                    onChange={(e) => setSelectedShippingAddressId(e.target.value)}
                                    className="w-full px-3 py-2 border rounded text-gray-900"
                                >
                                    <option value="">Select shipping address</option>
                                    {addresses.map((address) => (
                                        <option key={address.addressId} value={address.addressId}>
                                            {formatAddress(address)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Card>

                        <Card padding="medium">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900">Invoice Address</h3>
                                <select
                                    value={selectedInvoiceAddressId}
                                    onChange={(e) => setSelectedInvoiceAddressId(e.target.value)}
                                    className="w-full px-3 py-2 border rounded text-gray-900"
                                >
                                    <option value="">Select invoice address</option>
                                    {addresses.map((address) => (
                                        <option key={address.addressId} value={address.addressId}>
                                            {formatAddress(address)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Card>

                        <Card padding="medium">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>
                                {items.map((item) => (
                                    <div key={item.product.productId} className="flex items-center justify-between p-4 border-b">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={item.product.productImages[0]?.imageUrl}
                                                alt={item.product.productName}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{item.product.productName}</h4>
                                                <p className="text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {item.product.price * item.quantity} {item.product.currency}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    
                    <div>
                        <Card padding="medium">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900">Order Total</h3>
                                <div className="flex justify-between text-gray-900">
                                    <span>Total Items:</span>
                                    <span>{items.length}</span>
                                </div>
                                <div className="flex justify-between text-gray-900">
                                    <span>Total Price:</span>
                                    <span className="text-xl font-semibold">
                                        {totalPrice} {items[0]?.product.currency}
                                    </span>
                                </div>
                                {error && (
                                    <div className="text-red-500 text-sm">{error}</div>
                                )}
                                <Button
                                    label={isLoading ? "Creating Order..." : "Place Order"}
                                    onClick={handleCreateOrder}
                                    variant={ButtonStyles.Green}
                                    className="w-full"
                                    disabled={isLoading}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 