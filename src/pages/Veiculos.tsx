import { useState, useEffect } from "react";
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
import { Plus, Search, Car, User, Edit, Trash2, Calendar, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/Service/api";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Veiculo {
  id: number;
  placa: string;
  idmodelo: number;
  modelo?: { id: number; modelo: string; marca: { id: number; marca: string } };
  idcliente: number;
  cliente?: { id: number; nome: string };
  iduser: number;
  user?: { id: number; name: string };
  ano: number;
  cor: string;
  km: number;
  ativo: number;
}

interface Cliente {
  id: number;
  nome: string;
}

interface Modelo {
  id: number;
  modelo: string;
  marca: { id: number; marca: string };
}

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    placa: "",
    idmodelo: "",
    idcliente: "",
    ano: "",
    cor: "",
    km: "",
    ativo: 1,
  });

  const [currentVeiculo, setCurrentVeiculo] = useState<Veiculo | null>(null);

  const fetchData = async () => {
    try {
      const [veiculosData, clientesData, modelosData] = await Promise.all([
        api.get("/veiculos"),
        api.get("/clientes"),
        api.get("/modelos"),
      ]);
      setVeiculos(veiculosData);
      setClientes(clientesData);
      setModelos(modelosData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredVeiculos = veiculos.filter(
    (veiculo) =>
      veiculo.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.modelo?.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      placa: "",
      idmodelo: "",
      idcliente: "",
      ano: "",
      cor: "",
      km: "",
      ativo: 1,
    });
    setCurrentVeiculo(null);
  };

  const handleAddVeiculo = async () => {
    if (!formData.placa || !formData.idmodelo || !formData.idcliente) {
      toast({
        title: "Erro",
        description: "Preencha placa, modelo e cliente.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        iduser: user?.id,
      };
      await api.post("/veiculos", payload);
      fetchData();
      setIsOpen(false);
      resetForm();
      toast({
        title: "Sucesso",
        description: "Veículo adicionado com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar veículo.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (veiculo: Veiculo) => {
    setCurrentVeiculo(veiculo);
    setFormData({
      placa: veiculo.placa,
      idmodelo: veiculo.idmodelo.toString(),
      idcliente: veiculo.idcliente.toString(),
      ano: veiculo.ano?.toString() || "",
      cor: veiculo.cor || "",
      km: veiculo.km?.toString() || "",
      ativo: veiculo.ativo,
    });
    setIsEditOpen(true);
  };

  const handleUpdateVeiculo = async () => {
    if (!currentVeiculo) return;
    try {
      await api.put(`/veiculos/${currentVeiculo.id}`, formData);
      fetchData();
      setIsEditOpen(false);
      resetForm();
      toast({
        title: "Sucesso",
        description: "Veículo atualizado com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar veículo.",
        variant: "destructive",
      });
    }
  };

  const toggleAtivo = async (veiculo: Veiculo) => {
    try {
      await api.put(`/veiculos/${veiculo.id}`, { ...veiculo, ativo: veiculo.ativo === 1 ? 0 : 1 });
      fetchData();
      toast({
        title: "Sucesso",
        description: `Veículo ${veiculo.ativo === 1 ? 'inativado' : 'ativado'}!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status.",
        variant: "destructive",
      });
    }
  }

  return (
    <MainLayout title="Veículos" subtitle="Gerencie os veículos cadastrados">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por placa, modelo ou cliente..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Veículo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Veículo</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="placa">Placa *</Label>
                    <Input
                      id="placa"
                      value={formData.placa}
                      onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                      placeholder="ABC-1234"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ano">Ano</Label>
                    <Input
                      id="ano"
                      type="number"
                      value={formData.ano}
                      onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="modelo">Modelo *</Label>
                  <Select value={formData.idmodelo} onValueChange={(val) => setFormData({ ...formData, idmodelo: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modelos.map(m => (
                        <SelectItem key={m.id} value={m.id.toString()}>{m.modelo} ({m.marca.marca})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Select value={formData.idcliente} onValueChange={(val) => setFormData({ ...formData, idcliente: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cor">Cor</Label>
                    <Input
                      id="cor"
                      value={formData.cor}
                      onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                      placeholder="Prata"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="km">Quilometragem</Label>
                    <Input
                      id="km"
                      type="number"
                      value={formData.km}
                      onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                      placeholder="45000"
                    />
                  </div>
                </div>
                <Button onClick={handleAddVeiculo} className="mt-2">
                  Adicionar Veículo
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) resetForm(); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Veículo</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Same fields as Add */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-placa">Placa *</Label>
                    <Input
                      id="edit-placa"
                      value={formData.placa}
                      onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-ano">Ano</Label>
                    <Input
                      id="edit-ano"
                      type="number"
                      value={formData.ano}
                      onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-modelo">Modelo *</Label>
                  <Select value={formData.idmodelo} onValueChange={(val) => setFormData({ ...formData, idmodelo: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modelos.map(m => (
                        <SelectItem key={m.id} value={m.id.toString()}>{m.modelo} ({m.marca.marca})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-cliente">Cliente *</Label>
                  <Select value={formData.idcliente} onValueChange={(val) => setFormData({ ...formData, idcliente: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-cor">Cor</Label>
                    <Input
                      id="edit-cor"
                      value={formData.cor}
                      onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-km">Quilometragem</Label>
                    <Input
                      id="edit-km"
                      type="number"
                      value={formData.km}
                      onChange={(e) => setFormData({ ...formData, km: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateVeiculo} className="mt-2">
                  Salvar Alterações
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
                <TableHead>Veículo</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>KM</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVeiculos.map((veiculo) => (
                <TableRow
                  key={veiculo.id}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Car className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{veiculo.modelo?.marca?.marca}</div>
                        <div className="text-sm text-muted-foreground">
                          {veiculo.modelo?.modelo}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {veiculo.placa}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {veiculo.ano}
                    </span>
                  </TableCell>
                  <TableCell>{veiculo.cor}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {veiculo.cliente?.nome}
                    </span>
                  </TableCell>
                  <TableCell>
                    {veiculo.km?.toLocaleString("pt-BR")} km
                  </TableCell>
                  <TableCell>
                    <Badge variant={veiculo.ativo === 1 ? "default" : "destructive"}>
                      {veiculo.ativo === 1 ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(veiculo)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleAtivo(veiculo)}>
                        {veiculo.ativo === 1 ? (
                          <Trash2 className="w-4 h-4 text-destructive" />
                        ) : (
                          <RefreshCcw className="w-4 h-4 text-green-600" />
                        )}
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

export default Veiculos;
