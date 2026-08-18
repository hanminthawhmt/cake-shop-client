import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CakeCatalogPage } from '../features/catalog/pages/CakeCatalogPage'
import { CakeDetailPage } from '../features/cakes/pages/CakeDetailPage'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cakes" replace />} />
      <Route path="/cakes" element={<CakeCatalogPage />} />
      <Route path="/cakes/:id" element={<CakeDetailPage />} />
      <Route path="*" element={<Navigate to="/cakes" replace />} />
    </Routes>
  )
}
