import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const RecoveryPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Ingresa tu correo electrónico");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Correo de recuperación enviado");
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-accent blur-3xl animate-float" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al login
        </button>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <img src={logo} alt="LideraMina" className="mx-auto w-14 h-14 rounded-xl object-contain mb-4" />
            <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
            <CardDescription>
              {sent
                ? "Revisa tu bandeja de entrada"
                : "Te enviaremos un enlace para restablecer tu contraseña"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-4">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <p className="text-muted-foreground text-sm mb-6">
                  Hemos enviado un enlace de recuperación a <strong>{email}</strong>
                </p>
                <Button variant="outline" onClick={() => navigate("/login")} className="w-full">
                  Volver al login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRecovery} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar enlace"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecoveryPage;
