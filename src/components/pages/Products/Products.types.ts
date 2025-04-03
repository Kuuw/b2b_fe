import { Product } from '../../../models/product';

export interface ProductsProps {
    products: Product[];
    onProductClick?: (product: Product) => void;
    onSearch?: (query: string) => void;
    onFilter?: (category: string) => void;
    onPageChange?: (page: number) => void;
    currentPage?: number;
    totalPages?: number;
    categories?: { value: string; label: string; }[];
    className?: string;
    isLoading?: boolean;
} 