import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductView from './pages/ProductView';
import ProductForm from './pages/ProductForm';
import Suppliers from './pages/Suppliers';
import SupplierForm from './pages/SupplierForm';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<Products />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductView />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />

            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/suppliers/new" element={<SupplierForm />} />
            <Route path="/suppliers/:id/edit" element={<SupplierForm />} />
          </Route>

          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
