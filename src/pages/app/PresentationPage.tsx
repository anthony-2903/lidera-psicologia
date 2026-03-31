import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, User, Plus, Save, Loader2, CheckCircle2, AlertCircle, ExternalLink, Trash2, Eye, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface UploadedMaterial {
  id: string;
  name: string;
  description: string;
  url: string;
  date: string;
  type: string;
}

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
  const [uploadedMaterials, setUploadedMaterials] = useState<UploadedMaterial[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const CLOUD_NAME = "dyz1ney8m"; // Tu Cloud Name configurado
  const UPLOAD_PRESET = "ml_default"; // Tu Unsigned Upload Preset configurado

  // Cargar de localStorage al inicio
  useEffect(() => {
    const saved = localStorage.getItem("leadpath_materials");
    if (saved) {
      setUploadedMaterials(JSON.parse(saved));
    }
  }, []);

  // Guardar en localStorage cuando cambie la lista
  useEffect(() => {
    localStorage.setItem("leadpath_materials", JSON.stringify(uploadedMaterials));
  }, [uploadedMaterials]);

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
    const file = fileInputRef.current?.files?.[0];

    if (!formData.name || !file) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa el nombre y selecciona un archivo.",
        variant: "destructive",
      });
      return;
    }


    setIsSubmitting(true);
    setUploadProgress(0);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setIsSubmitting(false);
      const response = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        const newMaterial: UploadedMaterial = {
          id: response.public_id,
          name: formData.name,
          description: formData.description,
          url: response.secure_url,
          date: new Date().toLocaleDateString(),
          type: response.format || "file",
        };

        setUploadedMaterials(prev => [newMaterial, ...prev]);

        toast({
          title: "¡Presentación guardada!",
          description: `Se ha subido correctamente "${formData.name}".`,
        });
        // Resetear formulario
        setFormData({ name: "", description: "" });
        setFileName(null);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast({
          title: "Error en la subida",
          description: response.error?.message || "Ocurrió un problema al subir a Cloudinary.",
          variant: "destructive",
        });
      }
    };

    xhr.onerror = () => {
      setIsSubmitting(false);
      toast({
        title: "Error de red",
        description: "No se pudo conectar con el servidor de Cloudinary.",
        variant: "destructive",
      });
    };

    xhr.send(data);
  };

  const deleteMaterial = (id: string) => {
    setUploadedMaterials(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Material eliminado",
      description: "El registro ha sido borrado de tu repositorio local.",
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Presentaciones</h1>
          <p className="text-muted-foreground mt-1">Carga y administra materiales del repositorio.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 px-4 py-2 rounded-xl border border-border/40 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          Cloudinary
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado Izquierdo: Formulario y Upload (Compacto) */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-2xl relative overflow-hidden ring-1 ring-white/10">
            {isSubmitting && (
              <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
                <div className="w-full max-w-md space-y-6 text-center">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground">Subiendo a la Nube...</h3>
                    <p className="text-xs text-muted-foreground truncate max-w-full italic px-4">{fileName}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-primary">
                      <span>Progreso</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1.5 bg-primary/10" />
                  </div>
                </div>
              </div>
            )}

            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Plus className="w-4 h-4" />
                </div>
                Nuevo Material
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                    <User className="w-3 h-3" /> Nombre
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ej. Guía de Liderazgo"
                    className="bg-background/40 border-border/40 h-11 focus:ring-primary/20"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                    <Upload className="w-3 h-3" /> Archivo Seleccionado
                  </Label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "h-11 px-4 rounded-lg flex items-center justify-between cursor-pointer border transition-all text-sm font-medium",
                      fileName 
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600" 
                        : "bg-background/40 border-border/40 text-muted-foreground hover:bg-background/60"
                    )}
                  >
                    <span className="truncate flex-1 pr-2">
                      {fileName || "Click para buscar..."}
                    </span>
                    {fileName ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Plus className="w-4 h-4 shrink-0" />}
                  </div>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.ppt,.pptx,.doc,.docx,image/*" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Descripción
                </Label>
                <Textarea
                  id="description"
                  placeholder="Escribe brevemente de qué trata este material..."
                  className="min-h-[80px] bg-background/40 border-border/40 resize-none h-20"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Compact Drag Zone (Only when not submitting) */}
              {!isSubmitting && (
                <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={cn(
                    "py-6 px-4 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center text-center",
                    isDragging 
                      ? "border-primary bg-primary/5 scale-[1.01]" 
                      : "border-border/40 bg-muted/20 hover:bg-muted/40"
                  )}
                >
                  <Upload className={cn("w-6 h-6 mb-2 text-muted-foreground/40", isDragging && "animate-bounce text-primary")} />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {isDragging ? "¡Suéltalo!" : "O arrastra archivos aquí"}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2 pb-6 flex justify-end">
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="gap-2 px-10 h-12 text-sm font-black shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all w-full md:w-auto"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar e Iniciar Carga
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Lado Derecho: Repositorio (Scrollable Dashboard) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-xl h-full flex flex-col max-h-[700px]">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black uppercase tracking-tight">Repositorio</CardTitle>
                    <CardDescription className="text-[10px]">Materiales disponibles</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="font-black border-primary/20 text-primary bg-primary/5 px-3 py-1">
                  {uploadedMaterials.length} Items
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1 custom-scrollbar">
              {uploadedMaterials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-10 text-center space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-muted/50 flex items-center justify-center text-muted-foreground/20 italic rotate-12">
                    <FileText className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase text-muted-foreground">Tu repositorio está vacío</h3>
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-[200px]">
                      Sube tu primera presentación y aparecerá listada aquí automáticamente.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {uploadedMaterials.map((material) => (
                    <div 
                      key={material.id} 
                      className="p-4 hover:bg-muted/30 transition-all group flex items-start gap-4 animate-in fade-in slide-in-from-right-4 duration-300"
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white/5 group-hover:scale-105 transition-transform",
                        material.type === 'pdf' ? "bg-red-500/10 text-red-600" :
                        material.type === 'ppt' || material.type === 'pptx' ? "bg-orange-500/10 text-orange-600" :
                        "bg-blue-500/10 text-blue-600"
                      )}>
                        {material.type === 'pdf' ? <FileText className="w-6 h-6" /> : <PresentationIcon className="w-6 h-6" />}
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-black uppercase truncate tracking-tight">{material.name}</h4>
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 shrink-0">
                            {material.date}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mb-2 italic">
                          "{material.description || "Sin descripción"}"
                        </p>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-7 text-[9px] font-black uppercase flex-1 rounded-lg gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                            onClick={() => window.open(material.url, '_blank')}
                          >
                            <Eye className="w-3 h-3" /> Ver
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteMaterial(material.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {uploadedMaterials.length > 0 && (
              <CardFooter className="p-4 border-t border-border/40 bg-muted/5">
                <p className="text-[8px] uppercase tracking-tighter font-bold text-muted-foreground/50 text-center w-full">
                  Archivos almacenados localmente en este navegador
                </p>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

const PresentationIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 3h20" />
    <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
    <path d="m12 16 5 5" />
    <path d="m12 16-5 5" />
  </svg>
);

export default PresentationPage;
