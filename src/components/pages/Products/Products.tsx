import React, { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCategories, filter } from '../../../services';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import Card from '../../atoms/Card';
import Title from '../../atoms/Title';
import SearchField from '../../atoms/SearchField';
import Filter from '../../atoms/Filter';
import Pagination from '../../atoms/Pagination';
import ProductTable from '../../molecules/ProductTable';
import { ProductsProps } from './Products.types';
import clsx from 'clsx';
import { Button } from '@/components/atoms';

const Products: React.FC<ProductsProps> = ({ className }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState<filter>({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState<filter>({});

    // Debounce filter changes
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilter(filter);
        }, 500); // 500ms debounce

        return () => clearTimeout(handler);
    }, [filter]);

    useEffect(() => {
        fetchProducts();
    }, [debouncedFilter, currentPage]);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await getProducts(currentPage, pageSize, filter);
            setProducts(response.items);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [currentPage, filter]);

    const handleProductClick = (product: Product) => {
        navigate(`/products/${product.productId}`);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFilter((prev: any) => ({
            ...prev,
            categoryId: value === '' ? undefined : value,
        }));
        setCurrentPage(1);
    }

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className={clsx("w-full min-h-screen bg-gray-50", className)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <Title variant="h2">Products</Title>
                    <div className="mb-4 flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-xs mb-1">Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                value={filter.productName || ''}
                                onChange={handleFilterChange}
                                className="border px-2 py-1 rounded bg-white text-gray-900"
                                placeholder="Product Name"
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-1">Category</label>
                            <select
                                name="categoryId"
                                value={filter.categoryId || ''}
                                onChange={handleCategoryChange}
                                className="border px-2 py-1 rounded bg-white text-gray-900"
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
                                className="border px-2 py-1 rounded bg-white text-gray-900"
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
                                className="border px-2 py-1 rounded bg-white text-gray-900"
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
                </div>

                <Card padding="medium">
                    <ProductTable
                        products={products}
                        onProductClick={handleProductClick}
                        isLoading={isLoading}
                    />
                    {totalPages > 0 && (
                        <div className="mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Products; 