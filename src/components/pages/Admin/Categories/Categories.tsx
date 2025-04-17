import React, { useEffect, useState } from 'react';
import { Button } from '../../../atoms';
import ButtonStyles from '../../../atoms/Button/Button.styles';
import { getCategories } from '@/services';

interface Category {
    id: string;
    name: string;
    description: string;
    productCount: number;
}

const Categories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const response = await getCategories(1, 100); // Get all categories
            setCategories(response.items || []);
        } catch (error) {
            console.error('Error loading categories:', error);
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    if (isLoading) {
        return <div className="text-center py-8 text-gray-900">Loading...</div>;
    }

    return (
        <div className="text-gray-900">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Categories Management</h2>
                <Button
                    label="Add New Category"
                    onClick={() => setIsModalOpen(true)}
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
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Products
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                    No categories found
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="text-gray-900">
                                    <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{category.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{category.productCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Button
                                            label="Edit"
                                            onClick={() => {}}
                                            className="mr-2"
                                        />
                                        <Button
                                            label="Delete"
                                            onClick={() => {}}
                                            variant={ButtonStyles.Red}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categories; 