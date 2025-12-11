import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Car, Wrench, Package } from "lucide-react";

const actions = [
  {
    icon: UserPlus,
    label: "Novo Cliente",
    path: "/clientes",
    color: "bg-chart-2",
  },
  {
    icon: Car,
    label: "Novo Veículo",
    path: "/veiculos",
    color: "bg-chart-3",
  },
  {
    icon: Wrench,
    label: "Novo Serviço",
    path: "/servicos",
    color: "bg-chart-1",
  },
  {
    icon: Package,
    label: "Nova Peça",
    path: "/pecas",
    color: "bg-chart-4",
  },
];

export function QuickActions() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link key={action.path} to={action.path}>
            <Button
              variant="secondary"
              className="w-full h-auto py-4 flex-col gap-2 hover:bg-secondary/80 transition-all hover:scale-105"
            >
              <div
                className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}
              >
                <action.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
