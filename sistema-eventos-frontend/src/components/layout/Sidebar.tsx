import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SidebarLayoutProps {
  links: { to: string; label: string }[];
}

export function SidebarLayout({ links }: SidebarLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {menuAbierto && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMenuAbierto(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-56 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0 ${
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-4">
          <span className="text-base font-semibold text-slate-900">Sistema Eventos</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 px-5 py-4">
          <p className="truncate text-sm text-slate-700">{user?.nombre}</p>
          <button
            onClick={handleLogout}
            className="mt-1 text-sm font-medium text-slate-500 underline hover:text-slate-700"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
            className="rounded-md p-1 text-slate-600 hover:bg-slate-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-slate-900">Sistema Eventos</span>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
