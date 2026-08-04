import { Routes, Route, Navigate } from "react-router-dom";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "./context/AdminAuthContext.jsx";
import AdminAuth from "./AdminAuth.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import { useEffect, useState } from "react";
import { apiClient } from "../lib/api.js";
import DashboardPage from "./pages/DashboardPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

function AdminRoutes() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    const loadPendingOrders = async () => {
      try {
        const res = await apiClient.getAdminOrders();

        const orders = res.data.data.orders || [];

        setPendingOrders(orders.filter((o) => o.status === "PENDING").length);
      } catch (err) {
        console.error(err);
      }
    };

    loadPendingOrders();
  }, []);
  if (isLoading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0fdf4",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "3px solid #e5e7eb",
            borderTopColor: "#4f7d52",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (!isAuthenticated) return <AdminAuth />;

  return (
    <AdminLayout pendingOrders={pendingOrders}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminRoutes />
    </AdminAuthProvider>
  );
}
