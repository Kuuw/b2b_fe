import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../../../services';
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

const Products: React.FC<ProductsProps> = ({ className }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await getProducts(currentPage, 10, search);
            setProducts(response.items);
            setTotalPages(Math.ceil(response.total / 10));
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
        fetchCategories();
    }, [currentPage, search]);

    const handleSearch = (query: string) => {
        setSearch(query);
        setCurrentPage(1);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleProductClick = (product: Product) => {
        navigate(`/products/${product.productId}`);
    };

    const categoryOptions = [
        { value: '', label: 'All Categories' },
        ...categories.map(category => ({
            value: category.categoryId,
            label: category.categoryName
        }))
    ];

    return (
        <div className={clsx("w-full min-h-screen bg-gray-50", className)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <Title variant="h2">Products</Title>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                        <SearchField
                            onSearch={handleSearch}
                            placeholder="Search products..."
                            className="w-full sm:w-64"
                        />
                        <Filter
                            options={categoryOptions}
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            placeholder="Filter by category"
                            className="w-full sm:w-48"
                        />
                    </div>
                </div>
                
                <Card padding="medium">
                    <ProductTable 
                        products={products}
                        onProductClick={handleProductClick}
                        isLoading={isLoading}
                    />
                    {totalPages > 1 && (
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