import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/layout/layout.jsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";

import HomePage from "../pages/HomePage.jsx";
import CategoryPage from "../pages/CategoryPage.jsx";
import ProductDetailPage from "../pages/ProductDetailPage.jsx";
import CartPage from "../pages/CartPage.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import PaymentPage from "../pages/PaymentPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import AccountPage from "../pages/AccountPage.jsx";
import SearchPage from "../pages/SearchPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import FlashSalePage from "../pages/FlashSalePage.jsx";
import NewArrivalsPage from "../pages/NewArrivalsPage.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/flash-sale" element={<FlashSalePage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
