import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { supabase } from "@/lib/supabase";

const recoverySchema = z.object({
  email: z.string().min(1, "El correo es requerido").email("Formato de correo inválido"),
});

type RecoveryFormValues = z.infer<typeof recoverySchema>;

const RecoveryPage = () => {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RecoveryFormValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: RecoveryFormValues) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/login`, 
      });

      if (error) {
        console.error("Error al enviar recuperación:", error);
        // Opcional: si es por rate limit podemos mostrarlo, de lo contrario ocultamos para evitar enumeración.
      }
      
      // Siempre mostramos éxito para evitar ataques de enumeración (CWE-203)
      setSent(true);
      toast.success("Correo de recuperación enviado");
    } catch (err) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
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
                  Hemos enviado un enlace de recuperación a <strong>{getValues("email")}</strong>
                </p>
                <Button variant="outline" onClick={() => navigate("/login")} className="w-full">
                  Volver al login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email ? 'text-destructive' : 'text-muted-foreground'}`} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      {...register("email")}
                      className={`pl-10 ${errors.email ? 'ring-2 ring-destructive bg-destructive/10' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-destructive text-xs font-bold mt-1 px-1">{errors.email.message}</p>}
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
