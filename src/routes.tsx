import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Admin from './components/pages/Admin/Admin';
import Products from './components/pages/Products/Products';
import ProductDetail from './components/pages/Products/ProductDetail';
import Login from './components/pages/Auth/Login';

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            {isAuthenticated ? (
                <>
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:productId" element={<ProductDetail />} />
                </>
            ) : (
                <Route path="*" element={<Login />} />
            )}
        </Routes>
    );
};

export default AppRoutes; 