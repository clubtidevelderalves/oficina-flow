import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Clientes from "./pages/Clientes";
import Veiculos from "./pages/Veiculos";
import Servicos from "./pages/Servicos";
import Pecas from "./pages/Pecas";
import Vendas from "./pages/Vendas";
import Configuracoes from "./pages/Configuracoes";
import Marcas from "./pages/Marcas";
import Modelos from "./pages/Modelos";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/veiculos" element={<Veiculos />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/pecas" element={<Pecas />} />
              <Route path="/vendas" element={<Vendas />} />
              <Route path="/marcas" element={<Marcas />} />
              <Route path="/modelos" element={<Modelos />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
