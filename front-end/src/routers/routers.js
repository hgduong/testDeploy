import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import AdminDashboard from "../pages/AdminDashboard";
import Cart from "../pages/Cart";

import ProductPage from "../pages/ProductPage";
const AppRouter = () => {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<ProductPage />} />
      </Routes>
  );
};

export default AppRouter;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from '../pages/HomePage';
// import LoginPage from '../pages/LoginPage';

// const AppRouter = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/user-dashboard" element={<div>Trang người dùng</div>} />
//         <Route path="/admin-dashboard" element={<div>Trang quản trị</div>} />
//       </Routes>
//     </Router>
//   );
// };

// export default AppRouter;
