import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AssetCategories from "../pages/AssetCategories";
import Locations from "../pages/Locations";
import Assets from "../pages/Assets";
import MaintenanceSchedules from "../pages/MaintenanceSchedules";
import MaintenanceLogs from "../pages/MaintenanceLogs";
import DamageReports from "../pages/DamageReports";
import AssetDetail from "../pages/AssetDetail";

function AppRoutes() {
  return (
    <BrowserRouter>
      <ThemeProvider>
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/asset-categories" element={<AssetCategories />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/assets" element={<Assets />} />
              <Route
                path="/maintenance-schedules"
                element={<MaintenanceSchedules />}
              />
              <Route path="/maintenance-logs" element={<MaintenanceLogs />} />
              <Route path="/damage-reports" element={<DamageReports />} />
              <Route path="/assets/:id" element={<AssetDetail />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
