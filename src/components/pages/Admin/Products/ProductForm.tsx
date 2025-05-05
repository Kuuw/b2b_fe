import React, { useEffect, useState } from 'react';
import { Button } from '../../../atoms';
import { Product, ProductCreate, ProductUpdate } from '../../../../models/product';
import { createProduct, updateProduct } from '../../../../services/product.service';
import { getCategories } from '../../../../services/category.service';
import { Category } from '../../../../models/category';
import { Status } from '../../../../models/status';
import { getStatuses } from '@/services';

interface ProductFormProps {
    product: Product | null;
    onSubmit: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
    const [productName, setProductName] = useState('');
    const [productCode, setProductCode] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [minOrderQuantity, setMinOrderQuantity] = useState('1');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statusId, setStatusId] = useState('');
    const [status, setStatus] = useState<Status[]>([]);

    useEffect(() => {
        loadCategories();
        loadStatuses();
        if (product) {
            setProductName(product.productName);
            setProductCode(product.productCode);
            setDescription(product.description || '');
            setPrice(product.price.toString());
            setMinOrderQuantity(product.minOrderQuantity.toString());
            setCategoryId(product.category.categoryId);
        }
    }, [product]);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadStatuses = async () => {
        try {
            const data = await getStatuses();
            setStatus(data);
        } catch (error) {
            console.error('Error loading statuses:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (product) {
                const updatedProduct: ProductUpdate = {
                    productId: product.productId,
                    productName,
                    productCode,
                    description,
                    price: parseFloat(price),
                    minOrderQuantity: parseInt(minOrderQuantity),
                    categoryId,
                    currency: 'USD',
                    statusId: statusId,
                };
                await updateProduct(updatedProduct);
            } else {
                const newProduct: ProductCreate = {
                    productName,
                    productCode,
                    description,
                    price: parseFloat(price),
                    minOrderQuantity: parseInt(minOrderQuantity),
                    categoryId,
                    currency: 'USD',
                    statusId,
                };
                await createProduct(newProduct);
            }
            onSubmit();
        } catch (error) {
            console.error('Error saving product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Product Code</label>
                <input
                    type="text"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Order Quantity</label>
                <input
                    type="number"
                    min="1"
                    value={minOrderQuantity}
                    onChange={(e) => setMinOrderQuantity(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                    value={statusId}
                    onChange={(e) => setStatusId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                >
                    <option value="">Select a status</option>
                    {status.map((status) => (
                        <option key={status.statusId} value={status.statusId}>
                            {status.statusName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end space-x-4">
                <Button
                    label={isLoading ? "Saving..." : (product ? "Update" : "Create")}
                    disabled={isLoading}
                    onClick={() => handleSubmit({ preventDefault: () => { } } as React.FormEvent)}
                />
            </div>
        </form>
    );
};

export default ProductForm; 