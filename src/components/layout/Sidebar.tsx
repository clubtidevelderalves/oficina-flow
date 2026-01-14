import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Package,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronDown,
  LogOut,
  Cog,
  Tag,
  Layers,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  {
    icon: Car,
    label: "Veículos",
    children: [
      { icon: Car, label: "Veículos", path: "/veiculos" },
      { icon: Tag, label: "Marcas", path: "/marcas" },
      { icon: Layers, label: "Modelos", path: "/modelos" },
    ],
  },
  { icon: Wrench, label: "Serviços", path: "/servicos" },
  { icon: Package, label: "Peças", path: "/pecas" },
  { icon: ShoppingCart, label: "Vendas", path: "/vendas" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(["Veículos"]);
  const location = useLocation();
  const { logout } = useAuth();

  const toggleSubmenu = (label: string) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenSubmenus([label]);
    } else {
      setOpenSubmenus((prev) =>
        prev.includes(label)
          ? prev.filter((item) => item !== label)
          : [...prev, label]
      );
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Cog className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-sidebar-foreground text-lg">
                Auto<span className="text-primary">Gestão</span>
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Sistema Oficina</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          if (item.children) {
            const isOpen = openSubmenus.includes(item.label);
            const isActive = item.children.some(
              (child) => child.path === location.pathname
            );

            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && !isOpen && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                      collapsed ? "" : "group-hover:scale-110"
                    )}
                  />
                  {!collapsed && (
                    <>
                      <span className="font-medium animate-fade-in flex-1 text-left">
                        {item.label}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isOpen && "transform rotate-180"
                        )}
                      />
                    </>
                  )}
                </button>

                {!collapsed && isOpen && (
                  <div className="pl-4 space-y-1 animate-accordion-down overflow-hidden">
                    {item.children.map((child) => {
                      const isChildActive = location.pathname === child.path;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path!}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                            isChildActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                              : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <child.icon
                            className={cn(
                              "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                              !isChildActive && "group-hover:scale-110"
                            )}
                          />
                          <span className="text-sm font-medium animate-fade-in">
                            {child.label}
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path!}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                  !isActive && "group-hover:scale-110"
                )}
              />
              {!collapsed && (
                <span className="font-medium animate-fade-in">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-sidebar-foreground/70 hover:text-red-500 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-2">Sair</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span className="ml-2">Recolher</span>}
        </Button>
      </div>
    </aside>
  );
}
