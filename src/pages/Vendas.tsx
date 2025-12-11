import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  ShoppingCart,
  DollarSign,
  Eye,
  CreditCard,
  Banknote,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Venda {
  id: number;
  numero: string;
  cliente: string;
  itens: number;
  total: number;
  formaPagamento: string;
  status: "pendente" | "pago" | "cancelado";
  data: string;
}

const vendasData: Venda[] = [
  {
    id: 1,
    numero: "VND-001",
    cliente: "João Silva",
    itens: 3,
    total: 450.0,
    formaPagamento: "Cartão Crédito",
    status: "pago",
    data: "18/11/2024",
  },
  {
    id: 2,
    numero: "VND-002",
    cliente: "Maria Santos",
    itens: 1,
    total: 180.0,
    formaPagamento: "PIX",
    status: "pago",
    data: "18/11/2024",
  },
  {
    id: 3,
    numero: "VND-003",
    cliente: "Pedro Oliveira",
    itens: 5,
    total: 890.0,
    formaPagamento: "Dinheiro",
    status: "pendente",
    data: "17/11/2024",
  },
  {
    id: 4,
    numero: "VND-004",
    cliente: "Ana Costa",
    itens: 2,
    total: 320.0,
    formaPagamento: "Cartão Débito",
    status: "pago",
    data: "17/11/2024",
  },
];

const statusConfig = {
  pendente: { label: "Pendente", variant: "warning" as const },
  pago: { label: "Pago", variant: "success" as const },
  cancelado: { label: "Cancelado", variant: "destructive" as const },
};

const Vendas = () => {
  const [vendas, setVendas] = useState<Venda[]>(vendasData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const filteredVendas = vendas.filter(
    (venda) =>
      venda.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVendas = vendas
    .filter((v) => v.status === "pago")
    .reduce((acc, v) => acc + v.total, 0);

  return (
    <MainLayout title="Vendas" subtitle="Controle de vendas e faturamento">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-6 animate-scale-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendas Hoje</p>
                <p className="text-2xl font-bold mt-1">
                  {vendas.filter((v) => v.data === "18/11/2024").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 animate-scale-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Faturamento Total
                </p>
                <p className="text-2xl font-bold mt-1 text-success">
                  R$ {totalVendas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 animate-scale-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold mt-1 text-warning">
                  {vendas.filter((v) => v.status === "pendente").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número ou cliente..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Venda
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Venda</DialogTitle>
              </DialogHeader>
              <div className="py-4 text-center text-muted-foreground">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <p>
                  O módulo completo de PDV será implementado com o backend.
                </p>
                <p className="text-sm mt-2">
                  Conecte o Lovable Cloud para habilitar vendas completas.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead>Nº Venda</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-center">Itens</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendas.map((venda) => (
                <TableRow
                  key={venda.id}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <TableCell>
                    <Badge variant="outline" className="font-mono font-semibold">
                      {venda.numero}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{venda.cliente}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{venda.itens}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-success flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {venda.total.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {venda.formaPagamento.includes("Cartão") ? (
                        <CreditCard className="w-4 h-4" />
                      ) : (
                        <Banknote className="w-4 h-4" />
                      )}
                      {venda.formaPagamento}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[venda.status].variant}>
                      {statusConfig[venda.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{venda.data}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Vendas;
