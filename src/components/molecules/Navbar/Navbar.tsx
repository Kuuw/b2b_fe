import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../../atoms';
import { NavbarProps } from './Navbar.types';
import { useAuth } from '../../../contexts/AuthContext';
import clsx from 'clsx';

const Navbar: React.FC<NavbarProps> = ({ className }) => {
    const { logout } = useAuth();

    return (
        <nav className={clsx('bg-white shadow-sm', className)}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <NavLink
                            to="/products"
                            className={({ isActive }) =>
                                clsx('inline-flex items-center px-4 text-gray-700 hover:text-blue-600', {
                                    'text-blue-600 border-b-2 border-blue-600': isActive,
                                })
                            }
                        >
                            Products
                        </NavLink>
                        <NavLink
                            to="/orders"
                            className={({ isActive }) =>
                                clsx('inline-flex items-center px-4 text-gray-700 hover:text-blue-600', {
                                    'text-blue-600 border-b-2 border-blue-600': isActive,
                                })
                            }
                        >
                            Orders
                        </NavLink>
                    </div>
                    <div className="flex items-center">
                        <Button
                            label="Logout"
                            onClick={logout}
                            className="ml-4"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 