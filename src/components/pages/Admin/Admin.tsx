import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import clsx from 'clsx';

const Admin: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                <div className="flex space-x-4 mb-8">
                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            clsx('px-4 py-2 rounded-md', {
                                'bg-blue-100 text-blue-700 border border-blue-300': isActive,
                                'bg-white text-gray-700 hover:bg-gray-100': !isActive,
                            })
                        }
                    >
                        Products
                    </NavLink>
                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) =>
                            clsx('px-4 py-2 rounded-md', {
                                'bg-blue-100 text-blue-700 border border-blue-300': isActive,
                                'bg-white text-gray-700 hover:bg-gray-100': !isActive,
                            })
                        }
                    >
                        Categories
                    </NavLink>
                    <NavLink
                        to="/admin/images"
                        className={({ isActive }) =>
                            clsx('px-4 py-2 rounded-md', {
                                'bg-blue-100 text-blue-700 border border-blue-300': isActive,
                                'bg-white text-gray-700 hover:bg-gray-100': !isActive,
                            })
                        }
                    >
                        Product Images
                    </NavLink>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-gray-900">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Admin; 