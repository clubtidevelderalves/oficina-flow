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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "../Service/api";

interface Marca {
    id: number;
    marca: string;
}

interface Modelo {
    id: number;
    modelo: string;
    idmarca: number;
    ativo: number;
    marca?: Marca;
}

const Modelos = () => {
    const [modelos, setModelos] = useState<Modelo[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentModelo, setCurrentModelo] = useState<Modelo | null>(null);
    const [modeloToDelete, setModeloToDelete] = useState<Modelo | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        modelo: "",
        idmarca: "",
        ativo: 1,
    });

    const fetchModelos = async () => {
        try {
            const data = await api.get("/modelos");
            setModelos(data);
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao carregar modelos.",
                variant: "destructive",
            });
        }
    };

    const fetchMarcas = async () => {
        try {
            const data = await api.get("/marcas");
            setMarcas(data);
        } catch (error) {
            console.error("Erro ao carregar marcas", error);
        }
    };

    useEffect(() => {
        fetchModelos();
        fetchMarcas();
    }, []);

    const filteredModelos = modelos.filter((modelo) =>
        modelo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (modelo.marca?.marca && modelo.marca.marca.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddModelo = async () => {
        if (!formData.modelo || !formData.idmarca) {
            toast({
                title: "Erro",
                description: "Nome do modelo e a marca são obrigatórios.",
                variant: "destructive",
            });
            return;
        }

        try {
            const newModelo = await api.post("/modelos", formData);
            // Refresh to get relationship or append manually if response has it
            fetchModelos();
            setFormData({ modelo: "", idmarca: "", ativo: 1 });
            setIsOpen(false);
            toast({
                title: "Modelo adicionado",
                description: `${newModelo.modelo} foi adicionado com sucesso!`,
            });
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Erro",
                description: error.message || "Erro ao adicionar modelo.",
                variant: "destructive",
            });
        }
    };

    const handleEditClick = (modelo: Modelo) => {
        setCurrentModelo(modelo);
        setFormData({
            modelo: modelo.modelo,
            idmarca: modelo.idmarca.toString(),
            ativo: modelo.ativo,
        });
        setIsEditOpen(true);
    };

    const handleUpdateModelo = async () => {
        if (!currentModelo) return;

        try {
            const updatedModelo = await api.put(`/modelos/${currentModelo.id}`, formData);
            // Refreshing whole list to simplify simple relationship update
            fetchModelos();
            setIsEditOpen(false);
            setCurrentModelo(null);
            setFormData({ modelo: "", idmarca: "", ativo: 1 });
            toast({
                title: "Modelo atualizado",
                description: "Dados do modelo atualizados com sucesso!",
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao atualizar modelo.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteClick = (modelo: Modelo) => {
        setModeloToDelete(modelo);
        setIsDeleteOpen(true);
    };

    const confirmDeleteModelo = async () => {
        if (!modeloToDelete) return;

        const newStatus = modeloToDelete.ativo === 1 ? 0 : 1;
        const actionText = newStatus === 1 ? "restaurado" : "inativado";

        try {
            const updatedModelo = { ...modeloToDelete, ativo: newStatus };
            await api.put(`/modelos/${modeloToDelete.id}`, updatedModelo);

            // Optimistic update might be tricky with deep objects, but let's try shallow or full fetch
            // For simplicity/safety with relationships, full fetch is acceptable or careful map
            setModelos(modelos.map((m) => m.id === modeloToDelete.id ? { ...m, ativo: newStatus } : m));

            toast({
                title: `Modelo ${actionText}`,
                description: `O modelo foi ${actionText} com sucesso.`,
            });
            setIsDeleteOpen(false);
            setModeloToDelete(null);
        } catch (error) {
            toast({
                title: "Erro",
                description: `Erro ao ${newStatus === 1 ? "restaurar" : "inativar"} modelo.`,
                variant: "destructive",
            });
        }
    };

    return (
        <MainLayout title="Modelos" subtitle="Gerencie os modelos de veículos">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar modelos ou marcas..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setFormData({ modelo: "", idmarca: "", ativo: 1 })}>
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Modelo
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Adicionar Novo Modelo</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="idmarca">Marca *</Label>
                                    <Select
                                        value={formData.idmarca}
                                        onValueChange={(value) => setFormData({ ...formData, idmarca: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a marca" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {marcas.map((marca) => (
                                                <SelectItem key={marca.id} value={marca.id.toString()}>
                                                    {marca.marca}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="modelo">Nome do Modelo *</Label>
                                    <Input
                                        id="modelo"
                                        value={formData.modelo}
                                        onChange={(e) =>
                                            setFormData({ ...formData, modelo: e.target.value })
                                        }
                                        placeholder="Ex: Uno, Gol, Corolla..."
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
                                <Button onClick={handleAddModelo} className="mt-2">
                                    Adicionar Modelo
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Editar Modelo</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-idmarca">Marca *</Label>
                                    <Select
                                        value={formData.idmarca}
                                        onValueChange={(value) => setFormData({ ...formData, idmarca: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a marca" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {marcas.map((marca) => (
                                                <SelectItem key={marca.id} value={marca.id.toString()}>
                                                    {marca.marca}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-modelo">Nome do Modelo *</Label>
                                    <Input
                                        id="edit-modelo"
                                        value={formData.modelo}
                                        onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                                        placeholder="Ex: Uno, Gol, Corolla..."
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
                                <Button onClick={handleUpdateModelo} className="mt-2">
                                    Salvar Alterações
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-center">
                                    {modeloToDelete?.ativo === 1 ? "Inativar Modelo" : "Restaurar Modelo"}
                                </DialogTitle>
                                <DialogDescription className="text-center">
                                    Tem certeza que deseja {modeloToDelete?.ativo === 1 ? "inativar" : "restaurar"} o modelo <strong>{modeloToDelete?.modelo}</strong>?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-center gap-2">
                                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    variant={modeloToDelete?.ativo === 1 ? "destructive" : "default"}
                                    onClick={confirmDeleteModelo}
                                >
                                    {modeloToDelete?.ativo === 1 ? "Inativar" : "Restaurar"}
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
                                <TableHead>Modelo</TableHead>
                                <TableHead>Ativo</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredModelos.map((modelo) => (
                                <TableRow
                                    key={modelo.id}
                                    className="hover:bg-secondary/20 transition-colors"
                                >
                                    <TableCell>
                                        <div className="font-medium">{modelo.marca?.marca}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{modelo.modelo}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={modelo.ativo === 1 ? "default" : "destructive"}>
                                            {modelo.ativo === 1 ? "Ativo" : "Inativo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(modelo)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(modelo)}>
                                                {modelo.ativo === 1 ? (
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
export default Modelos;
