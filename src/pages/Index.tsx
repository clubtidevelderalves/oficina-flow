import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentServices } from "@/components/dashboard/RecentServices";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Users, Car, Wrench, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <MainLayout title="Dashboard" subtitle="Visão geral da sua oficina">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Clientes"
            value={156}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatCard
            title="Veículos Cadastrados"
            value={243}
            icon={Car}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Serviços este Mês"
            value={48}
            icon={Wrench}
            trend={{ value: 5, isPositive: true }}
            variant="success"
          />
          <StatCard
            title="Faturamento Mensal"
            value="R$ 32.450"
            icon={DollarSign}
            trend={{ value: 15, isPositive: true }}
            variant="warning"
          />
        </div>

        {/* Charts and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Recent Services */}
        <RecentServices />
      </div>
    </MainLayout>
  );
};

export default Index;
