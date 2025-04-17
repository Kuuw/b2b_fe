import React, { useState } from 'react';
import { Button } from '../../../atoms';
import ButtonStyles from '../../../atoms/Button/Button.styles';

interface ProductImage {
    id: string;
    productId: string;
    productName: string;
    imageUrl: string;
    isMain: boolean;
}

const Images: React.FC = () => {
    const [images, setImages] = useState<ProductImage[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Product Images Management</h2>
                <Button
                    label="Upload New Image"
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                    <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="relative pb-[100%]">
                            <img
                                src={image.imageUrl}
                                alt={image.productName}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-gray-900">{image.productName}</h3>
                            <div className="mt-4 flex space-x-2">
                                <Button
                                    label={image.isMain ? "Main Image" : "Set as Main"}
                                    onClick={() => {}}
                                    className="flex-1"
                                />
                                <Button
                                    label="Delete"
                                    onClick={() => {}}
                                    variant={ButtonStyles.Red}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Images; 