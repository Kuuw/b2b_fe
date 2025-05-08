import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Login from './components/pages/Login';
import { Products, ProductDetail } from './components/pages/Products';
import Cart from './components/pages/Cart/Cart';
import Checkout from './components/pages/Checkout/Checkout';
import Navbar from './components/molecules/Navbar';
import './index.css';
import Orders from './components/pages/Orders/Orders';
import OrderDetail from './components/pages/Orders/OrderDetail';
import Admin from './components/pages/Admin/Admin';
import AdminProducts from './components/pages/Admin/Products/Products';
import AdminCategories from './components/pages/Admin/Categories/Categories';
import AdminImages from './components/pages/Admin/Images/Images';
import AdminUsers from './components/pages/Admin/Users/Users';
import AdminOrders from './components/pages/Admin/Orders/Orders';
import AdminOrderDetail from './components/pages/Admin/Orders/OrderDetail';
import AdminCompanies from './components/pages/Admin/Companies/Companies';
import AdminReports from './components/pages/Admin/Reports/Reports';
import { isAdmin } from './utils/jwt';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const userIsAdmin = isAdmin();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to="/products" replace />
            )
          }
        />
        <Route
          path="/products"
          element={
            isAuthenticated ? (
              <Products products={[]} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/products/:productId"
          element={
            isAuthenticated ? (
              <ProductDetail />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/cart"
          element={
            isAuthenticated ? (
              <Cart />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/checkout"
          element={
            isAuthenticated ? (
              <Checkout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/orders"
          element={
            isAuthenticated ? (
              <Orders />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            isAuthenticated ? (
              <OrderDetail />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && userIsAdmin ? (
              <Admin />
            ) : (
              <Navigate to="/products" replace />
            )
          }
        >
          <Route
            path="products"
            element={<AdminProducts />}
          />
          <Route
            path="categories"
            element={<AdminCategories />}
          />
          <Route
            path="images"
            element={<AdminImages />}
          />
          <Route
            path="orders"
            element={<AdminOrders />}
          />
          <Route
            path="orders/:orderId"
            element={<AdminOrderDetail />}
          />
          <Route
            path="users"
            element={<AdminUsers />}
          />
          <Route
            path="companies"
            element={<AdminCompanies />}
          />
          <Route
            path="reports"
            element={<AdminReports />}
          />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
