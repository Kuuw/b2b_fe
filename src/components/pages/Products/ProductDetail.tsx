import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../../services/product.service';
import { Product } from '../../../models/product';
import Card from '../../atoms/Card';
import Title from '../../atoms/Title';
import Button from '../../atoms/Button/Button';
import AddToCartButton from '../../atoms/AddToCartButton/AddToCartButton';
import { ProductImageGallery, ProductInfo, ProductStockInfo } from '../../molecules';
import { ProductDetailProps } from './ProductDetail.types';
import clsx from 'clsx';
import ButtonStyles from '../../atoms/Button/Button.styles';

const ProductDetail: React.FC<ProductDetailProps> = ({ className }) => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            try {
                setIsLoading(true);
                const response = await getProductById(productId);
                setProduct(response);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleBackClick = () => {
        navigate('/products');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Title variant="h2">Product not found</Title>
                <Button 
                    label="Back to Products"
                    onClick={handleBackClick} 
                    className="mt-4"
                    variant={ButtonStyles.Blue}
                />
            </div>
        );
    }

    return (
        <div className={clsx("w-full min-h-screen bg-gray-50", className)}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Button 
                        label="← Back to Products"
                        onClick={handleBackClick} 
                        variant={ButtonStyles.Gray}
                    />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card padding="medium">
                        <ProductImageGallery images={product.productImages} />
                    </Card>
                    
                    <div className="space-y-6">
                        <Card padding="medium">
                            <ProductInfo product={product} />
                            <div className="mt-6">
                                <AddToCartButton product={product} />
                            </div>
                        </Card>
                        
                        <Card padding="medium">
                            <ProductStockInfo stock={product.productStock} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail; 