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
import RangeSlider from '@/components/atoms/RangeSlider/RangeSlider';
import DateRange from '@/components/atoms/DateRange/DateRange';
import { getCategories } from '@/services';
import Card from '@/components/atoms/Card';
import { FormField } from '@/components/atoms/FormField';

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isTableLoading, setIsTableLoading] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState<filter>({});
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [stockRange, setStockRange] = useState<[number, number]>([0, 1000]);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [maxStock, setMaxStock] = useState(1000);
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

    const loadProducts = async () => {
        try {
            setIsTableLoading(true);
            const response = await getProducts(page, pageSize, filter);
            setProducts(response.items);
            setTotalPages(response.totalPages);
            setPageSize(response.pageSize);

            // Only set max values and ranges if they haven't been set yet
            if (maxPrice === 1000) {
                setMaxPrice(response.maxPrice);
                setPriceRange([0, response.maxPrice]);
            }
            if (maxStock === 1000) {
                setMaxStock(response.maxStock);
                setStockRange([0, response.maxStock]);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsTableLoading(false);
            setIsInitialLoading(false);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFilter((prev: any) => ({
            ...prev,
            categoryId: value === '' ? undefined : value,
        }));
        setPage(1);
    }

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

    const handlePriceRangeChange = (value: [number, number]) => {
        setPriceRange(value);
        setFilter((prev: any) => ({
            ...prev,
            minPrice: value[0],
            maxPrice: value[1]
        }));
        setPage(1);
    };

    const handleStockRangeChange = (value: [number, number]) => {
        setStockRange(value);
        setFilter((prev: any) => ({
            ...prev,
            minStock: value[0],
            maxStock: value[1]
        }));
        setPage(1);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    if (isInitialLoading) {
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

            <div className="flex flex-col gap-4">
                <Card padding="medium" className="w-full">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="w-full md:w-64">
                                <FormField
                                    type="text"
                                    name="productName"
                                    value={filter.productName || ''}
                                    onChange={handleFilterChange}
                                    placeholder="Product Name"
                                    label="Product Name"
                                />
                            </div>
                            <div className="w-full md:w-64">
                                <FormField
                                    type="select"
                                    name="categoryId"
                                    value={filter.categoryId || ''}
                                    onChange={handleCategoryChange}
                                    label="Category"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category: any) => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </FormField>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="w-full">
                                <RangeSlider
                                    label="Price Range"
                                    min={0}
                                    max={maxPrice}
                                    value={priceRange}
                                    onChange={handlePriceRangeChange}
                                    formatValue={formatCurrency}
                                />
                            </div>
                            <div className="w-full">
                                <RangeSlider
                                    label="Stock Range"
                                    min={0}
                                    max={maxStock}
                                    value={stockRange}
                                    onChange={handleStockRangeChange}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    label="Clear Filters"
                                    onClick={() => {
                                        setFilter({});
                                        setPriceRange([0, maxPrice]);
                                        setStockRange([0, maxStock]);
                                    }}
                                    className="ml-2"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card padding="medium" className="w-full">
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
                                {isTableLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.productId} className="text-gray-900">
                                            <td className="px-6 py-4 whitespace-nowrap">{product.productName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.productCode}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.price} {product.currency}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.category.categoryName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.productStock?.stockQuantity || 0}</td>
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
                                    ))
                                )}
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
                </Card>
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