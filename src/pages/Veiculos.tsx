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
import { Plus, Search, Car, User, Edit, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  cliente: string;
  km: number;
}

const veiculosData: Veiculo[] = [
  {
    id: 1,
    placa: "ABC-1234",
    modelo: "Civic",
    marca: "Honda",
    ano: 2020,
    cor: "Prata",
    cliente: "João Silva",
    km: 45000,
  },
  {
    id: 2,
    placa: "DEF-5678",
    modelo: "Corolla",
    marca: "Toyota",
    ano: 2019,
    cor: "Branco",
    cliente: "Maria Santos",
    km: 62000,
  },
  {
    id: 3,
    placa: "GHI-9012",
    modelo: "Golf",
    marca: "Volkswagen",
    ano: 2021,
    cor: "Preto",
    cliente: "Pedro Oliveira",
    km: 28000,
  },
  {
    id: 4,
    placa: "JKL-3456",
    modelo: "Argo",
    marca: "Fiat",
    ano: 2022,
    cor: "Vermelho",
    cliente: "Ana Costa",
    km: 15000,
  },
];

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>(veiculosData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [novoVeiculo, setNovoVeiculo] = useState({
    placa: "",
    modelo: "",
    marca: "",
    ano: "",
    cor: "",
    cliente: "",
    km: "",
  });

  const filteredVeiculos = veiculos.filter(
    (veiculo) =>
      veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVeiculo = () => {
    if (!novoVeiculo.placa || !novoVeiculo.modelo) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos placa e modelo",
        variant: "destructive",
      });
      return;
    }

    const newVeiculo: Veiculo = {
      id: veiculos.length + 1,
      placa: novoVeiculo.placa,
      modelo: novoVeiculo.modelo,
      marca: novoVeiculo.marca,
      ano: parseInt(novoVeiculo.ano) || new Date().getFullYear(),
      cor: novoVeiculo.cor,
      cliente: novoVeiculo.cliente,
      km: parseInt(novoVeiculo.km) || 0,
    };

    setVeiculos([...veiculos, newVeiculo]);
    setNovoVeiculo({
      placa: "",
      modelo: "",
      marca: "",
      ano: "",
      cor: "",
      cliente: "",
      km: "",
    });
    setIsOpen(false);

    toast({
      title: "Veículo adicionado",
      description: `${newVeiculo.marca} ${newVeiculo.modelo} foi adicionado com sucesso!`,
    });
  };

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

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                      value={novoVeiculo.placa}
                      onChange={(e) =>
                        setNovoVeiculo({
                          ...novoVeiculo,
                          placa: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="ABC-1234"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ano">Ano</Label>
                    <Input
                      id="ano"
                      type="number"
                      value={novoVeiculo.ano}
                      onChange={(e) =>
                        setNovoVeiculo({ ...novoVeiculo, ano: e.target.value })
                      }
                      placeholder="2024"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      value={novoVeiculo.marca}
                      onChange={(e) =>
                        setNovoVeiculo({ ...novoVeiculo, marca: e.target.value })
                      }
                      placeholder="Honda"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="modelo">Modelo *</Label>
                    <Input
                      id="modelo"
                      value={novoVeiculo.modelo}
                      onChange={(e) =>
                        setNovoVeiculo({
                          ...novoVeiculo,
                          modelo: e.target.value,
                        })
                      }
                      placeholder="Civic"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cor">Cor</Label>
                    <Input
                      id="cor"
                      value={novoVeiculo.cor}
                      onChange={(e) =>
                        setNovoVeiculo({ ...novoVeiculo, cor: e.target.value })
                      }
                      placeholder="Prata"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="km">Quilometragem</Label>
                    <Input
                      id="km"
                      type="number"
                      value={novoVeiculo.km}
                      onChange={(e) =>
                        setNovoVeiculo({ ...novoVeiculo, km: e.target.value })
                      }
                      placeholder="45000"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    value={novoVeiculo.cliente}
                    onChange={(e) =>
                      setNovoVeiculo({ ...novoVeiculo, cliente: e.target.value })
                    }
                    placeholder="Nome do cliente"
                  />
                </div>
                <Button onClick={handleAddVeiculo} className="mt-2">
                  Adicionar Veículo
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
                        <div className="font-medium">{veiculo.marca}</div>
                        <div className="text-sm text-muted-foreground">
                          {veiculo.modelo}
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
                      {veiculo.cliente}
                    </span>
                  </TableCell>
                  <TableCell>
                    {veiculo.km.toLocaleString("pt-BR")} km
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-destructive" />
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
