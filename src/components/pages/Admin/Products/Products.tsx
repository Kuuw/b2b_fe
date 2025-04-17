import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../atoms';
import ButtonStyles from '../../../atoms/Button/Button.styles';
import { getProducts, deleteProduct } from '@/services/product.service';
import { Product } from '@/models/product';
import Modal from '@/components/molecules/Modal/Modal';
import ProductForm from './ProductForm';

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const response = await getProducts(1, 100); // Get all products
            setProducts(response.items);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                await loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleFormSubmit = async () => {
        await loadProducts();
        handleModalClose();
    };

    if (isLoading) {
        return <div className="text-center py-8 text-gray-900">Loading...</div>;
    }

    return (
        <div className="text-gray-900">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Products Management</h2>
                <Button
                    label="Add New Product"
                    onClick={() => {
                        setSelectedProduct(null);
                        setIsModalOpen(true);
                    }}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.productId} className="text-gray-900">
                                <td className="px-6 py-4 whitespace-nowrap">{product.productName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.productCode}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.price} {product.currency}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.category.categoryName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.productStock?.quantity || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.status.statusName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Button
                                        label="Edit"
                                        onClick={() => handleEdit(product)}
                                        className="mr-2"
                                    />
                                    <Button
                                        label="Delete"
                                        onClick={() => handleDelete(product.productId)}
                                        variant={ButtonStyles.Red}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={selectedProduct ? "Edit Product" : "Add New Product"}
            >
                <ProductForm
                    product={selectedProduct}
                    onSubmit={handleFormSubmit}
                />
            </Modal>
        </div>
    );
};

export default Products; 