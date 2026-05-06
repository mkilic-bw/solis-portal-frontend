import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../shared/components/Layout';
import CatalogPage from '../features/catalog/CatalogPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<CatalogPage />} />
      </Route>
    </Routes>
  );
}
