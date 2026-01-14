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
import { Plus, Search, Edit, Trash2, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "../Service/api";

interface Marca {
    id: number;
    marca: string;
    ativo: number;
}

const Marcas = () => {
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentMarca, setCurrentMarca] = useState<Marca | null>(null);
    const [marcaToDelete, setMarcaToDelete] = useState<Marca | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        marca: "",
        ativo: 1,
    });

    const fetchMarcas = async () => {
        try {
            const data = await api.get("/marcas");
            setMarcas(data);
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao carregar marcas.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchMarcas();
    }, []);

    const filteredMarcas = marcas.filter((marca) =>
        marca.marca.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddMarca = async () => {
        if (!formData.marca) {
            toast({
                title: "Erro",
                description: "Nome da marca é obrigatório.",
                variant: "destructive",
            });
            return;
        }

        try {
            const newMarca = await api.post("/marcas", formData);
            setMarcas([...marcas, newMarca]);
            setFormData({ marca: "", ativo: 1 });
            setIsOpen(false);
            toast({
                title: "Marca adicionada",
                description: `${newMarca.marca} foi adicionada com sucesso!`,
            });
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Erro",
                description: error.message || "Erro ao adicionar marca.",
                variant: "destructive",
            });
        }
    };

    const handleEditClick = (marca: Marca) => {
        setCurrentMarca(marca);
        setFormData({
            marca: marca.marca,
            ativo: marca.ativo,
        });
        setIsEditOpen(true);
    };

    const handleUpdateMarca = async () => {
        if (!currentMarca) return;

        try {
            const updatedMarca = await api.put(`/marcas/${currentMarca.id}`, formData);
            setMarcas(marcas.map((m) => (m.id === currentMarca.id ? updatedMarca : m)));
            setIsEditOpen(false);
            setCurrentMarca(null);
            setFormData({ marca: "", ativo: 1 });
            toast({
                title: "Marca atualizada",
                description: "Dados da marca atualizados com sucesso!",
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao atualizar marca.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteClick = (marca: Marca) => {
        setMarcaToDelete(marca);
        setIsDeleteOpen(true);
    };

    const confirmDeleteMarca = async () => {
        if (!marcaToDelete) return;

        const newStatus = marcaToDelete.ativo === 1 ? 0 : 1;
        const actionText = newStatus === 1 ? "restaurada" : "inativada";

        try {
            const updatedMarca = { ...marcaToDelete, ativo: newStatus };
            await api.put(`/marcas/${marcaToDelete.id}`, updatedMarca);

            setMarcas(marcas.map((m) => m.id === marcaToDelete.id ? { ...m, ativo: newStatus } : m));

            toast({
                title: `Marca ${actionText}`,
                description: `A marca foi ${actionText} com sucesso.`,
            });
            setIsDeleteOpen(false);
            setMarcaToDelete(null);
        } catch (error) {
            toast({
                title: "Erro",
                description: `Erro ao ${newStatus === 1 ? "restaurar" : "inativar"} marca.`,
                variant: "destructive",
            });
        }
    };

    return (
        <MainLayout title="Marcas" subtitle="Gerencie as marcas de veículos">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar marcas..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setFormData({ marca: "", ativo: 1 })}>
                                <Plus className="w-4 h-4 mr-2" />
                                Nova Marca
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Adicionar Nova Marca</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="marca">Nome da Marca *</Label>
                                    <Input
                                        id="marca"
                                        value={formData.marca}
                                        onChange={(e) =>
                                            setFormData({ ...formData, marca: e.target.value })
                                        }
                                        placeholder="Ex: Fiat, Volkswagen..."
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
                                <Button onClick={handleAddMarca} className="mt-2">
                                    Adicionar Marca
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Editar Marca</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-marca">Nome da Marca *</Label>
                                    <Input
                                        id="edit-marca"
                                        value={formData.marca}
                                        onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                                        placeholder="Ex: Fiat, Volkswagen..."
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
                                <Button onClick={handleUpdateMarca} className="mt-2">
                                    Salvar Alterações
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-center">
                                    {marcaToDelete?.ativo === 1 ? "Inativar Marca" : "Restaurar Marca"}
                                </DialogTitle>
                                <DialogDescription className="text-center">
                                    Tem certeza que deseja {marcaToDelete?.ativo === 1 ? "inativar" : "restaurar"} a marca <strong>{marcaToDelete?.marca}</strong>?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-center gap-2">
                                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    variant={marcaToDelete?.ativo === 1 ? "destructive" : "default"}
                                    onClick={confirmDeleteMarca}
                                >
                                    {marcaToDelete?.ativo === 1 ? "Inativar" : "Restaurar"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary/30">
                                <TableHead>Marca</TableHead>
                                <TableHead>Ativo</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMarcas.map((marca) => (
                                <TableRow
                                    key={marca.id}
                                    className="hover:bg-secondary/20 transition-colors"
                                >
                                    <TableCell>
                                        <div className="font-medium">{marca.marca}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={marca.ativo === 1 ? "default" : "destructive"}>
                                            {marca.ativo === 1 ? "Ativo" : "Inativo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(marca)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(marca)}>
                                                {marca.ativo === 1 ? (
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
export default Marcas;
