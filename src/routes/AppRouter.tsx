import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CakeCatalogPage } from '../features/catalog/pages/CakeCatalogPage'
import { CakeDetailPage } from '../features/cakes/pages/CakeDetailPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { SignupPage } from '../features/auth/pages/SignupPage'
import { CartPage } from '../features/cart/pages/CartPage'
import { CheckoutPage } from '../features/checkout/pages/CheckoutPage'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cakes" replace />} />
      <Route path="/cakes" element={<CakeCatalogPage />} />
      <Route path="/cakes/:id" element={<CakeDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate to="/cakes" replace />} />
    </Routes>
  )
}
