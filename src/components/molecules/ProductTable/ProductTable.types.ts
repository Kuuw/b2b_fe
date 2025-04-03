import { Product } from '../../../models/product';

export interface ProductTableProps {
    products: Product[];
    onProductClick?: (product: Product) => void;
    className?: string;
    isLoading?: boolean;
} 