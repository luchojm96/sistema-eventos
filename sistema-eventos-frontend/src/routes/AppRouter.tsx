import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminLayout } from "../components/layout/AdminLayout";
import { ClienteLayout } from "../components/layout/ClienteLayout";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegistroPage } from "../pages/auth/RegistroPage";
import { RsvpPage } from "../pages/rsvp/RsvpPage";
import { Placeholder } from "../pages/Placeholder";
import { DashboardPage } from "../pages/admin/dashboard/DashboardPage";
import { ClientesPage } from "../pages/admin/clientes/ClientesPage";
import { CatalogosPage } from "../pages/admin/catalogos/CatalogosPage";
import { ProveedoresPage } from "../pages/admin/proveedores/ProveedoresPage";
import { ReportesPage } from "../pages/admin/reportes/ReportesPage";
import { EventosListPage } from "../pages/admin/eventos/EventosListPage";
import { EventoFormPage } from "../pages/admin/eventos/EventoFormPage";
import { EventoDetailPage as AdminEventoDetailPage } from "../pages/admin/eventos/EventoDetailPage";
import { MisEventosPage } from "../pages/cliente/eventos/MisEventosPage";
import { PerfilPage } from "../pages/cliente/perfil/PerfilPage";
import { EventoDetailPage as ClienteEventoDetailPage } from "../pages/cliente/eventos/EventoDetailPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 8.1 Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/rsvp/:token" element={<RsvpPage />} />

        {/* 8.2 Rutas del Administrador */}
        <Route element={<ProtectedRoute rolesPermitidos={["administrador"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/eventos" element={<EventosListPage />} />
            <Route path="/admin/eventos/nuevo" element={<EventoFormPage />} />
            <Route path="/admin/eventos/:id/editar" element={<EventoFormPage />} />
            <Route path="/admin/eventos/:id" element={<AdminEventoDetailPage />} />
            <Route path="/admin/clientes" element={<ClientesPage />} />
            <Route path="/admin/proveedores" element={<ProveedoresPage />} />
            <Route path="/admin/catalogos" element={<CatalogosPage />} />
            <Route path="/admin/reportes" element={<ReportesPage />} />
          </Route>
        </Route>

        {/* 8.3 Rutas del Cliente */}
        <Route element={<ProtectedRoute rolesPermitidos={["cliente"]} />}>
          <Route element={<ClienteLayout />}>
            <Route path="/cliente/mis-eventos" element={<MisEventosPage />} />
            <Route path="/cliente/eventos/:id" element={<ClienteEventoDetailPage />} />
            <Route path="/cliente/perfil" element={<PerfilPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Placeholder titulo="Página no encontrada" />} />
      </Routes>
    </BrowserRouter>
  );
}
