import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wrench, Gauge, Key, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast({
                title: "Acesso Negado",
                description: "Credenciais incompletas. Verifique e tente novamente.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            toast({
                title: "Acesso Autorizado",
                description: "Bem-vindo ao cockpit, Operador.",
                className: "bg-green-600 text-white border-none",
            });
            navigate("/");
        } catch (error) {
            toast({
                title: "Falha na Autenticação",
                description: "As credenciais fornecidas não conferem com nossos registros.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#09090b] text-slate-100 overflow-hidden font-sans">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-20">

                {/* Background ambient glow */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[100px]" />
                </div>

                <div className={`w-full max-w-md space-y-8 transition-all duration-700 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl mb-4 group hover:scale-105 transition-transform duration-300">
                            <Wrench className="w-8 h-8 text-blue-500 group-hover:text-amber-500 transition-colors duration-300" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Oficina Flow
                        </h1>
                        <p className="text-slate-400 text-lg">Cockpit de Gestão Premium</p>
                    </div>

                    {/* Form Card */}
                    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 opacity-75" />

                        <CardHeader className="space-y-1">
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-amber-500" />
                                Credenciais de Acesso
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Identifique-se para iniciar os motores
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2 group/input">
                                    <Label htmlFor="email" className="text-slate-300">Email Corporativo</Label>
                                    <div className="relative">
                                        <Gauge className="absolute left-3 top-3 h-5 w-5 text-slate-500 group-focus-within/input:text-blue-500 transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="nome@oficina.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="pl-10 bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20 transition-all h-11"
                                            autoComplete="username"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group/input">
                                    <Label htmlFor="password" className="text-slate-300">Chave de Segurança</Label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-3 h-5 w-5 text-slate-500 group-focus-within/input:text-amber-500 transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pl-10 bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-amber-500 focus:ring-amber-500/20 transition-all h-11"
                                            autoComplete="current-password"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold tracking-wide shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all duration-300 mt-6"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Autenticando...
                                        </>
                                    ) : (
                                        "INICIAR SESSÃO"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="justify-center border-t border-slate-800/50 pt-6">
                            <p className="text-xs text-slate-500 text-center">
                                Sistema protegido por criptografia de ponta a ponta. <br />
                                <span className="text-slate-600">v2.0.4 Enterprise Build</span>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Right Side - Image/Art */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#09090b] z-10" />
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay z-10" />

                {/* Image Container with Zoom effect */}
                <div
                    className={`absolute inset-0 transition-transform duration-[2000ms] ease-out ${mounted ? 'scale-105' : 'scale-110'}`}
                    style={{
                        backgroundImage: "url('/images/login-bg.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Content Overlay */}
                <div className="absolute bottom-12 right-12 z-20 text-right max-w-lg">
                    <h2 className={`text-3xl font-bold text-white mb-2 transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Performance Máxima
                    </h2>
                    <p className={`text-slate-300 text-lg transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Gerencie sua oficina com a precisão de um motor de Fórmula 1 e a robustez de um utilitário.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
