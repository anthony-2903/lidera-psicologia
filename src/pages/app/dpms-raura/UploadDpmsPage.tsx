import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UploadCloud, FileText, CheckCircle2, Activity, ShieldCheck, Zap, Users, BarChart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import mammoth from 'mammoth';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

const QUESTIONS = [
  { id: 'q1', text: "1. ¿Cómo contribuye la seguridad integrada en las operaciones en los procesos de su área? ¿Me puede dar un ejemplo? ¿Cuál es la tarea con mayores riesgos?", type: 'text' },
  { id: 'q2', text: "2. ¿Cómo te aseguras de que tu personal esté capacitado con las competencias que requiere?", type: 'text' },
  { id: 'q3', text: "3. Piense en algo que lo hace sentir orgullo de su gestión. ¿Acciones, reconocimientos, recomendaciones?", type: 'text' },
  { id: 'q4_involucramiento', text: "4a. Efectividad: Involucramiento del líder en la formación (1-10)", type: 'number', max: 10 },
  { id: 'q4_calidad', text: "4b. Efectividad: Calidad de las capacitaciones y facilitador (1-10)", type: 'number', max: 10 },
  { id: 'q4_seguimiento', text: "4c. Efectividad: Seguimiento al proceso (1-10)", type: 'number', max: 10 },
  { id: 'q4_asistencia', text: "4d. Efectividad: Asistencia a capacitaciones de líderes (1-10)", type: 'number', max: 10 },
  { id: 'q5', text: "5. ¿En su evaluación de desempeño anual, qué aspectos de seguridad se evalúan?", type: 'text' },
  { id: 'q6_responsabilidad', text: "6a. % de responsabilidad en seguridad de la línea de mando (1-10)", type: 'number', max: 10 },
  { id: 'q6_explicacion', text: "6b. Explicación de responsabilidad en seguridad", type: 'text' },
  { id: 'q7', text: "7. ¿Cómo se asegura de que las acciones derivadas de los accidentes sean aprendidas?", type: 'text' },
  { id: 'q8', text: "8. ¿Qué significa para usted disponer de un entorno seguro y saludable?", type: 'text' },
  { id: 'q9_gestion', text: "9a. Peso (1-3): Gestión integrada", type: 'number', max: 3 },
  { id: 'q9_comportamiento', text: "9b. Peso (1-3): Comportamiento y actitudes", type: 'number', max: 3 },
  { id: 'q9_liderazgo', text: "9c. Peso (1-3): Liderazgo y supervisión", type: 'number', max: 3 },
  { id: 'q10', text: "10. Desde su rol como líder, ¿qué le preocupa del desempeño de seguridad?", type: 'text' },
  { id: 'q11', text: "11. ¿Qué acciones considera clave para que los cambios sean efectivos y sostenibles?", type: 'text' },
  { id: 'q12', text: "12. En el día a día, ¿cuál es la mayor fortaleza para mejorar la cultura segura?", type: 'text' },
  { id: 'q13', text: "13. ¿Tiene alguna otra inquietud o sugerencia para el desarrollo de la cultura?", type: 'text' },
  { id: 'q14_empresa_saludable', text: "14a. Términos: Empresa saludable", type: 'text' },
  { id: 'q14_seguridad', text: "14b. Términos: Seguridad", type: 'text' },
  { id: 'q14_trabajo_equipo', text: "14c. Términos: Trabajo en equipo", type: 'text' },
  { id: 'q14_prevencion', text: "14d. Términos: Prevención", type: 'text' },
  { id: 'q14_responsabilidad', text: "14e. Términos: Responsabilidad", type: 'text' }
];

const DPMS_SYSTEM_PROMPT = `Eres un psicólogo organizacional y analista de datos experto en diagnósticos de madurez en seguridad minera (DPMS). 
Se te proveerá el texto de una entrevista (que puede contener ruido, marcas de tiempo vtt, interrupciones, etc.).
Tu objetivo es ignorar el formato y extraer la siguiente información del entrevistado. Si algun dato no se menciona, usa "No especificado".

METADATOS A EXTRAER:
- nombre: Nombre del entrevistado.
- empresa: Nombre de la empresa o contrata a la que pertenece.
- puesto: Cargo o puesto que ocupa.
- area: Área de trabajo.
- nivel_cultura: Determina el nivel de madurez de cultura de seguridad del entrevistado del 1 al 5 (1: Reactivo, 2: Dependiente, 3: Independiente, 4: Interdependiente, 5: Excelente/Liderazgo).
- comentarios: Redacta un pequeño resumen o frase crítica (insight conductual) extraído de su participación. Algo que resalte su percepción de riesgo o liderazgo. Corto (max 2 lineas).

PREGUNTAS DE EVALUACIÓN:
Extrae la respuesta o infiere la información a partir de las siguientes preguntas dadas en la entrevista. Algunas requieren texto resumido, otras infieren números:
PREGUNTA 1: ¿Cómo contribuye la seguridad integrada en las operaciones en los procesos de su área? ¿Me puede dar un ejemplo? Entonces, ¿cuál es la tarea de mayor riesgo? (Texto)
PREGUNTA 2: ¿Cómo te aseguras de que tu personal esté capacitado con las competencias que requiere? (Texto)
PREGUNTA 3: Piense en algo que lo hace sentir orgullo de su gestión. ¿Qué acciones? ¿Fue reconocido? ¿Qué reconocimiento recomendaría? (Texto)
PREGUNTA 4: Efectividad (del 1 al 10) de:
  - Involucramiento del líder de área en la formación del equipo (Número 1-10)
  - Calidad de las capacitaciones y desenvolvimiento del facilitador (Número 1-10)
  - Seguimiento a la efectividad del proceso (Número 1-10)
  - Asistencia a capacitaciones de líderes (Número 1-10)
PREGUNTA 5: ¿En su evaluación de desempeño anual, qué aspectos de seguridad se evalúan? (Texto)
PREGUNTA 6: De 1 a 10, ¿qué porcentaje de responsabilidad en seguridad tiene la línea de mando? (Número 1-10) y Explique por qué (Texto).
PREGUNTA 7: ¿Cómo se asegura de que las acciones derivadas de los accidentes sean aprendidas y no se repitan? (Texto)
PREGUNTA 8: ¿Qué significa para usted disponer de un entorno seguro y saludable al realizar una actividad? (Texto)
PREGUNTA 9: Ordenar de 1 a 3 (1 es el mayor peso, 3 menor) qué factor tiene mayor peso en las estadísticas:
  - Gestión integrada (Número 1-3)
  - Comportamiento y actitudes del personal (Número 1-3)
  - Liderazgo y supervisión (Número 1-3)
PREGUNTA 10: Desde su rol como líder, ¿qué le preocupa del desempeño de seguridad de su área? (Texto)
PREGUNTA 11: ¿Qué acciones considera clave para que los cambios en la organización sean efectivos y sostenibles en el tiempo? (Texto)
PREGUNTA 12: En el día a día de su área, ¿cuál es la mayor fortaleza para mejorar y mantener una cultura de producción segura? (Texto)
PREGUNTA 13: ¿Tiene alguna otra inquietud o sugerencia importante para el desarrollo de la cultura? (Texto)
PREGUNTA 14: Lo primero que se le venga a la mente sobre: Empresa saludable, Seguridad, Trabajo en equipo, Prevención, Responsabilidad. (Texto corto para cada uno)

INSTRUCCIONES CLAVES:
- Devuelve la respuesta ESTRICTAMENTE y ÚNICAMENTE en formato JSON.
- Si un valor numérico no se menciona ni se puede inferir, usa 0.
- Si un texto no se menciona o no hay respuesta relevante, usa "No especificado".
- Asegúrate de usar estas claves exactas en el JSON de salida:
{
  "nombre": "string",
  "empresa": "string",
  "puesto": "string",
  "area": "string",
  "nivel_cultura": numero,
  "comentarios": "string",
  "respuestas": {
    "q1": "string",
    "q2": "string",
    "q3": "string",
    "q4_involucramiento": numero,
    "q4_calidad": numero,
    "q4_seguimiento": numero,
    "q4_asistencia": numero,
    "q5": "string",
    "q6_responsabilidad": numero,
    "q6_explicacion": "string",
    "q7": "string",
    "q8": "string",
    "q9_gestion": numero,
    "q9_comportamiento": numero,
    "q9_liderazgo": numero,
    "q10": "string",
    "q11": "string",
    "q12": "string",
    "q13": "string",
    "q14_empresa_saludable": "string",
    "q14_seguridad": "string",
    "q14_trabajo_equipo": "string",
    "q14_prevencion": "string",
    "q14_responsabilidad": "string"
  }
}`;

export default function UploadDpmsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [extractedData, setExtractedData] = useState<{
    nombre: string;
    empresa: string;
    puesto: string;
    area: string;
    nivel_cultura: number;
    comentarios: string;
    respuestas: Record<string, string | number>;
  } | null>(null);

  const [evaluados, setEvaluados] = useState<any[]>([]);
  const [selectedEvaluado, setSelectedEvaluado] = useState<any | null>(null);
  const [loadingEvaluados, setLoadingEvaluados] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchEvaluados();
  }, []);

  const fetchEvaluados = async () => {
    setLoadingEvaluados(true);
    try {
      const { data, error } = await supabase.from('dpms_entrevistas').select('*').order('created_at', { ascending: false });
      if (error) {
        if (error.code === '42P01') {
          // Relación/Tabla no existe; no hacer nada grave, esperar que el desarrollador la cree
        } else {
          throw error;
        }
      } else if (data) {
        setEvaluados(data);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoadingEvaluados(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const validExtensions = ['.txt', '.docx', '.vtt'];
      if (validExtensions.some(ext => droppedFile.name.toLowerCase().endsWith(ext))) {
        setFile(droppedFile);
      } else {
        toast({
          title: "Archivo inválido",
          description: "Solo se permiten archivos .txt, .docx y .vtt",
          variant: "destructive"
        });
      }
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const result = e.target?.result;
          if (!result) throw new Error("No result");
          
          if (file.name.endsWith('.docx')) {
            const arrayBuffer = result as ArrayBuffer;
            const res = await mammoth.extractRawText({ arrayBuffer });
            resolve(res.value);
          } else {
            resolve(result as string);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (e) => reject(e);
      
      if (file.name.endsWith('.docx')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const cleanTranscript = (rawText: string) => {
    return rawText
      .replace(/\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/g, '') // Quitar timestamps VTT
      .replace(/^\d+$/gm, '') // Quitar números de línea de subtítulos
      .replace(/\s+/g, ' ') // Colapsar espacios y saltos de línea
      .trim();
  };

  const processWithAI = async (transcript: string, retries = 3): Promise<any> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("No se ha configurado la API Key de Gemini (VITE_GEMINI_API_KEY)");
    }

    const cleanedTranscript = cleanTranscript(transcript);

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: DPMS_SYSTEM_PROMPT + "\n\n--- TEXTO DE LA ENTREVISTA ---\n" + cleanedTranscript }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json"
            }
          })
        });

        if (!response.ok) {
          const err = await response.json();
          let message = err.error?.message || "";
          
          if (message.includes("overloaded") || message.includes("high demand")) {
            message = "El servidor de IA está saturado. Reintentando automáticamente...";
          } else if (message.includes("API key not valid")) {
            message = "La clave API de Gemini no es válida.";
          }

          if ((response.status === 429 || response.status === 503 || message.includes("saturado")) && i < retries - 1) {
            console.warn(`Gemini ocupado, reintentando (${i + 1}/${retries})...`);
            await new Promise(res => setTimeout(res, 2000));
            continue;
          }
          throw new Error(message || "Error al comunicarse con Gemini");
        }

        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!candidate) {
          throw new Error("No se pudo extraer texto desde Gemini.");
        }

        const cleanedJson = candidate.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedJson);

      } catch (error: any) {
        if (i === retries - 1) throw error;
        console.warn(`Error en intento ${i + 1}, reintentando...`, error);
        await new Promise(res => setTimeout(res, 2000));
      }
    }
  };

  const processWithGroq = async (transcript: string): Promise<any> => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("No se ha configurado la API Key de Groq (VITE_GROQ_API_KEY)");
    }

    // Limpiar y truncar para Groq (Límite TPM es muy estricto en tier gratuito)
    // 20000 caracteres son aprox 5000-7000 tokens, lo que entra sobrado en el límite de 12000 TPM
    let cleanedTranscript = cleanTranscript(transcript);
    if (cleanedTranscript.length > 20000) {
      cleanedTranscript = cleanedTranscript.substring(0, 20000) + "... [Texto truncado para cumplir límites de API]";
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: DPMS_SYSTEM_PROMPT },
          { role: "user", content: "--- TEXTO DE LA ENTREVISTA ---\n" + cleanedTranscript }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "Error al comunicarse con Groq");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  };

  const handleProcess = async () => {
    if (!file && !text.trim()) {
      toast({
        title: "Error",
        description: "Debe subir un archivo o pegar el texto de la entrevista.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setExtractedData(null);

    try {
      // 1. Obtener texto
      let transcriptToProcess = text;
      if (file) {
        transcriptToProcess = await extractTextFromFile(file);
      }

      // 2. Enviar a Gemini para mapear respuestas
      let aiResult;
      try {
        aiResult = await processWithAI(transcriptToProcess);
      } catch (geminiError: any) {
        console.warn("Gemini falló, intentando con Groq...", geminiError);
        toast({
          title: "Gemini Saturado",
          description: "Cambiando a IA de respaldo (Groq) para completar el análisis...",
        });
        aiResult = await processWithGroq(transcriptToProcess);
      }

      if (!aiResult) throw new Error("No se obtuvo respuesta de ninguna IA.");
      const insertPayload: any = {
        nombre: aiResult.nombre || "Anónimo",
        empresa: aiResult.empresa || "No especificada",
        puesto: aiResult.puesto || "No especificado",
        area: aiResult.area || "No especificada",
        nivel_cultura: Number(aiResult.nivel_cultura) || 0,
        comentarios: aiResult.comentarios || "",
        q1: String(aiResult.respuestas?.q1 || "No especificado"),
        q2: String(aiResult.respuestas?.q2 || "No especificado"),
        q3: String(aiResult.respuestas?.q3 || "No especificado"),
        q4_involucramiento: Number(aiResult.respuestas?.q4_involucramiento) || 0,
        q4_calidad: Number(aiResult.respuestas?.q4_calidad) || 0,
        q4_seguimiento: Number(aiResult.respuestas?.q4_seguimiento) || 0,
        q4_asistencia: Number(aiResult.respuestas?.q4_asistencia) || 0,
        q5: String(aiResult.respuestas?.q5 || "No especificado"),
        q6_responsabilidad: Number(aiResult.respuestas?.q6_responsabilidad) || 0,
        q6_explicacion: String(aiResult.respuestas?.q6_explicacion || "No especificado"),
        q7: String(aiResult.respuestas?.q7 || "No especificado"),
        q8: String(aiResult.respuestas?.q8 || "No especificado"),
        q9_gestion: Number(aiResult.respuestas?.q9_gestion) || 0,
        q9_comportamiento: Number(aiResult.respuestas?.q9_comportamiento) || 0,
        q9_liderazgo: Number(aiResult.respuestas?.q9_liderazgo) || 0,
        q10: String(aiResult.respuestas?.q10 || "No especificado"),
        q11: String(aiResult.respuestas?.q11 || "No especificado"),
        q12: String(aiResult.respuestas?.q12 || "No especificado"),
        q13: String(aiResult.respuestas?.q13 || "No especificado"),
        q14_empresa_saludable: String(aiResult.respuestas?.q14_empresa_saludable || "No especificado"),
        q14_seguridad: String(aiResult.respuestas?.q14_seguridad || "No especificado"),
        q14_trabajo_equipo: String(aiResult.respuestas?.q14_trabajo_equipo || "No especificado"),
        q14_prevencion: String(aiResult.respuestas?.q14_prevencion || "No especificado"),
        q14_responsabilidad: String(aiResult.respuestas?.q14_responsabilidad || "No especificado")
      };

      const { error } = await supabase.from('dpms_entrevistas').insert(insertPayload);

      if (error) {
        console.error("Supabase Error:", error);
        let userMsg = error.message;
        if (userMsg.includes("duplicate key")) userMsg = "Este registro ya existe en la base de datos.";
        throw new Error(`Error en Base de Datos: ${userMsg}`);
      }

      // 4. Mostrar resultado
      setExtractedData(aiResult);
      toast({
        title: "Análisis Exitoso",
        description: "Diagnóstico cualitativo y cuantitativo estructurado y almacenado.",
      });
      
      // Update the DB list
      fetchEvaluados();

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error al procesar",
        description: error.message || "Ocurrió un error inesperado al procesar la entrevista.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCardColor = (score: number, max: number) => {
    if (max === 10) {
      if (score >= 8) return "text-emerald-600 border-emerald-500/30 bg-emerald-500/5";
      if (score >= 5) return "text-amber-600 border-amber-500/30 bg-amber-500/5";
      return "text-rose-600 border-rose-500/30 bg-rose-500/5";
    } else {
      if (score === 1) return "text-emerald-600 border-emerald-500/30 bg-emerald-500/5";
      if (score === 2) return "text-amber-600 border-amber-500/30 bg-amber-500/5";
      return "text-rose-600 border-rose-500/30 bg-rose-500/5";
    }
  }

  const getCultureLevel = (level: number) => {
    const levels: Record<number, { name: string, color: string, description: string }> = {
      1: { name: "Reactivo", color: "text-rose-600 bg-rose-50 border-rose-200", description: "Acción basada en instinto y miedo." },
      2: { name: "Dependiente", color: "text-amber-600 bg-amber-50 border-amber-200", description: "Acción basada en supervisión y reglas." },
      3: { name: "Independiente", color: "text-blue-600 bg-blue-50 border-blue-200", description: "Acción basada en autovigilancia y convicción." },
      4: { name: "Interdependiente", color: "text-emerald-600 bg-emerald-50 border-emerald-200", description: "Acción basada en el cuidado mutuo." },
      5: { name: "Excelente", color: "text-indigo-600 bg-indigo-50 border-indigo-200", description: "Cultura preventiva plenamente integrada." }
    };
    return levels[level] || { name: "No definido", color: "text-slate-400 bg-slate-50 border-slate-200", description: "Sin datos" };
  }

  return (
    <div className="container max-w-7xl mx-auto py-10 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Diagnóstico DPMS-Raura</h1>
          <p className="text-muted-foreground mt-1 font-medium">Plataforma de inferencia analítica y visores de estado individual.</p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted/50 p-1 rounded-xl mb-8 border border-border/50 shadow-sm">
          <TabsTrigger value="upload" className="rounded-lg font-bold">Carga Activa</TabsTrigger>
          <TabsTrigger value="dashboard" className="rounded-lg font-bold">Resumen Orbital</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card className="shadow-lg border-primary/10 bg-card/50 backdrop-blur-sm self-start sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> 
                  Ingreso de Datos Abiertos
                </CardTitle>
                <CardDescription>
                  Adjunta un archivo (.txt, .docx, .vtt) o pega el texto directamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="file-upload" className="font-bold">Subir Transcripción o Subtítulos</Label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-primary/20 hover:bg-primary/5 hover:border-primary/50'}`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-primary' : 'text-primary/50'}`} />
                    <p className="font-bold text-base">{isDragging ? '¡SUELTA EL ARCHIVO!' : 'Haz clic o arrastra un archivo'}</p>
                    <p className="text-xs text-muted-foreground mt-1">Formatos soportados: .txt, .docx, .vtt</p>
                    {file && (
                      <Badge variant="outline" className="mt-4 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 font-black uppercase tracking-wider">
                        {file.name}
                      </Badge>
                    )}
                    <Input 
                      id="file-upload" 
                      type="file" 
                      accept=".txt,.docx,.vtt" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-4 py-1 rounded-full text-muted-foreground font-black tracking-widest border border-border/50">
                      O Pega el Texto
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                   <Label htmlFor="text-area" className="font-bold">Texto de Entrevista (Opcional)</Label>
                   <Textarea 
                     id="text-area"
                     placeholder="Copia y pega el texto crudo de la entrevista aquí..."
                     className="min-h-[160px] resize-y rounded-xl bg-muted/30 focus:bg-background transition-colors"
                     value={text}
                     onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                     disabled={!!file}
                   />
                   {file && <p className="text-xs text-primary/70 italic font-medium">El área de texto está deshabilitada porque has seleccionado un archivo.</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                    onClick={handleProcess} 
                    disabled={loading || (!file && !text.trim())}
                    className="w-full h-14 font-black tracking-widest uppercase rounded-xl shadow-xl shadow-primary/10 transition-all hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Mapeando Dimensiones...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" /> Iniciar Escaneo Algorítmico
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* CONTENEDOR DE RESULTADOS */}
            <div className="space-y-6">
                {!extractedData && !loading && (
                    <Card className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-10 border-dashed shadow-sm text-muted-foreground bg-muted/20">
                        <ShieldCheck className="w-20 h-20 opacity-20 mb-6" />
                        <h3 className="font-black text-xl mb-2 text-foreground/80 tracking-tighter">Motor de Inferencia Apagado</h3>
                        <p className="text-sm max-w-sm">Carga una entrevista para extraer el nombre, área, comentarios y respuestas estructuradas.</p>
                    </Card>
                )}

                {loading && (
                    <Card className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-6 p-10 border-primary/20 shadow-2xl shadow-primary/5 bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                        <Loader2 className="w-20 h-20 text-primary animate-spin relative z-10" />
                      </div>
                      <div className="space-y-2 text-center">
                        <h3 className="font-black text-2xl italic tracking-tighter text-foreground">Asistente Neuronal Analizando</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">Interpretando el comportamiento y categorizando cualitativa y cuantitativamente...</p>
                      </div>
                    </Card>
                )}

                {extractedData && (
                    <Card className="shadow-2xl border-primary/20 max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10">
                        <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10 shrink-0">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl tracking-tighter text-primary flex items-center gap-2">
                                        <CheckCircle2 className="w-6 h-6" /> 
                                        Perfil DPMS Extraído
                                        </CardTitle>
                                        <CardDescription className="mt-1 font-medium">Datos sincronizados con la BD correctamente.</CardDescription>
                                    </div>
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-black uppercase px-4 py-1.5 rounded-full tracking-widest text-xs">
                                        {extractedData.nombre}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-card border border-border/50 p-3 rounded-xl shadow-sm">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Empresa</p>
                                        <p className="text-xs font-bold truncate" title={extractedData.empresa}>{extractedData.empresa}</p>
                                    </div>
                                    <div className="bg-card border border-border/50 p-3 rounded-xl shadow-sm">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Área</p>
                                        <p className="text-xs font-bold truncate" title={extractedData.area}>{extractedData.area}</p>
                                    </div>
                                    <div className="bg-card border border-border/50 p-3 rounded-xl shadow-sm">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Puesto</p>
                                        <p className="text-xs font-bold truncate" title={extractedData.puesto}>{extractedData.puesto}</p>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-4 p-4 rounded-2xl border ${getCultureLevel(extractedData.nivel_cultura).color} animate-pulse shadow-sm`}>
                                  <ShieldCheck className="w-8 h-8 shrink-0" />
                                  <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Nivel de Cultura Organizativa</p>
                                    <h4 className="text-lg font-black tracking-tighter">{getCultureLevel(extractedData.nivel_cultura).name}</h4>
                                    <p className="text-[10px] font-medium italic opacity-80">{getCultureLevel(extractedData.nivel_cultura).description}</p>
                                  </div>
                                </div>
                                
                                {extractedData.comentarios && (
                                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-20"><Zap className="w-10 h-10 text-white"/></div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Análisis Conductual IA</p>
                                    <p className="text-sm text-white font-medium italic relative z-10">"{extractedData.comentarios}"</p>
                                  </div>
                                )}
                            </div>
                        </CardHeader>
                        
                        <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3 bg-muted/10">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/80 mb-4 ml-2">Respuestas Inferidas (14 Preguntas)</h4>
                            {QUESTIONS.map((q) => {
                                const rawVal = extractedData.respuestas[q.id];
                                
                                if (q.type === 'number') {
                                  const score = Number(rawVal) || 0;
                                  return (
                                      <div key={q.id} className="bg-background p-4 rounded-xl border border-border shadow-sm flex items-center justify-between gap-4">
                                          <p className="text-xs font-bold text-foreground/80 leading-relaxed max-w-[80%]">{q.text}</p>
                                          <Badge className={`px-3 py-1 font-black text-xs shrink-0 rounded-lg ${getCardColor(score, q.max || 10)}`}>
                                            {score}/{q.max}
                                          </Badge>
                                      </div>
                                  );
                                } else {
                                  return (
                                    <div key={q.id} className="bg-background p-4 rounded-xl border border-border shadow-sm flex flex-col gap-2">
                                        <p className="text-xs font-bold text-foreground/80">{q.text}</p>
                                        <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                          <p className="text-sm font-medium text-foreground/70 italic text-pretty">
                                            "{String(rawVal || 'No especificado')}"
                                          </p>
                                        </div>
                                    </div>
                                  )
                                }
                            })}
                        </CardContent>
                    </Card>
                )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <Card className="shadow-lg border-border/50 overflow-hidden">
            <div className="flex flex-col min-h-[700px] bg-muted/10 relative overflow-hidden lg:flex-row">
              
              {/* SIDEBAR: Table of individuals */}
              <div className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border-r border-border/50 bg-background flex flex-col h-[700px] shrink-0 ${selectedEvaluado ? 'w-full lg:w-1/3' : 'w-full'}`}>
                <div className="p-5 border-b border-border/50 bg-muted/30">
                  <h3 className="font-black text-lg flex items-center gap-2"><Users className="w-5 h-5 text-primary"/> Evaluados ({evaluados.length})</h3>
                  <p className="text-xs text-muted-foreground">Selecciona un individuo para ver su perfil analítico.</p>
                </div>
                
                <ScrollArea className="flex-1">
                  {loadingEvaluados ? (
                    <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                      <Loader2 className="w-6 h-6 animate-spin mb-2 opacity-50"/>
                      <span className="text-sm">Cargando...</span>
                    </div>
                  ) : evaluados.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      No hay evaluaciones registradas.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-md">
                        <TableRow>
                          <TableHead className="font-black text-xs uppercase tracking-wider">Individuo</TableHead>
                          <TableHead className="font-black text-xs uppercase tracking-wider text-right">Área</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {evaluados.map((ev) => (
                          <TableRow 
                            key={ev.id} 
                            className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedEvaluado?.id === ev.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                            onClick={() => setSelectedEvaluado(ev)}
                          >
                            <TableCell className="font-medium p-4">
                              <div className="font-bold text-sm">{ev.nombre}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[120px]">{ev.puesto}</div>
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground p-4">
                              {ev.area}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </div>

              {/* MAIN: Orbital Dashboard */}
              <div className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br from-background to-muted/20 ${selectedEvaluado ? 'w-full lg:w-2/3 opacity-100' : 'w-0 opacity-0 hidden lg:flex'}`}>
                {selectedEvaluado && (
                  <div className="w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-8 animate-in slide-in-from-right-10 fade-in duration-500 flex flex-col items-center justify-center relative">
                    <div className="w-full max-w-4xl space-y-8 md:space-y-12">
                      
                      <div className="text-center space-y-2 mb-8 animate-in slide-in-from-top-4 fade-in duration-700 delay-100 fill-mode-both">
                        <h2 className="text-3xl font-black tracking-tight">{selectedEvaluado.nombre}</h2>
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs uppercase font-bold tracking-widest">{selectedEvaluado.puesto}</Badge>
                          <Badge variant="outline" className="text-xs uppercase font-bold tracking-widest">{selectedEvaluado.area}</Badge>
                        </div>
                      </div>

                      {/* RESPONSIVE CONTINUOUS GRID */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative">
                        {/* Líneas conectoras sutiles visuales (solo desktop) */}
                        <div className="hidden lg:block absolute inset-x-0 top-1/2 h-[1px] bg-border/40 -translate-y-1/2 -z-10 animate-in fade-in duration-1000 delay-75 fill-mode-both" />
                        <div className="hidden lg:block absolute inset-y-0 left-1/2 w-[1px] bg-border/40 -translate-x-1/2 -z-10 animate-in fade-in duration-1000 delay-75 fill-mode-both" />
                        <div className="hidden lg:block absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-border/40 rounded-full -z-10 bg-muted/5 animate-in zoom-in fade-in duration-1000 delay-150 fill-mode-both" />

                        {/* CENTER - IMAGE (On mobile it spans top, on desktop center) */}
                        <div className="col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-2 flex items-center justify-center relative py-6 lg:py-0 animate-in zoom-in-50 fade-in duration-700 delay-[200ms] fill-mode-both">
                          <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-500/10 rounded-full animate-pulse blur-2xl scale-[1.3] lg:scale-[1.8]"></div>
                          <div className="absolute inset-0 border-[1px] border-dashed border-primary/30 rounded-full animate-[spin_20s_linear_infinite] scale-[1.1] lg:scale-[1.5]"></div>
                          <div className="w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-[6px] border-background shadow-2xl overflow-hidden relative z-10 bg-slate-100 flex items-center justify-center">
                            <img src="/iconos%20genero/icono%20hombre.webp" alt="Avatar individuo" className="w-[85%] h-[85%] object-contain" />
                          </div>
                        </div>

                        <OrbitalCard 
                          title="Responsabilidad Línea de Mando" 
                          score={selectedEvaluado.q6_responsabilidad} 
                          max={10} 
                          colorClass={getCardColor(selectedEvaluado.q6_responsabilidad, 10)} 
                          delayClass="delay-[200ms]"
                        />
                        <OrbitalCard 
                          title="Involucramiento del Líder" 
                          score={selectedEvaluado.q4_involucramiento} 
                          max={10} 
                          colorClass={getCardColor(selectedEvaluado.q4_involucramiento, 10)} 
                          delayClass="delay-[300ms]"
                        />
                        <OrbitalCard 
                          title="Calidad de Capacitaciones" 
                          score={selectedEvaluado.q4_calidad} 
                          max={10} 
                          colorClass={getCardColor(selectedEvaluado.q4_calidad, 10)} 
                          delayClass="delay-[400ms]"
                        />

                        <OrbitalCard 
                          title="Gestión Integrada" 
                          score={selectedEvaluado.q9_gestion} 
                          max={3} 
                          colorClass={getCardColor(selectedEvaluado.q9_gestion, 3)} 
                          delayClass="delay-[500ms]"
                        />

                        <OrbitalCard 
                          title="Seguimiento Efectividad" 
                          score={selectedEvaluado.q4_seguimiento} 
                          max={10} 
                          colorClass={getCardColor(selectedEvaluado.q4_seguimiento, 10)} 
                          delayClass="delay-[600ms]"
                        />

                        {/* Row 3 */}
                        <OrbitalCard 
                          title="Liderazgo y Supervisión" 
                          score={selectedEvaluado.q9_liderazgo} 
                          max={3} 
                          colorClass={getCardColor(selectedEvaluado.q9_liderazgo, 3)} 
                          delayClass="delay-[700ms]"
                        />
                        <OrbitalCard 
                          title="Comportamiento y Actitudes" 
                          score={selectedEvaluado.q9_comportamiento} 
                          max={3} 
                          colorClass={getCardColor(selectedEvaluado.q9_comportamiento, 3)} 
                          delayClass="delay-[800ms]"
                        />
                        <OrbitalCard 
                          title="Asistencia Líderes" 
                          score={selectedEvaluado.q4_asistencia} 
                          max={10} 
                          colorClass={getCardColor(selectedEvaluado.q4_asistencia, 10)} 
                          delayClass="delay-[900ms]"
                        />

                        <div className={`col-span-2 lg:col-span-3 mt-4 p-5 rounded-[2rem] border flex items-center justify-between gap-6 transition-all hover:scale-[1.01] animate-in slide-in-from-bottom-4 duration-700 delay-[1000ms] fill-mode-both ${getCultureLevel(selectedEvaluado.nivel_cultura).color}`}>
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-white/50 border border-current/10">
                              <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Clasificación de Cultura</p>
                              <h3 className="text-2xl font-black tracking-tighter">{getCultureLevel(selectedEvaluado.nivel_cultura).name}</h3>
                            </div>
                          </div>
                          <div className="hidden md:block max-w-[200px] text-right">
                            <p className="text-xs font-bold opacity-80 leading-tight italic">{getCultureLevel(selectedEvaluado.nivel_cultura).description}</p>
                          </div>
                        </div>
                      </div>

                      {/* Resumen extra (Comentarios IA) */}
                      {selectedEvaluado.comentarios && (
                         <div className="mt-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-lg mx-auto max-w-2xl relative animate-in slide-in-from-bottom-6 fade-in duration-700 delay-[1000ms] fill-mode-both">
                           <div className="absolute top-0 right-0 p-4 opacity-10 blur-[1px]"><Zap className="w-16 h-16 text-white"/></div>
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Diagnóstico Semántico del IA</p>
                           <p className="text-white text-lg font-medium leading-relaxed italic relative z-10 text-pretty">
                             "{selectedEvaluado.comentarios}"
                           </p>
                         </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Subcomponente usado en el grid orbital
function OrbitalCard({ title, score, max, colorClass, delayClass = "" }: { title: string, score: number, max: number, colorClass: string, delayClass?: string }) {
  const isRank = max === 3;
  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-3xl border bg-card/60 backdrop-blur-md shadow-sm transition-all hover:scale-110 z-20 animate-in zoom-in-50 fade-in duration-500 fill-mode-both ${delayClass} ${colorClass}`}>
      <span className="text-[10px] font-black uppercase text-center w-full text-balance leading-tight opacity-70 mb-1 h-8 flex items-center justify-center" title={title}>{title}</span>
      <div className="text-3xl font-black tracking-tighter">
        {score}<span className="text-sm font-bold opacity-40">/{max}</span>
      </div>
      {isRank && <span className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-50">Ranking</span>}
    </div>
  );
}
