import { SidebarLayout } from "./Sidebar";

const links = [
  { to: "/cliente/mis-eventos", label: "Mis eventos" },
  { to: "/cliente/perfil", label: "Mi perfil" },
];

export function ClienteLayout() {
  return <SidebarLayout links={links} />;
}
