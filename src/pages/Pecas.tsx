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
import { Plus, Search, Package, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Peca {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  marca: string;
  quantidade: number;
  minimo: number;
  precoCusto: number;
  precoVenda: number;
}

const pecasData: Peca[] = [
  {
    id: 1,
    codigo: "FLT-001",
    nome: "Filtro de Óleo",
    categoria: "Filtros",
    marca: "Mann Filter",
    quantidade: 25,
    minimo: 10,
    precoCusto: 35,
    precoVenda: 55,
  },
  {
    id: 2,
    codigo: "PST-001",
    nome: "Pastilha de Freio Dianteira",
    categoria: "Freios",
    marca: "Bosch",
    quantidade: 8,
    minimo: 5,
    precoCusto: 120,
    precoVenda: 180,
  },
  {
    id: 3,
    codigo: "OLE-001",
    nome: "Óleo Motor 5W30 Sintético",
    categoria: "Lubrificantes",
    marca: "Mobil",
    quantidade: 3,
    minimo: 10,
    precoCusto: 45,
    precoVenda: 75,
  },
  {
    id: 4,
    codigo: "VEL-001",
    nome: "Vela de Ignição",
    categoria: "Ignição",
    marca: "NGK",
    quantidade: 40,
    minimo: 20,
    precoCusto: 25,
    precoVenda: 45,
  },
  {
    id: 5,
    codigo: "COR-001",
    nome: "Correia Dentada",
    categoria: "Motor",
    marca: "Gates",
    quantidade: 12,
    minimo: 5,
    precoCusto: 85,
    precoVenda: 140,
  },
];

const Pecas = () => {
  const [pecas, setPecas] = useState<Peca[]>(pecasData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [novaPeca, setNovaPeca] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    marca: "",
    quantidade: "",
    minimo: "",
    precoCusto: "",
    precoVenda: "",
  });

  const filteredPecas = pecas.filter(
    (peca) =>
      peca.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peca.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peca.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPeca = () => {
    if (!novaPeca.codigo || !novaPeca.nome) {
      toast({
        title: "Erro",
        description: "Preencha código e nome da peça",
        variant: "destructive",
      });
      return;
    }

    const newPeca: Peca = {
      id: pecas.length + 1,
      codigo: novaPeca.codigo,
      nome: novaPeca.nome,
      categoria: novaPeca.categoria,
      marca: novaPeca.marca,
      quantidade: parseInt(novaPeca.quantidade) || 0,
      minimo: parseInt(novaPeca.minimo) || 5,
      precoCusto: parseFloat(novaPeca.precoCusto) || 0,
      precoVenda: parseFloat(novaPeca.precoVenda) || 0,
    };

    setPecas([...pecas, newPeca]);
    setNovaPeca({
      codigo: "",
      nome: "",
      categoria: "",
      marca: "",
      quantidade: "",
      minimo: "",
      precoCusto: "",
      precoVenda: "",
    });
    setIsOpen(false);

    toast({
      title: "Peça adicionada",
      description: `${newPeca.nome} foi adicionada ao estoque!`,
    });
  };

  const lowStock = pecas.filter((p) => p.quantidade <= p.minimo).length;

  return (
    <MainLayout title="Peças" subtitle="Controle de estoque e inventário">
      <div className="space-y-6">
        {/* Alert Banner */}
        {lowStock > 0 && (
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-lg bg-warning flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Atenção: Estoque Baixo
              </p>
              <p className="text-sm text-muted-foreground">
                {lowStock} {lowStock === 1 ? "item está" : "itens estão"} abaixo
                do estoque mínimo
              </p>
            </div>
          </div>
        )}

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, nome ou categoria..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Peça
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Peça</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="codigo">Código *</Label>
                    <Input
                      id="codigo"
                      value={novaPeca.codigo}
                      onChange={(e) =>
                        setNovaPeca({
                          ...novaPeca,
                          codigo: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="FLT-001"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Input
                      id="categoria"
                      value={novaPeca.categoria}
                      onChange={(e) =>
                        setNovaPeca({ ...novaPeca, categoria: e.target.value })
                      }
                      placeholder="Filtros"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome da Peça *</Label>
                  <Input
                    id="nome"
                    value={novaPeca.nome}
                    onChange={(e) =>
                      setNovaPeca({ ...novaPeca, nome: e.target.value })
                    }
                    placeholder="Filtro de Óleo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input
                    id="marca"
                    value={novaPeca.marca}
                    onChange={(e) =>
                      setNovaPeca({ ...novaPeca, marca: e.target.value })
                    }
                    placeholder="Mann Filter"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={novaPeca.quantidade}
                      onChange={(e) =>
                        setNovaPeca({ ...novaPeca, quantidade: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minimo">Estoque Mínimo</Label>
                    <Input
                      id="minimo"
                      type="number"
                      value={novaPeca.minimo}
                      onChange={(e) =>
                        setNovaPeca({ ...novaPeca, minimo: e.target.value })
                      }
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="precoCusto">Preço de Custo</Label>
                    <Input
                      id="precoCusto"
                      type="number"
                      step="0.01"
                      value={novaPeca.precoCusto}
                      onChange={(e) =>
                        setNovaPeca({ ...novaPeca, precoCusto: e.target.value })
                      }
                      placeholder="0,00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="precoVenda">Preço de Venda</Label>
                    <Input
                      id="precoVenda"
                      type="number"
                      step="0.01"
                      value={novaPeca.precoVenda}
                      onChange={(e) =>
                        setNovaPeca({ ...novaPeca, precoVenda: e.target.value })
                      }
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <Button onClick={handleAddPeca} className="mt-2">
                  Adicionar Peça
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
                <TableHead>Peça</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead className="text-center">Estoque</TableHead>
                <TableHead>Preço Custo</TableHead>
                <TableHead>Preço Venda</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPecas.map((peca) => {
                const isLowStock = peca.quantidade <= peca.minimo;
                return (
                  <TableRow
                    key={peca.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium">{peca.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {peca.codigo}
                      </Badge>
                    </TableCell>
                    <TableCell>{peca.categoria}</TableCell>
                    <TableCell>{peca.marca}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={isLowStock ? "warning" : "success"}
                        className="min-w-[60px] justify-center"
                      >
                        {isLowStock && (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {peca.quantidade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      R$ {peca.precoCusto.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold text-success">
                      R$ {peca.precoVenda.toFixed(2)}
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
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pecas;
