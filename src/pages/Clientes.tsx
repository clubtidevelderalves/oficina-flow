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
import { Plus, Search, Phone, Mail, Car, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  veiculos: number;
  ultimoServico: string;
}

const clientesData: Cliente[] = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(11) 99999-9999",
    cpf: "123.456.789-00",
    veiculos: 2,
    ultimoServico: "15/11/2024",
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria@email.com",
    telefone: "(11) 98888-8888",
    cpf: "987.654.321-00",
    veiculos: 1,
    ultimoServico: "10/11/2024",
  },
  {
    id: 3,
    nome: "Pedro Oliveira",
    email: "pedro@email.com",
    telefone: "(11) 97777-7777",
    cpf: "456.789.123-00",
    veiculos: 3,
    ultimoServico: "08/11/2024",
  },
  {
    id: 4,
    nome: "Ana Costa",
    email: "ana@email.com",
    telefone: "(11) 96666-6666",
    cpf: "789.123.456-00",
    veiculos: 1,
    ultimoServico: "05/11/2024",
  },
];

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>(clientesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  });

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cpf.includes(searchTerm)
  );

  const handleAddCliente = () => {
    if (!novoCliente.nome || !novoCliente.telefone) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos nome e telefone",
        variant: "destructive",
      });
      return;
    }

    const newCliente: Cliente = {
      id: clientes.length + 1,
      ...novoCliente,
      veiculos: 0,
      ultimoServico: "-",
    };

    setClientes([...clientes, newCliente]);
    setNovoCliente({ nome: "", email: "", telefone: "", cpf: "" });
    setIsOpen(false);

    toast({
      title: "Cliente adicionado",
      description: `${newCliente.nome} foi adicionado com sucesso!`,
    });
  };

  return (
    <MainLayout title="Clientes" subtitle="Gerencie seus clientes">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou CPF..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={novoCliente.nome}
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, nome: e.target.value })
                    }
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoCliente.email}
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={novoCliente.telefone}
                    onChange={(e) =>
                      setNovoCliente({
                        ...novoCliente,
                        telefone: e.target.value,
                      })
                    }
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={novoCliente.cpf}
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, cpf: e.target.value })
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
                <Button onClick={handleAddCliente} className="mt-2">
                  Adicionar Cliente
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
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead className="text-center">Veículos</TableHead>
                <TableHead>Último Serviço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow
                  key={cliente.id}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <TableCell>
                    <div className="font-medium">{cliente.nome}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3" />
                        {cliente.telefone}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {cliente.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {cliente.cpf}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="gap-1">
                      <Car className="w-3 h-3" />
                      {cliente.veiculos}
                    </Badge>
                  </TableCell>
                  <TableCell>{cliente.ultimoServico}</TableCell>
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

export default Clientes;
