import React from 'react';
import { Product } from '../../models/product';
import Title from '../atoms/Title';
import clsx from 'clsx';

interface ProductInfoProps {
    product: Product;
    className?: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, className }) => {
    return (
        <div className={clsx("space-y-6", className)}>
            <div>
                <Title variant="h2">{product.productName}</Title>
                <p className="text-gray-500 mt-1">Product Code: {product.productCode}</p>
            </div>

            <div>
                <Title variant="h4">Description</Title>
                <p className="text-gray-700 mt-2">
                    {product.description || 'No description available'}
                </p>
            </div>

            <div>
                <Title variant="h4">Category</Title>
                <p className="text-gray-700 mt-2">{product.category.categoryName}</p>
            </div>

            <div>
                <Title variant="h4">Pricing</Title>
                <div className="mt-2">
                    <p className="text-2xl font-semibold text-gray-900">
                        {product.price} {product.currency}
                    </p>
                    <p className="text-gray-500 mt-1">
                        Minimum Order Quantity: {product.minOrderQuantity}
                    </p>
                </div>
            </div>

            <div>
                <Title variant="h4">Status</Title>
                <p className="text-gray-700 mt-2">{product.status.statusName}</p>
            </div>
        </div>
    );
};

export default ProductInfo; 