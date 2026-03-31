import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, User, Plus, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PresentationPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
      // Actualizar el input file por si acaso
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !fileName) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa el nombre y selecciona un archivo.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    // Simular progreso de subida
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simular espera final
    await new Promise((resolve) => setTimeout(resolve, 2500));
    clearInterval(interval);
    setUploadProgress(100);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);

    toast({
      title: "¡Presentación guardada!",
      description: `Se ha subido correctamente "${formData.name}".`,
    });

    // Resetear formulario
    setFormData({ name: "", description: "" });
    setFileName(null);
    setUploadProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Nueva Presentación</h1>
          <p className="text-muted-foreground mt-2">
            Agregue nuevos materiales al repositorio del programa.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Sistema en línea
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario Section */}
        <Card className="md:col-span-2 border-border/40 bg-card/60 backdrop-blur-sm shadow-xl relative overflow-hidden">
          {isSubmitting && (
            <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
              <div className="w-full max-w-md space-y-6 text-center">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Subiendo Material...</h3>
                  <p className="text-sm text-muted-foreground">Procesando archivo: {fileName}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span>Progreso</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2 bg-primary/10" />
                </div>
                <p className="text-xs text-muted-foreground italic">Por favor, no cierres esta ventana</p>
              </div>
            </div>
          )}

          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Detalles del Material
            </CardTitle>
            <CardDescription>
              Complete la información para identificar el archivo correctamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Nombre de la Presentación
              </Label>
              <Input
                id="name"
                placeholder="Ej. Guía de Liderazgo 2024"
                className="bg-background/50 border-border/50 focus:border-primary transition-all pr-10"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Descripción (Opcional)
              </Label>
              <Textarea
                id="description"
                placeholder="Breve descripción del contenido..."
                className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary transition-all resize-none"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-4 border-t border-border/40">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="gap-2 px-8 py-6 text-base font-semibold shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Guardar Material
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Upload Section */}
        <div className="space-y-6">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "relative border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden",
              isDragging 
                ? "border-primary bg-primary/5 scale-[1.02] shadow-2xl" 
                : fileName 
                  ? "border-emerald-500/40 bg-emerald-500/5" 
                  : "border-border/60 bg-muted/30 hover:bg-muted/50 hover:border-primary/40"
            )}
          >
            <Card className="border-none bg-transparent shadow-none">
              <CardContent className="pt-12 pb-10 flex flex-col items-center justify-center text-center px-4">
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500",
                  isDragging 
                    ? "bg-primary text-white rotate-12 scale-110" 
                    : fileName 
                      ? "bg-emerald-500/20 text-emerald-600" 
                      : "bg-primary/10 text-primary"
                )}>
                  {fileName ? (
                    <CheckCircle2 className="w-10 h-10" />
                  ) : (
                    <Upload className={cn("w-10 h-10", isDragging && "animate-bounce")} />
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground text-lg">
                    {isDragging ? "¡Suéltalo aquí!" : fileName ? "Archivo listo" : "Subir Archivo"}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-[180px] mx-auto leading-relaxed">
                    {fileName 
                      ? "Puedes cambiarlo arrastrando otro archivo o haciendo clic abajo." 
                      : "Arrastra y suelta tu archivo o haz clic para buscarlo."
                    }
                  </p>
                </div>
                
                <div className="mt-8 w-full">
                  <Label
                    htmlFor="file-upload"
                    className="w-full py-3 px-4 rounded-xl border border-primary/20 bg-background text-primary text-sm font-bold cursor-pointer hover:bg-primary hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {fileName ? "Cambiar archivo" : "Seleccionar"}
                  </Label>
                  <input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.ppt,.pptx,.doc,.docx,image/*"
                  />
                </div>
                
                {!fileName && (
                  <div className="mt-6 flex gap-2 justify-center opacity-50 grayscale">
                    <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center text-[8px] font-bold text-red-600">PDF</div>
                    <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-[8px] font-bold text-orange-600">PPT</div>
                    <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-600">DOC</div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Glow effect on drag */}
            <div className={cn(
              "absolute inset-0 bg-primary/10 opacity-0 pointer-events-none transition-opacity",
              isDragging && "opacity-100"
            )} />
          </div>

          {fileName && !isSubmitting && (
            <Card className="border-emerald-500/20 bg-emerald-500/5 animate-in zoom-in-95 duration-300 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-foreground truncate">{fileName}</p>
                    <button 
                      onClick={() => setFileName(null)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Listo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        
        </div>
      </div>
    </div>
  );
};

export default PresentationPage;
