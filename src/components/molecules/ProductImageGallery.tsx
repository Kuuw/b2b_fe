import React, { useState } from 'react';
import { ProductImage } from '../../models/product';
import clsx from 'clsx';

interface ProductImageGalleryProps {
    images: ProductImage[];
    className?: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, className }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    if (images.length === 0) {
        return (
            <div className={clsx("flex items-center justify-center h-64 bg-gray-100 rounded-lg", className)}>
                <span className="text-gray-500">No images available</span>
            </div>
        );
    }

    return (
        <div className={clsx("space-y-4", className)}>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <img
                    src={images[selectedImage].imageUrl}
                    alt={`Product image ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>
            
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                        <button
                            key={image.productImageId}
                            onClick={() => setSelectedImage(index)}
                            className={clsx(
                                "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                                selectedImage === index ? "border-blue-500" : "border-transparent"
                            )}
                        >
                            <img
                                src={image.imageUrl}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImageGallery; 