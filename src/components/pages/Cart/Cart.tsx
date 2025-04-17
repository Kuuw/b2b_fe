import React from 'react';
import { useCart } from '../../../contexts/CartContext';
import Card from '../../atoms/Card';
import Title from '../../atoms/Title';
import Button from '../../atoms/Button/Button';
import ButtonStyles from '../../atoms/Button/Button.styles';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
    const navigate = useNavigate();

    if (totalItems === 0) {
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

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Title variant="h2">Shopping Cart</Title>
                
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card padding="medium">
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.product.productId} className="flex items-center space-x-4 p-4 border-b">
                                        <img
                                            src={item.product.productImages[0]?.imageUrl}
                                            alt={item.product.productName}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.product.productName}</h3>
                                            <p className="text-gray-500">{item.product.productCode}</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {item.product.price} {item.product.currency}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.product.productId, parseInt(e.target.value) || 1)}
                                                className="w-20 px-3 py-2 border rounded text-gray-900"
                                            />
                                            <Button
                                                label="Remove"
                                                onClick={() => removeFromCart(item.product.productId)}
                                                variant={ButtonStyles.Red}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    
                    <div>
                        <Card padding="medium">
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>
                                <div className="flex justify-between text-gray-900">
                                    <span>Total Items:</span>
                                    <span>{totalItems}</span>
                                </div>
                                <div className="flex justify-between text-gray-900">
                                    <span>Total Price:</span>
                                    <span className="text-xl font-semibold">
                                        {totalPrice} {items[0]?.product.currency}
                                    </span>
                                </div>
                                <Button
                                    label="Proceed to Checkout"
                                    onClick={() => navigate('/checkout')}
                                    variant={ButtonStyles.Green}
                                    className="w-full"
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 