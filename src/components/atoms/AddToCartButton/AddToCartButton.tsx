import React, { useState } from 'react';
import { Product } from '../../../models/product';
import Button from '../Button/Button';
import ButtonStyles from '../Button/Button.styles';
import { useCart } from '../../../contexts/CartContext';

interface AddToCartButtonProps {
    product: Product;
    className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, className }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling up
        addToCart(product, quantity);
    };

    return (
        <div className={className} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-4">
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 border rounded text-gray-900"
                    onClick={(e) => e.stopPropagation()}
                />
                <Button
                    label="Add to Cart"
                    onClick={handleAddToCart}
                    variant={ButtonStyles.Blue}
                />
            </div>
        </div>
    );
};

export default AddToCartButton; 