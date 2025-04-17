import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../../atoms';
import CartIcon from '../../atoms/CartIcon/CartIcon';
import { NavbarProps } from './Navbar.types';
import { useAuth } from '../../../contexts/AuthContext';
import { isAdmin } from '../../../utils/jwt';
import clsx from 'clsx';

const Navbar: React.FC<NavbarProps> = ({ className }) => {
    const { logout } = useAuth();
    const userIsAdmin = isAdmin();

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
                        {userIsAdmin && (
                            <NavLink
                                to="/admin"
                                className={({ isActive }) =>
                                    clsx('inline-flex items-center px-4 text-gray-700 hover:text-blue-600', {
                                        'text-blue-600 border-b-2 border-blue-600': isActive,
                                    })
                                }
                            >
                                Admin
                            </NavLink>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <CartIcon />
                        <Button
                            label="Logout"
                            onClick={logout}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 