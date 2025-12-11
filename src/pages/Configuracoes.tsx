import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  User,
  Bell,
  Shield,
  Database,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Configuracoes = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso!",
    });
  };

  return (
    <MainLayout title="Configurações" subtitle="Gerencie as configurações do sistema">
      <div className="max-w-3xl space-y-8 animate-fade-in">
        {/* Dados da Empresa */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Dados da Empresa</h2>
              <p className="text-sm text-muted-foreground">
                Informações básicas da sua oficina
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
              <Input
                id="nomeEmpresa"
                placeholder="AutoGestão Oficina Mecânica"
                defaultValue="AutoGestão Oficina Mecânica"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  defaultValue="12.345.678/0001-90"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 0000-0000"
                  defaultValue="(11) 3456-7890"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Rua, número - Bairro, Cidade - UF"
                defaultValue="Rua das Oficinas, 123 - Centro, São Paulo - SP"
              />
            </div>
          </div>
        </section>

        {/* Usuário */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <User className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Perfil do Usuário</h2>
              <p className="text-sm text-muted-foreground">
                Suas informações pessoais
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" placeholder="Seu nome" defaultValue="Admin" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  defaultValue="admin@autogestao.com"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Notificações */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Notificações</h2>
              <p className="text-sm text-muted-foreground">
                Configure alertas e avisos
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Estoque baixo</p>
                <p className="text-sm text-muted-foreground">
                  Receber alerta quando peças atingirem estoque mínimo
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Serviços pendentes</p>
                <p className="text-sm text-muted-foreground">
                  Alerta de serviços aguardando conclusão
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Novos clientes</p>
                <p className="text-sm text-muted-foreground">
                  Notificar quando um novo cliente for cadastrado
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* Sistema */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Sistema</h2>
              <p className="text-sm text-muted-foreground">
                Configurações avançadas
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Backup automático</p>
                <p className="text-sm text-muted-foreground">
                  Realizar backup diário dos dados
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Modo escuro</p>
                <p className="text-sm text-muted-foreground">
                  Usar tema escuro na interface
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Configuracoes;
