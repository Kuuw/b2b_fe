import React from 'react';
import { Product } from '../../../models/product';
import Table, { TableColumn } from '../../atoms/Table';
import AddToCartButton from '../../atoms/AddToCartButton/AddToCartButton';
import { ProductTableProps } from './ProductTable.types';
import clsx from 'clsx';

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    onProductClick,
    className,
    isLoading = false
}) => {
    const columns: TableColumn<Product>[] = [
        {
            header: 'Product',
            accessor: (product) => (
                <div className="flex items-center">
                    {product.productImages && product.productImages.length > 0 ? (
                        <div className="flex-shrink-0 h-10 w-10">
                            <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={product.productImages[0].imageUrl} 
                                alt={product.productName} 
                            />
                        </div>
                    ) : (
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No image</span>
                        </div>
                    )}
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                        <div className="text-sm text-gray-500">{product.productCode}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Category',
            accessor: (product) => product.category.categoryName
        },
        {
            header: 'Price',
            accessor: (product) => (
                <div className="text-sm text-gray-900">
                    {product.currency} {product.price.toFixed(2)}
                </div>
            )
        },
        {
            header: 'Stock',
            accessor: (product) => (
                <div className="text-sm text-gray-900">
                    {product.productStock ? product.productStock.quantity : 'N/A'}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (product) => (
                <span className={clsx(
                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                    product.status.statusName === 'Active' 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                )}>
                    {product.status.statusName}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: (product) => (
                <div className="flex items-center space-x-2">
                    <AddToCartButton product={product} />
                </div>
            )
        }
    ];

    return (
        <Table
            data={products}
            columns={columns}
            onRowClick={onProductClick}
            className={className}
            isLoading={isLoading}
            emptyMessage="No products available"
        />
    );
};

export default ProductTable; 