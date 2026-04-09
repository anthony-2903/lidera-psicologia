import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect } from "react";

const LoginPage = () => {
  const { session, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session && profile && !authLoading) {
      if (profile.is_active === false) {
        toast.error("Tu cuenta está desactivada. Contacta al administrador.");
        return;
      }

      // Si tiene permiso para el dashboard, ir ahí. Si no, a su primera vista permitida.
      const allowedViews = profile.allowed_views || [];
      if (allowedViews.includes("/app/dashboard")) {
        navigate("/app/dashboard");
      } else if (allowedViews.length > 0) {
        navigate(allowedViews[0]);
      } else {
        toast.error("No tienes vistas permitidas. Contacta al administrador.");
      }
    }
  }, [session, profile, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Credenciales incorrectas o usuario no encontrado");
      } else if (data.session) {
        toast.success("Inicio de sesión exitoso");
        // El useEffect se encargará de la redirección basándose en el profile
      }
    } catch (err) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent blur-3xl animate-float" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-info blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in space-y-6 md:space-y-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors text-sm font-bold bg-white/10 px-4 py-2 rounded-full w-fit backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>

        <Card className="shadow-2xl border-0 overflow-hidden rounded-2xl md:rounded-3xl">
          <CardHeader className="text-center pb-2 pt-8 md:pt-12">
            <img src={logo} alt="LideraMina" className="mx-auto w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl object-contain mb-6 shadow-xl" />
            <CardTitle className="text-2xl md:text-3xl font-black tracking-tighter">Bienvenido</CardTitle>
            <CardDescription className="font-bold text-muted-foreground/60">Ingresa tus credenciales para acceder</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-10 pt-4 md:pt-6">
            <form onSubmit={handleLogin} className="space-y-5 md:space-y-6 text-left">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-black uppercase text-[10px] tracking-widest text-primary">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 rounded-xl md:rounded-2xl bg-muted/30 border-0 focus-visible:ring-primary shadow-inner font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-black uppercase text-[10px] tracking-widest text-primary">Contraseña</Label>
                  <button
                    type="button"
                    onClick={() => navigate("/recovery")}
                    className="text-[10px] font-black uppercase text-accent hover:underline tracking-tighter"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-14 rounded-xl md:rounded-2xl bg-muted/30 border-0 focus-visible:ring-primary shadow-inner font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-14 md:h-16 rounded-xl md:rounded-2xl gradient-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all" disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
