import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../atoms';
import ButtonStyles from '../../../atoms/Button/Button.styles';
import { getProducts, deleteProduct, filter } from '@/services/product.service';
import { Product } from '@/models/product';
import Modal from '@/components/molecules/Modal/Modal';
import ProductForm from './ProductForm';
import { set } from 'lodash';
import Pagination from '@/components/atoms/Pagination';
import { getCategories } from '@/services';


const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState<filter>({});
    const navigate = useNavigate();
    const [debouncedFilter, setDebouncedFilter] = useState<filter>({});

    // Debounce filter changes
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilter(filter);
        }, 500); // 500ms debounce

        return () => clearTimeout(handler);
    }, [filter]);

    useEffect(() => {
        loadProducts();
    }, [debouncedFilter, page]);

    const loadCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [debouncedFilter, page]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFilter((prev: any) => ({
            ...prev,
            categoryId: value === '' ? undefined : value,
        }));
        setPage(1);
    }

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const response = await getProducts(page, pageSize, filter);
            setProducts(response.items);
            setTotalPages(response.totalPages);
            setPageSize(response.pageSize);
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

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilter((prev: any) => ({
            ...prev,
            [name]: value === '' ? undefined : name.includes('Price') ? Number(value) : value,
        }));
        setPage(1);
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

            <div className="mb-4 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-xs mb-1">Product Name</label>
                    <input
                        type="text"
                        name="productName"
                        value={filter.productName || ''}
                        onChange={handleFilterChange}
                        className="border px-2 py-1 rounded"
                        placeholder="Product Name"
                    />
                </div>
                <div>
                    <label className="block text-xs mb-1">Category</label>
                    <select
                        name="categoryId"
                        value={filter.categoryId || ''}
                        onChange={handleCategoryChange}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category: any) => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs mb-1">Min Price</label>
                    <input
                        type="number"
                        name="minPrice"
                        value={filter.minPrice ?? ''}
                        onChange={handleFilterChange}
                        className="border px-2 py-1 rounded"
                        placeholder="Min"
                        min={0}
                    />
                </div>
                <div>
                    <label className="block text-xs mb-1">Max Price</label>
                    <input
                        type="number"
                        name="maxPrice"
                        value={filter.maxPrice ?? ''}
                        onChange={handleFilterChange}
                        className="border px-2 py-1 rounded"
                        placeholder="Max"
                        min={0}
                    />
                </div>
                <Button
                    label="Clear"
                    onClick={() => setFilter({})}
                    className="ml-2"
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
                {totalPages > 0 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
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