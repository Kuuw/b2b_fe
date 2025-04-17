import React from 'react';
import { ProductStock } from '../../models/product';
import Title from '../atoms/Title';
import clsx from 'clsx';

interface ProductStockInfoProps {
    stock?: ProductStock;
    className?: string;
}

const ProductStockInfo: React.FC<ProductStockInfoProps> = ({ stock, className }) => {
    return (
        <div className={clsx("space-y-4", className)}>
            <Title variant="h4">Stock Information</Title>
            
            {stock ? (
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Current Stock:</span>
                        <span className="font-semibold">{stock.quantity} units</span>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No stock information available</p>
            )}
        </div>
    );
};

export default ProductStockInfo; 