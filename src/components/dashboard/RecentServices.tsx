import { Badge } from "@/components/ui/badge";
import { Car, Clock, User } from "lucide-react";

const services = [
  {
    id: 1,
    client: "João Silva",
    vehicle: "Honda Civic 2020",
    service: "Troca de óleo",
    status: "em_andamento",
    time: "2h atrás",
  },
  {
    id: 2,
    client: "Maria Santos",
    vehicle: "Toyota Corolla 2019",
    service: "Revisão completa",
    status: "pendente",
    time: "3h atrás",
  },
  {
    id: 3,
    client: "Pedro Oliveira",
    vehicle: "Volkswagen Golf 2021",
    service: "Troca de pastilhas",
    status: "concluido",
    time: "5h atrás",
  },
  {
    id: 4,
    client: "Ana Costa",
    vehicle: "Fiat Argo 2022",
    service: "Alinhamento",
    status: "em_andamento",
    time: "6h atrás",
  },
];

const statusConfig = {
  pendente: { label: "Pendente", variant: "warning" as const },
  em_andamento: { label: "Em Andamento", variant: "default" as const },
  concluido: { label: "Concluído", variant: "success" as const },
};

export function RecentServices() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-4">Serviços Recentes</h3>
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">
                  {service.service}
                </p>
                <Badge
                  variant={
                    statusConfig[service.status as keyof typeof statusConfig]
                      .variant
                  }
                  className="shrink-0"
                >
                  {
                    statusConfig[service.status as keyof typeof statusConfig]
                      .label
                  }
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {service.client}
                </span>
                <span>•</span>
                <span>{service.vehicle}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-3 h-3" />
              {service.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
