import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/Login';
import AssetCategories from '../pages/AssetCategories';
import Locations from '../pages/Locations';
import Assets from '../pages/Assets';

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<div>Dashboard (Coming Soon)</div>} />
            <Route path="/asset-categories" element={<AssetCategories />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/assets" element={<Assets />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
