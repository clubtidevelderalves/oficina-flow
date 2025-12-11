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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Wrench, Clock, DollarSign, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Servico {
  id: number;
  numero: string;
  cliente: string;
  veiculo: string;
  descricao: string;
  status: "pendente" | "em_andamento" | "concluido" | "cancelado";
  valor: number;
  dataEntrada: string;
  previsao: string;
}

const servicosData: Servico[] = [
  {
    id: 1,
    numero: "OS-001",
    cliente: "João Silva",
    veiculo: "Honda Civic - ABC-1234",
    descricao: "Troca de óleo e filtros",
    status: "em_andamento",
    valor: 350,
    dataEntrada: "18/11/2024",
    previsao: "19/11/2024",
  },
  {
    id: 2,
    numero: "OS-002",
    cliente: "Maria Santos",
    veiculo: "Toyota Corolla - DEF-5678",
    descricao: "Revisão completa 60.000 km",
    status: "pendente",
    valor: 1200,
    dataEntrada: "18/11/2024",
    previsao: "20/11/2024",
  },
  {
    id: 3,
    numero: "OS-003",
    cliente: "Pedro Oliveira",
    veiculo: "VW Golf - GHI-9012",
    descricao: "Troca de pastilhas e discos de freio",
    status: "concluido",
    valor: 850,
    dataEntrada: "15/11/2024",
    previsao: "17/11/2024",
  },
  {
    id: 4,
    numero: "OS-004",
    cliente: "Ana Costa",
    veiculo: "Fiat Argo - JKL-3456",
    descricao: "Alinhamento e balanceamento",
    status: "em_andamento",
    valor: 180,
    dataEntrada: "18/11/2024",
    previsao: "18/11/2024",
  },
];

const statusConfig = {
  pendente: { label: "Pendente", variant: "warning" as const },
  em_andamento: { label: "Em Andamento", variant: "default" as const },
  concluido: { label: "Concluído", variant: "success" as const },
  cancelado: { label: "Cancelado", variant: "destructive" as const },
};

const Servicos = () => {
  const [servicos, setServicos] = useState<Servico[]>(servicosData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [novoServico, setNovoServico] = useState({
    cliente: "",
    veiculo: "",
    descricao: "",
    valor: "",
    previsao: "",
  });

  const filteredServicos = servicos.filter((servico) => {
    const matchesSearch =
      servico.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.veiculo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "todos" || servico.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAddServico = () => {
    if (!novoServico.cliente || !novoServico.descricao) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const newServico: Servico = {
      id: servicos.length + 1,
      numero: `OS-${String(servicos.length + 1).padStart(3, "0")}`,
      cliente: novoServico.cliente,
      veiculo: novoServico.veiculo,
      descricao: novoServico.descricao,
      status: "pendente",
      valor: parseFloat(novoServico.valor) || 0,
      dataEntrada: new Date().toLocaleDateString("pt-BR"),
      previsao: novoServico.previsao || "-",
    };

    setServicos([...servicos, newServico]);
    setNovoServico({
      cliente: "",
      veiculo: "",
      descricao: "",
      valor: "",
      previsao: "",
    });
    setIsOpen(false);

    toast({
      title: "Serviço criado",
      description: `Ordem de serviço ${newServico.numero} criada com sucesso!`,
    });
  };

  return (
    <MainLayout title="Serviços" subtitle="Gerencie as ordens de serviço">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por OS, cliente ou veículo..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova OS
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Nova Ordem de Serviço</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Input
                    id="cliente"
                    value={novoServico.cliente}
                    onChange={(e) =>
                      setNovoServico({ ...novoServico, cliente: e.target.value })
                    }
                    placeholder="Nome do cliente"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="veiculo">Veículo</Label>
                  <Input
                    id="veiculo"
                    value={novoServico.veiculo}
                    onChange={(e) =>
                      setNovoServico({ ...novoServico, veiculo: e.target.value })
                    }
                    placeholder="Modelo - Placa"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição do Serviço *</Label>
                  <Textarea
                    id="descricao"
                    value={novoServico.descricao}
                    onChange={(e) =>
                      setNovoServico({
                        ...novoServico,
                        descricao: e.target.value,
                      })
                    }
                    placeholder="Descreva o serviço a ser realizado"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="valor">Valor Estimado</Label>
                    <Input
                      id="valor"
                      type="number"
                      value={novoServico.valor}
                      onChange={(e) =>
                        setNovoServico({ ...novoServico, valor: e.target.value })
                      }
                      placeholder="0,00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="previsao">Previsão de Entrega</Label>
                    <Input
                      id="previsao"
                      type="date"
                      value={novoServico.previsao}
                      onChange={(e) =>
                        setNovoServico({
                          ...novoServico,
                          previsao: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleAddServico} className="mt-2">
                  Criar Ordem de Serviço
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead>OS</TableHead>
                <TableHead>Cliente / Veículo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Datas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServicos.map((servico) => (
                <TableRow
                  key={servico.id}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <TableCell>
                    <Badge variant="outline" className="font-mono font-semibold">
                      {servico.numero}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{servico.cliente}</div>
                      <div className="text-sm text-muted-foreground">
                        {servico.veiculo}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-primary" />
                      <span className="max-w-[200px] truncate">
                        {servico.descricao}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[servico.status].variant}>
                      {statusConfig[servico.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 font-semibold text-success">
                      <DollarSign className="w-4 h-4" />
                      {servico.valor.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Entrada: {servico.dataEntrada}
                      </div>
                      <div className="text-muted-foreground">
                        Previsão: {servico.previsao}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
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

export default Servicos;
