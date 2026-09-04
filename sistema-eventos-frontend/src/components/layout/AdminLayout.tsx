import { SidebarLayout } from "./Sidebar";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/eventos", label: "Eventos" },
  { to: "/admin/clientes", label: "Clientes" },
  { to: "/admin/proveedores", label: "Proveedores" },
  { to: "/admin/catalogos", label: "Catálogos" },
  { to: "/admin/reportes", label: "Reportes" },
];

export function AdminLayout() {
  return <SidebarLayout links={links} />;
}
