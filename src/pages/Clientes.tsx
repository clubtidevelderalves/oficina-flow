import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Phone, Mail, Car, Edit, Trash2, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "../Service/api";
import { formatCPF, formatPhone } from "@/lib/utils";

interface Cliente {
  id: number;
  nome: string;
  email: string | null;
  fone: string | null;
  cpf: string;
  ativo: number;
  veiculos?: number;
  ultimoServico?: string;
}

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<Cliente | null>(null);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    fone: "",
    cpf: "",
    ativo: 1,
  });

  const fetchClientes = async () => {
    try {
      const data = await api.get("/clientes");
      setClientes(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter(
    (cliente) =>
    (cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cliente.fone && cliente.fone.includes(searchTerm)) ||
      cliente.cpf.includes(searchTerm))
  );

  const handleAddCliente = async () => {
    if (!formData.nome || !formData.cpf) {
      toast({
        title: "Erro",
        description: "Nome e CPF são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newCliente = await api.post("/clientes", formData);
      setClientes([...clientes, newCliente]);
      setFormData({ nome: "", email: "", fone: "", cpf: "", ativo: 1 });
      setIsOpen(false);
      toast({
        title: "Cliente adicionado",
        description: `${newCliente.nome} foi adicionado com sucesso!`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar cliente.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email || "",
      fone: cliente.fone || "",
      cpf: cliente.cpf,
      ativo: cliente.ativo,
    });
    setIsEditOpen(true);
  };

  const handleUpdateCliente = async () => {
    if (!currentCliente) return;

    try {
      const updatedCliente = await api.put(`/clientes/${currentCliente.id}`, formData);
      setClientes(clientes.map((c) => (c.id === currentCliente.id ? updatedCliente : c)));
      setIsEditOpen(false);
      setCurrentCliente(null);
      setFormData({ nome: "", email: "", fone: "", cpf: "", ativo: 1 });
      toast({
        title: "Cliente atualizado",
        description: "Dados do cliente atualizados com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setIsDeleteOpen(true);
  };

  const confirmDeleteCliente = async () => {
    if (!clienteToDelete) return;

    const newStatus = clienteToDelete.ativo === 1 ? 0 : 1;
    const actionText = newStatus === 1 ? "restaurado" : "inativado";

    try {
      // Instead of DELETE, we update the client with the new status
      const updatedCliente = { ...clienteToDelete, ativo: newStatus };
      await api.put(`/clientes/${clienteToDelete.id}`, updatedCliente);

      setClientes(clientes.map((c) => c.id === clienteToDelete.id ? { ...c, ativo: newStatus } : c));

      toast({
        title: `Cliente ${actionText}`,
        description: `O cliente foi ${actionText} com sucesso.`,
      });
      setIsDeleteOpen(false);
      setClienteToDelete(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: `Erro ao ${newStatus === 1 ? "restaurar" : "inativar"} cliente.`,
        variant: "destructive",
      });
    }
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
              <Button onClick={() => setFormData({ nome: "", email: "", fone: "", cpf: "", ativo: 1 })}>
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
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fone">Telefone</Label>
                  <Input
                    id="fone"
                    value={formData.fone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fone: e.target.value,
                      })
                    }
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) =>
                      setFormData({ ...formData, cpf: e.target.value })
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo === 1}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked ? 1 : 0 })}
                  />
                  <Label htmlFor="ativo">Ativo</Label>
                </div>
                <Button onClick={handleAddCliente} className="mt-2">
                  Adicionar Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Cliente</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-nome">Nome *</Label>
                  <Input
                    id="edit-nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-fone">Telefone</Label>
                  <Input
                    id="edit-fone"
                    value={formData.fone}
                    onChange={(e) => setFormData({ ...formData, fone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-cpf">CPF *</Label>
                  <Input
                    id="edit-cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-ativo"
                    checked={formData.ativo === 1}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked ? 1 : 0 })}
                  />
                  <Label htmlFor="edit-ativo">Ativo</Label>
                </div>
                <Button onClick={handleUpdateCliente} className="mt-2">
                  Salvar Alterações
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center">
                  {clienteToDelete?.ativo === 1 ? "Inativar Cliente" : "Restaurar Cliente"}
                </DialogTitle>
                <DialogDescription className="text-center">
                  Tem certeza que deseja {clienteToDelete?.ativo === 1 ? "inativar" : "restaurar"} o cliente <strong>{clienteToDelete?.nome}</strong>?
                  <br />
                  {clienteToDelete?.ativo === 1
                    ? "O cliente não aparecerá mais como ativo."
                    : "O cliente voltará a ser exibido como ativo."}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center gap-2">
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  variant={clienteToDelete?.ativo === 1 ? "destructive" : "default"}
                  onClick={confirmDeleteCliente}
                >
                  {clienteToDelete?.ativo === 1 ? "Inativar" : "Restaurar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead>Cliente</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Fone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ativo</TableHead>
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
                  <TableCell className="font-mono text-sm">
                    {formatCPF(cliente.cpf)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="w-3 h-3" />
                      {cliente.fone ? formatPhone(cliente.fone) : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {cliente.email || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cliente.ativo === 1 ? "default" : "destructive"}>
                      {cliente.ativo === 1 ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(cliente)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(cliente)}>
                        {cliente.ativo === 1 ? (
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
    </MainLayout >
  );
};
export default Clientes;
