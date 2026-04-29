import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  UploadCloud,
  FileText,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Zap,
  Users,
  Trash2,
  Edit,
  Download,
  FastForward,
  Play,
  Settings,
  FileDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import mammoth from "mammoth";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import Papa from "papaparse";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
const QUESTIONS = [
  {
    id: "q1",
    text: "1. ¿Cómo contribuye la seguridad integrada en las operaciones en los procesos de su área? ¿Me puede dar un ejemplo? ¿Cuál es la tarea con mayores riesgos?",
    type: "text",
  },
  {
    id: "q2",
    text: "2. ¿Cómo te aseguras de que tu personal esté capacitado con las competencias que requiere?",
    type: "text",
  },
  {
    id: "q3",
    text: "3. Piense en algo que lo hace sentir orgullo de su gestión. ¿Acciones, reconocimientos, recomendaciones?",
    type: "text",
  },
  {
    id: "q4_involucramiento",
    text: "4a. Efectividad: Involucramiento del líder en la formación (1-10)",
    type: "number",
    max: 10,
  },
  {
    id: "q4_calidad",
    text: "4b. Efectividad: Calidad de las capacitaciones y facilitador (1-10)",
    type: "number",
    max: 10,
  },
  {
    id: "q4_seguimiento",
    text: "4c. Efectividad: Seguimiento al proceso (1-10)",
    type: "number",
    max: 10,
  },
  {
    id: "q4_asistencia",
    text: "4d. Efectividad: Asistencia a capacitaciones de líderes (1-10)",
    type: "number",
    max: 10,
  },
  {
    id: "q5",
    text: "5. ¿En su evaluación de desempeño anual, qué aspectos de seguridad se evalúan?",
    type: "text",
  },
  {
    id: "q6_responsabilidad",
    text: "6a. % de responsabilidad en seguridad de la línea de mando (1-10)",
    type: "number",
    max: 10,
  },
  {
    id: "q6_explicacion",
    text: "6b. Explicación de responsabilidad en seguridad",
    type: "text",
  },
  {
    id: "q7",
    text: "7. ¿Cómo se asegura de que las acciones derivadas de los accidentes sean aprendidas?",
    type: "text",
  },
  {
    id: "q8",
    text: "8. ¿Qué significa para usted disponer de un entorno seguro y saludable?",
    type: "text",
  },
  {
    id: "q9_gestion",
    text: "9a. Peso (1-3): Gestión integrada",
    type: "number",
    max: 3,
  },
  {
    id: "q9_comportamiento",
    text: "9b. Peso (1-3): Comportamiento y actitudes",
    type: "number",
    max: 3,
  },
  {
    id: "q9_liderazgo",
    text: "9c. Peso (1-3): Liderazgo y supervisión",
    type: "number",
    max: 3,
  },
  {
    id: "q10",
    text: "10. Desde su rol como líder, ¿qué le preocupa del desempeño de seguridad?",
    type: "text",
  },
  {
    id: "q11",
    text: "11. ¿Qué acciones considera clave para que los cambios sean efectivos y sostenibles?",
    type: "text",
  },
  {
    id: "q12",
    text: "12. En el día a día, ¿cuál es la mayor fortaleza para mejorar la cultura segura?",
    type: "text",
  },
  {
    id: "q13",
    text: "13. ¿Tiene alguna otra inquietud o sugerencia para el desarrollo de la cultura?",
    type: "text",
  },
  {
    id: "q14_empresa_saludable",
    text: "14a. Términos: Empresa saludable",
    type: "text",
  },
  { id: "q14_seguridad", text: "14b. Términos: Seguridad", type: "text" },
  {
    id: "q14_trabajo_equipo",
    text: "14c. Términos: Trabajo en equipo",
    type: "text",
  },
  { id: "q14_prevencion", text: "14d. Términos: Prevención", type: "text" },
  {
    id: "q14_responsabilidad",
    text: "14e. Términos: Responsabilidad",
    type: "text",
  },
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
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");

  const [reviewData, setReviewData] = useState<any | null>(null);

  const { toast } = useToast();

  const [evaluados, setEvaluados] = useState<any[]>([]);
  const [selectedEvaluado, setSelectedEvaluado] = useState<any | null>(null);
  const [loadingEvaluados, setLoadingEvaluados] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  const reportRef = useRef<HTMLDivElement>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  useEffect(() => {
    fetchEvaluados();
  }, []);

  const fetchEvaluados = async () => {
    setLoadingEvaluados(true);
    try {
      const { data, error } = await supabase
        .from("dpms_entrevistas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        if (error.code !== "42P01") throw error;
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
      const newFiles = Array.from(e.target.files);
      setPendingFiles((prev) => [...prev, ...newFiles]);
    }
    // Reset the input value so the same files can be selected again if needed
    e.target.value = "";
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
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validExtensions = [".txt", ".docx", ".vtt"];
      const validFiles = droppedFiles.filter((f) =>
        validExtensions.some((ext) => f.name.toLowerCase().endsWith(ext)),
      );

      if (validFiles.length > 0) {
        setPendingFiles((prev) => [...prev, ...validFiles]);
      }
      if (validFiles.length < droppedFiles.length) {
        toast({
          title: "Archivos omitidos",
          description: "Solo se permiten archivos .txt, .docx y .vtt",
          variant: "destructive",
        });
      }
    }
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result;
          if (!result) throw new Error("No result");

          if (file.name.endsWith(".docx")) {
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

      if (file.name.endsWith(".docx")) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const cleanTranscript = (rawText: string) => {
    return rawText
      .replace(/\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/g, "") // Quitar timestamps VTT
      .replace(/^\d+$/gm, "") // Quitar números de línea de subtítulos
      .replace(/\s+/g, " ") // Colapsar espacios y saltos de línea
      .trim();
  };

  const processWithAI = async (
    transcript: string,
    retries = 3,
  ): Promise<any> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key de Gemini no configurada");
    const cleanedTranscript = cleanTranscript(transcript);

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text:
                        DPMS_SYSTEM_PROMPT +
                        "\n\n--- TEXTO DE LA ENTREVISTA ---\n" +
                        cleanedTranscript,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json",
              },
            }),
          },
        );

        if (!response.ok) {
          const err = await response.json();
          let message = err.error?.message || "";
          if (
            (response.status === 429 ||
              response.status === 503 ||
              message.includes("saturado") ||
              message.includes("overloaded")) &&
            i < retries - 1
          ) {
            await new Promise((res) => setTimeout(res, 2000));
            continue;
          }
          throw new Error(message || "Error Gemini");
        }

        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidate) throw new Error("No se pudo extraer texto.");
        return JSON.parse(
          candidate
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim(),
        );
      } catch (error: any) {
        if (i === retries - 1) throw error;
        await new Promise((res) => setTimeout(res, 2000));
      }
    }
  };

  const processWithGroq = async (transcript: string): Promise<any> => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("API Key de Groq no configurada");

    let cleanedTranscript = cleanTranscript(transcript);
    if (cleanedTranscript.length > 10000) {
      cleanedTranscript =
        cleanedTranscript.substring(0, 10000) +
        "... [Texto truncado para cumplir límites TPM]";
    }

    const modelsToTry = [
      "mixtral-8x7b-32768",
      "llama3-70b-8192",
      "llama3-8b-8192",
      "gemma2-9b-it",
      "llama-3.1-8b-instant",
    ];
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: "system", content: DPMS_SYSTEM_PROMPT },
                {
                  role: "user",
                  content:
                    "--- TEXTO DE LA ENTREVISTA ---\n" + cleanedTranscript,
                },
              ],
              temperature: 0.2,
              max_tokens: 1500,
              response_format: { type: "json_object" },
            }),
          },
        );

        if (!response.ok) {
          const err = await response.json();
          lastError = new Error(
            `Error en modelo ${model}: ${err.error?.message || "Error desconocido"}`,
          );
          continue;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return JSON.parse(content);
      } catch (e: any) {
        lastError = e;
      }
    }
    throw lastError || new Error("Todos los modelos de Groq fallaron.");
  };

  const handleProcessNext = async () => {
    if (pendingFiles.length === 0 && !text.trim()) {
      toast({
        title: "Error",
        description: "Sube un archivo o pega el texto primero.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setLoadingPhase("Extrayendo texto...");

    try {
      let transcriptToProcess = text;
      let currentFile = pendingFiles.length > 0 ? pendingFiles[0] : null;

      if (currentFile) {
        transcriptToProcess = await extractTextFromFile(currentFile);
      }

      setLoadingPhase("Analizando con Gemini...");
      let aiResult;
      try {
        aiResult = await processWithAI(transcriptToProcess);
      } catch (geminiError: any) {
        console.warn("Gemini falló, intentando con Groq...", geminiError);
        setLoadingPhase("Gemini saturado. Reintentando con Groq...");
        aiResult = await processWithGroq(transcriptToProcess);
      }

      if (!aiResult) throw new Error("Respuesta vacía de IA.");

      setLoadingPhase("Preparando pre-visualización...");

      // Pasar data extraida a la vista de validacion humana
      setReviewData({
        ...aiResult,
        _fileName: currentFile ? currentFile.name : "Texto Pegado",
        _isEditMode: false,
      });
    } catch (error: any) {
      toast({
        title: "Error al procesar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingPhase("");
    }
  };

  const handleSaveReview = async () => {
    if (!reviewData) return;
    setLoading(true);
    setLoadingPhase("Guardando en la Base de Datos...");

    try {
      const getVal = (key: string) =>
        reviewData.respuestas?.[key] ?? reviewData[key];

      const payload: any = {
        nombre: reviewData.nombre || "Anónimo",
        empresa: reviewData.empresa || "No especificada",
        puesto: reviewData.puesto || "No especificado",
        area: reviewData.area || "No especificada",
        nivel_cultura: Number(reviewData.nivel_cultura) || 0,
        comentarios: reviewData.comentarios || "",
        q1: String(getVal("q1") || "No especificado"),
        q2: String(getVal("q2") || "No especificado"),
        q3: String(getVal("q3") || "No especificado"),
        q4_involucramiento: Number(getVal("q4_involucramiento")) || 0,
        q4_calidad: Number(getVal("q4_calidad")) || 0,
        q4_seguimiento: Number(getVal("q4_seguimiento")) || 0,
        q4_asistencia: Number(getVal("q4_asistencia")) || 0,
        q5: String(getVal("q5") || "No especificado"),
        q6_responsabilidad: Number(getVal("q6_responsabilidad")) || 0,
        q6_explicacion: String(getVal("q6_explicacion") || "No especificado"),
        q7: String(getVal("q7") || "No especificado"),
        q8: String(getVal("q8") || "No especificado"),
        q9_gestion: Number(getVal("q9_gestion")) || 0,
        q9_comportamiento: Number(getVal("q9_comportamiento")) || 0,
        q9_liderazgo: Number(getVal("q9_liderazgo")) || 0,
        q10: String(getVal("q10") || "No especificado"),
        q11: String(getVal("q11") || "No especificado"),
        q12: String(getVal("q12") || "No especificado"),
        q13: String(getVal("q13") || "No especificado"),
        q14_empresa_saludable: String(
          getVal("q14_empresa_saludable") || "No especificado",
        ),
        q14_seguridad: String(getVal("q14_seguridad") || "No especificado"),
        q14_trabajo_equipo: String(
          getVal("q14_trabajo_equipo") || "No especificado",
        ),
        q14_prevencion: String(getVal("q14_prevencion") || "No especificado"),
        q14_responsabilidad: String(
          getVal("q14_responsabilidad") || "No especificado",
        ),
      };

      if (reviewData.id) {
        // Edit mode
        const { error } = await supabase
          .from("dpms_entrevistas")
          .update(payload)
          .eq("id", reviewData.id);
        if (error) throw error;
        toast({
          title: "Cambios guardados",
          description: "El registro ha sido actualizado.",
        });
      } else {
        // Insert mode
        const { error } = await supabase
          .from("dpms_entrevistas")
          .insert(payload);
        if (error) throw error;
        toast({
          title: "Análisis Exitoso",
          description: "Diagnóstico estructurado y almacenado.",
        });
      }

      fetchEvaluados();

      // Clear the current processed file/text
      setReviewData(null);
      if (!reviewData._isEditMode) {
        if (pendingFiles.length > 0) {
          setPendingFiles((prev) => prev.slice(1));
        } else {
          setText("");
        }
      }
    } catch (error: any) {
      let userMsg = error.message;
      if (userMsg.includes("duplicate key"))
        userMsg = "Este registro ya existe en la base de datos.";
      toast({ title: "Error", description: userMsg, variant: "destructive" });
    } finally {
      setLoading(false);
      setLoadingPhase("");
    }
  };

  const handleDiscardReview = () => {
    setReviewData(null);
    if (!reviewData?._isEditMode) {
      if (pendingFiles.length > 0) {
        setPendingFiles((prev) => prev.slice(1));
      } else {
        setText("");
      }
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (
      !confirm(
        `¿Estás seguro de eliminar permanentemente el registro de ${nombre}?`,
      )
    )
      return;
    try {
      const { error } = await supabase
        .from("dpms_entrevistas")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Registro eliminado" });
      if (selectedEvaluado?.id === id) setSelectedEvaluado(null);
      fetchEvaluados();
    } catch (e: any) {
      toast({
        title: "Error al eliminar",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (ev: any) => {
    setReviewData({ ...ev, _isEditMode: true });
    setActiveTab("upload");
  };

  const handleExportCSV = () => {
    if (evaluados.length === 0) return;
    const csv = Papa.unparse(evaluados);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `dpms_export_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
    if (!selectedEvaluado) return;
    setIsExportingPDF(true);

    try {
      // PDF generado con jsPDF puro, sin html2canvas.
      // Esto evita que el texto, las tarjetas y el radar salgan deformados o incompletos.
      const pdf = new jsPDF("portrait", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = 16;

      const safeText = (value: any) =>
        String(value ?? "").trim() || "No especificado";

      const addPageIfNeeded = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
          pdf.addPage();
          y = 16;
        }
      };

      const centerText = (
        text: string,
        x: number,
        currentY: number,
        width: number,
      ) => {
        pdf.text(text, x + width / 2, currentY, { align: "center" });
      };

      const drawBadge = (
        text: string,
        x: number,
        currentY: number,
        width: number,
      ) => {
        pdf.setDrawColor(210, 215, 225);
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(x, currentY, width, 8, 3, 3, "FD");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7);
        pdf.setTextColor(71, 85, 105);
        centerText(text.toUpperCase(), x, currentY + 5.3, width);
      };

      const drawMetricCard = (
        title: string,
        score: number,
        max: number,
        x: number,
        currentY: number,
        width: number,
        height: number,
      ) => {
        pdf.setDrawColor(167, 243, 208);
        pdf.setFillColor(240, 253, 250);
        pdf.roundedRect(x, currentY, width, height, 8, 8, "FD");

        pdf.setTextColor(5, 150, 105);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        centerText(title.toUpperCase(), x, currentY + 10, width);

        pdf.setFontSize(24);
        centerText(String(score || 0), x, currentY + 24, width);

        pdf.setFontSize(9);
        pdf.setTextColor(100, 116, 139);
        centerText(`/${max}`, x, currentY + 30, width);
      };

      const drawRadar = (
        x: number,
        currentY: number,
        width: number,
        height: number,
      ) => {
        const data = getRadarData(selectedEvaluado);
        const cx = x + width / 2;
        const cy = currentY + height / 2 + 4;
        const radius = Math.min(width, height) * 0.32;
        const n = data.length;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(51, 65, 85);
        centerText("HUELLA DE MADUREZ", x, currentY + 8, width);

        pdf.setDrawColor(226, 232, 240);
        pdf.setLineWidth(0.2);

        for (let level = 1; level <= 5; level++) {
          const r = (radius * level) / 5;
          const pts = data.map((_, i) => {
            const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
            return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as [
              number,
              number,
            ];
          });
          pts.forEach((pt, i) => {
            const next = pts[(i + 1) % pts.length];
            pdf.line(pt[0], pt[1], next[0], next[1]);
          });
        }

        data.forEach((d, i) => {
          const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
          const ax = cx + Math.cos(angle) * radius;
          const ay = cy + Math.sin(angle) * radius;
          pdf.line(cx, cy, ax, ay);

          const lx = cx + Math.cos(angle) * (radius + 16);
          const ly = cy + Math.sin(angle) * (radius + 16);
          pdf.setFontSize(7);
          pdf.setTextColor(71, 85, 105);
          pdf.text(d.subject, lx, ly, { align: "center", baseline: "middle" });
        });

        const pts = data.map((d, i) => {
          const value = Math.max(0, Math.min(100, Number(d.score) || 0));
          const r = (radius * value) / 100;
          const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
          return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as [
            number,
            number,
          ];
        });

        pdf.setDrawColor(30, 64, 175);
        pdf.setLineWidth(0.8);
        pts.forEach((pt, i) => {
          const next = pts[(i + 1) % pts.length];
          pdf.line(pt[0], pt[1], next[0], next[1]);
        });
      };

      // Encabezado
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      centerText(safeText(selectedEvaluado.nombre), margin, y, contentWidth);
      y += 10;

      const badgeWidth = 72;
      drawBadge(safeText(selectedEvaluado.puesto), margin + 18, y, badgeWidth);
      drawBadge(
        safeText(selectedEvaluado.area),
        pageWidth - margin - 18 - badgeWidth,
        y,
        badgeWidth,
      );
      y += 16;

      // Radar en caja clara
      addPageIfNeeded(100);
      pdf.setDrawColor(226, 232, 240);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, y, contentWidth, 95, 8, 8, "FD");
      drawRadar(margin, y + 4, contentWidth, 86);
      y += 105;

      // Tarjetas métricas
      addPageIfNeeded(85);
      const gap = 8;
      const cardW = (contentWidth - gap) / 2;
      const cardH = 34;
      drawMetricCard(
        "Responsabilidad",
        selectedEvaluado.q6_responsabilidad,
        10,
        margin,
        y,
        cardW,
        cardH,
      );
      drawMetricCard(
        "Involucramiento",
        selectedEvaluado.q4_involucramiento,
        10,
        margin + cardW + gap,
        y,
        cardW,
        cardH,
      );
      y += cardH + gap;
      drawMetricCard(
        "Calidad Cap.",
        selectedEvaluado.q4_calidad,
        10,
        margin,
        y,
        cardW,
        cardH,
      );
      drawMetricCard(
        "Seguimiento",
        selectedEvaluado.q4_seguimiento,
        10,
        margin + cardW + gap,
        y,
        cardW,
        cardH,
      );
      y += cardH + 12;

      // Nivel de cultura
      addPageIfNeeded(42);
      const culture = getCultureLevel(
        Number(selectedEvaluado.nivel_cultura) || 0,
      );
      pdf.setDrawColor(167, 243, 208);
      pdf.setFillColor(236, 253, 245);
      pdf.roundedRect(margin, y, contentWidth, 38, 8, 8, "FD");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(5, 150, 105);
      centerText("NIVEL DE CULTURA GENERAL", margin, y + 9, contentWidth);
      pdf.setFontSize(18);
      centerText(culture.name.toUpperCase(), margin, y + 22, contentWidth);
      pdf.setFontSize(8);
      pdf.setTextColor(71, 85, 105);
      centerText(culture.description, margin, y + 31, contentWidth);
      y += 48;

      // Comentario IA
      if (selectedEvaluado.comentarios) {
        const comment = `"${safeText(selectedEvaluado.comentarios)}"`;
        const lines = pdf.splitTextToSize(comment, contentWidth - 18);
        const boxHeight = Math.max(34, lines.length * 5 + 20);
        addPageIfNeeded(boxHeight + 6);

        pdf.setDrawColor(15, 23, 42);
        pdf.setFillColor(15, 23, 42);
        pdf.roundedRect(margin, y, contentWidth, boxHeight, 6, 6, "FD");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        centerText("DIAGNÓSTICO SEMÁNTICO DEL IA", margin, y + 9, contentWidth);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(255, 255, 255);
        pdf.text(lines, margin + 9, y + 20);
        y += boxHeight + 8;
      }

      const safeName = safeText(selectedEvaluado.nombre)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "_");

      pdf.save(`Reporte_DPMS_${safeName}.pdf`);
      toast({
        title: "PDF Generado",
        description: "El reporte se generó ordenado y sin deformación.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF",
        variant: "destructive",
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const getCardColor = (score: number, max: number) => {
    if (max === 10) {
      if (score >= 8)
        return "text-emerald-600 border-emerald-500/30 bg-emerald-500/5";
      if (score >= 5)
        return "text-amber-600 border-amber-500/30 bg-amber-500/5";
      return "text-rose-600 border-rose-500/30 bg-rose-500/5";
    } else {
      if (score === 1)
        return "text-emerald-600 border-emerald-500/30 bg-emerald-500/5";
      if (score === 2)
        return "text-amber-600 border-amber-500/30 bg-amber-500/5";
      return "text-rose-600 border-rose-500/30 bg-rose-500/5";
    }
  };

  const getCultureLevel = (level: number) => {
    const levels: Record<
      number,
      { name: string; color: string; description: string }
    > = {
      1: {
        name: "Reactivo",
        color: "text-rose-600 bg-rose-50 border-rose-200",
        description: "Acción basada en instinto y miedo.",
      },
      2: {
        name: "Dependiente",
        color: "text-amber-600 bg-amber-50 border-amber-200",
        description: "Acción basada en supervisión y reglas.",
      },
      3: {
        name: "Independiente",
        color: "text-blue-600 bg-blue-50 border-blue-200",
        description: "Acción basada en autovigilancia y convicción.",
      },
      4: {
        name: "Interdependiente",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        description: "Acción basada en el cuidado mutuo.",
      },
      5: {
        name: "Excelente",
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
        description: "Cultura preventiva plenamente integrada.",
      },
    };
    return (
      levels[level] || {
        name: "No definido",
        color: "text-slate-400 bg-slate-50 border-slate-200",
        description: "Sin datos",
      }
    );
  };

  // Radar Chart Mapper
  const getRadarData = (ev: any) => {
    if (!ev) return [];
    return [
      {
        subject: "Línea Mando",
        score: (ev.q6_responsabilidad / 10) * 100,
        fullMark: 100,
      },
      {
        subject: "Involucramiento",
        score: (ev.q4_involucramiento / 10) * 100,
        fullMark: 100,
      },
      {
        subject: "Calidad Cap.",
        score: (ev.q4_calidad / 10) * 100,
        fullMark: 100,
      },
      {
        subject: "Seguimiento",
        score: (ev.q4_seguimiento / 10) * 100,
        fullMark: 100,
      },
      {
        subject: "Asistencia Líd.",
        score: (ev.q4_asistencia / 10) * 100,
        fullMark: 100,
      },
      {
        subject: "Gestión Integ.",
        score: (3 - ev.q9_gestion) * 50,
        fullMark: 100,
      }, // Para Rank: 1 es mejor
      {
        subject: "Supervisión",
        score: (3 - ev.q9_liderazgo) * 50,
        fullMark: 100,
      },
      {
        subject: "Comportamiento",
        score: (3 - ev.q9_comportamiento) * 50,
        fullMark: 100,
      },
    ];
  };

  return (
    <div className="container max-w-7xl mx-auto py-10 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Diagnóstico DPMS-Raura
            </h1>
            <p className="text-muted-foreground mt-1 font-medium">
              Plataforma de inferencia analítica y visores de estado individual.
            </p>
          </div>
        </div>
        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="shrink-0 gap-2 font-bold shadow-sm rounded-xl"
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted/50 p-1 rounded-xl mb-8 border border-border/50 shadow-sm">
          <TabsTrigger value="upload" className="rounded-lg font-bold">
            Carga Activa
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="rounded-lg font-bold">
            Resumen Orbital
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* LADO IZQUIERDO: CARGA / COLA */}
            <Card className="shadow-lg border-primary/10 bg-card/50 backdrop-blur-sm self-start sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Ingreso de Entrevistas
                </CardTitle>
                <CardDescription>
                  Sube múltiples archivos (.txt, .docx, .vtt) para procesarlos
                  en cola o pega el texto directamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="file-upload" className="font-bold">
                      Cola de Archivos ({pendingFiles.length})
                    </Label>
                  </div>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-primary/20 hover:bg-primary/5 hover:border-primary/50"}`}
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <UploadCloud
                      className={`w-10 h-10 mb-3 transition-colors ${isDragging ? "text-primary" : "text-primary/50"}`}
                    />
                    <p className="font-bold text-sm">
                      {isDragging
                        ? "¡SUELTALOS AQUÍ!"
                        : "Haz clic o arrastra uno o varios archivos"}
                    </p>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".txt,.docx,.vtt"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  {pendingFiles.length > 0 && (
                    <div className="bg-muted/30 border rounded-xl p-3 space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                      {pendingFiles.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-background p-2 rounded-lg border text-sm shadow-sm"
                        >
                          <span
                            className="font-medium truncate mr-2"
                            title={f.name}
                          >
                            {f.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            onClick={() => removePendingFile(i)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-4 py-1 rounded-full text-muted-foreground font-black tracking-widest border border-border/50">
                      O Pega Texto Libre
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Textarea
                    placeholder="Copia y pega el texto crudo de la entrevista aquí..."
                    className="min-h-[120px] resize-y rounded-xl bg-muted/30 focus:bg-background transition-colors"
                    value={text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setText(e.target.value)
                    }
                    disabled={pendingFiles.length > 0}
                  />
                  {pendingFiles.length > 0 && (
                    <p className="text-xs text-primary/70 italic font-medium">
                      Texto deshabilitado (tienes archivos en cola).
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleProcessNext}
                  disabled={
                    loading ||
                    reviewData !== null ||
                    (pendingFiles.length === 0 && !text.trim())
                  }
                  className="w-full h-14 font-black tracking-widest uppercase rounded-xl shadow-xl shadow-primary/10 transition-all hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : reviewData ? (
                    "Revisión Pendiente"
                  ) : pendingFiles.length > 0 ? (
                    <>
                      <Play className="mr-2 h-5 w-5" /> Iniciar Escaneo de Cola
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" /> Analizar Texto
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* LADO DERECHO: RESULTADOS / REVIEW FORM */}
            <div className="space-y-6">
              {!reviewData && !loading && (
                <Card className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-10 border-dashed shadow-sm text-muted-foreground bg-muted/20">
                  <ShieldCheck className="w-20 h-20 opacity-20 mb-6" />
                  <h3 className="font-black text-xl mb-2 text-foreground/80 tracking-tighter">
                    Motor de Inferencia Apagado
                  </h3>
                  <p className="text-sm max-w-sm">
                    Sube entrevistas para iniciar la validación
                    (Human-in-the-Loop) antes de guardar a la BD.
                  </p>
                </Card>
              )}

              {loading && (
                <Card className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-6 p-10 border-primary/20 shadow-2xl shadow-primary/5 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                    <Loader2 className="w-20 h-20 text-primary animate-spin relative z-10" />
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="font-black text-2xl italic tracking-tighter text-foreground">
                      Sistema Operando
                    </h3>
                    <p className="text-sm font-bold text-primary max-w-sm mx-auto">
                      {loadingPhase}
                    </p>
                  </div>
                </Card>
              )}

              {reviewData && (
                <Card className="shadow-2xl border-primary/40 max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 bg-gradient-to-b from-card to-muted/20">
                  <CardHeader className="bg-primary/5 pb-4 border-b border-primary/20 shrink-0">
                    <div className="flex justify-between items-center mb-2">
                      <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
                        <Edit className="w-5 h-5" /> Revisión Previa
                        (Human-in-the-Loop)
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="font-bold text-[10px] tracking-widest"
                      >
                        {reviewData._fileName || "Edición"}
                      </Badge>
                    </div>
                    <CardDescription className="font-medium text-xs">
                      La IA ha extraído estos datos. Revisa o corrige antes de
                      guardar definitivamente.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5">
                    {/* Formulario Editable Básico */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground">
                          Nombre
                        </Label>
                        <Input
                          value={reviewData.nombre}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              nombre: e.target.value,
                            })
                          }
                          className="font-bold bg-background h-8"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground">
                          Puesto
                        </Label>
                        <Input
                          value={reviewData.puesto}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              puesto: e.target.value,
                            })
                          }
                          className="font-bold bg-background h-8"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground">
                          Área
                        </Label>
                        <Input
                          value={reviewData.area}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              area: e.target.value,
                            })
                          }
                          className="font-bold bg-background h-8"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground">
                          Nivel Cultura (1-5)
                        </Label>
                        <Select
                          value={String(reviewData.nivel_cultura)}
                          onValueChange={(v) =>
                            setReviewData({
                              ...reviewData,
                              nivel_cultura: Number(v),
                            })
                          }
                        >
                          <SelectTrigger className="h-8 font-bold">
                            <SelectValue placeholder="Nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Reactivo</SelectItem>
                            <SelectItem value="2">2 - Dependiente</SelectItem>
                            <SelectItem value="3">3 - Independiente</SelectItem>
                            <SelectItem value="4">
                              4 - Interdependiente
                            </SelectItem>
                            <SelectItem value="5">5 - Excelente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Comentario Crítico (IA)
                      </Label>
                      <Textarea
                        value={reviewData.comentarios}
                        onChange={(e) =>
                          setReviewData({
                            ...reviewData,
                            comentarios: e.target.value,
                          })
                        }
                        className="min-h-[60px] text-sm font-medium bg-slate-900 text-slate-100 border-slate-800"
                      />
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/80 mb-4">
                        Respuestas Numéricas Clave
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          "q6_responsabilidad",
                          "q4_involucramiento",
                          "q4_calidad",
                          "q4_seguimiento",
                        ].map((k) => (
                          <div
                            key={k}
                            className="space-y-1 bg-muted/30 p-2 rounded-lg border"
                          >
                            <Label
                              className="text-[9px] font-bold uppercase truncate block text-muted-foreground"
                              title={k}
                            >
                              {k
                                .replace("q4_", "")
                                .replace("q6_", "")
                                .replace("_", " ")}
                            </Label>
                            <Input
                              type="number"
                              min={0}
                              max={10}
                              value={
                                reviewData.respuestas?.[k] ?? reviewData[k] ?? 0
                              }
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (reviewData.respuestas) {
                                  setReviewData({
                                    ...reviewData,
                                    respuestas: {
                                      ...reviewData.respuestas,
                                      [k]: val,
                                    },
                                  });
                                } else {
                                  setReviewData({ ...reviewData, [k]: val });
                                }
                              }}
                              className="h-7 text-xs font-black text-center"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 border-t p-4 flex gap-3">
                    <Button
                      variant="outline"
                      className="w-1/3 font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={handleDiscardReview}
                    >
                      Descartar
                    </Button>
                    <Button
                      className="w-2/3 font-black tracking-widest shadow-lg"
                      onClick={handleSaveReview}
                    >
                      {pendingFiles.length > 1 && !reviewData._isEditMode
                        ? "Guardar y Continuar Cola"
                        : "Guardar en BD"}{" "}
                      <FastForward className="ml-2 w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <Card className="shadow-lg border-border/50 overflow-hidden">
            <div className="flex flex-col min-h-[750px] bg-muted/10 relative overflow-hidden lg:flex-row">
              {/* SIDEBAR: Table of individuals */}
              <div
                className={`transition-all duration-700 border-r border-border/50 bg-background flex flex-col h-[750px] shrink-0 ${selectedEvaluado ? "w-full lg:w-[350px]" : "w-full"}`}
              >
                <div className="p-5 border-b border-border/50 bg-muted/30">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" /> Historial BD (
                    {evaluados.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Selecciona para ver el dashboard radial.
                  </p>
                </div>

                <ScrollArea className="flex-1">
                  {loadingEvaluados ? (
                    <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                      <Loader2 className="w-6 h-6 animate-spin mb-2 opacity-50" />
                      <span className="text-sm">Cargando...</span>
                    </div>
                  ) : evaluados.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      No hay evaluaciones en la BD.
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {evaluados.map((ev) => (
                        <div
                          key={ev.id}
                          className={`cursor-pointer transition-colors hover:bg-muted/50 p-4 flex justify-between items-center ${selectedEvaluado?.id === ev.id ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"}`}
                          onClick={() => setSelectedEvaluado(ev)}
                        >
                          <div className="flex-1 min-w-0 pr-3">
                            <div className="font-bold text-sm truncate">
                              {ev.nombre}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {ev.puesto}
                            </div>
                            <Badge
                              variant="secondary"
                              className="text-[9px] px-1.5 py-0 mt-1 uppercase bg-muted text-muted-foreground"
                            >
                              {ev.area}
                            </Badge>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(ev);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" /> Editar Datos
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-rose-600 focus:bg-rose-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(ev.id, ev.nombre);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                Permanente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* MAIN: Orbital Dashboard + Radar Chart */}
              <div
                className={`transition-all duration-700 flex flex-col items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br from-background to-muted/20 ${selectedEvaluado ? "w-full lg:w-[calc(100%-350px)] opacity-100" : "w-0 opacity-0 hidden lg:flex"}`}
              >
                {selectedEvaluado && (
                  <div className="w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-8 animate-in slide-in-from-right-10 fade-in duration-500">
                    <div
                      className="w-full max-w-5xl mx-auto space-y-8"
                      ref={reportRef}
                      data-pdf-container="true"
                    >
                      <div
                        className="flex justify-end mb-2"
                        data-html2canvas-ignore="true"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 font-bold shadow-sm rounded-xl border-primary/20 hover:bg-primary/5"
                          onClick={handleExportPDF}
                          disabled={isExportingPDF}
                        >
                          {isExportingPDF ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <FileDown className="w-4 h-4 text-primary" />
                          )}
                          {isExportingPDF ? "Generando..." : "Exportar PDF"}
                        </Button>
                      </div>

                      <div
                        className="text-center space-y-2 mb-4 animate-in slide-in-from-top-4 fade-in duration-700 delay-100"
                        id="pdf-block-header"
                      >
                        <h2 className="text-3xl font-black tracking-tight">
                          {selectedEvaluado.nombre}
                        </h2>
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="text-xs uppercase font-bold tracking-widest"
                          >
                            {selectedEvaluado.puesto}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs uppercase font-bold tracking-widest"
                          >
                            {selectedEvaluado.area}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
                        {/* RADAR CHART COMPONENT */}
                        <div
                          className="h-[350px] w-full bg-card rounded-[2rem] border shadow-sm p-4 animate-in zoom-in-50 fade-in duration-700 delay-200"
                          id="pdf-block-radar"
                        >
                          <h3 className="text-center text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                            Huella de Madurez
                          </h3>
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart
                              cx="50%"
                              cy="50%"
                              outerRadius="70%"
                              data={getRadarData(selectedEvaluado)}
                            >
                              <PolarGrid strokeOpacity={0.2} />
                              <PolarAngleAxis
                                dataKey="subject"
                                tick={{
                                  fill: "currentColor",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  opacity: 0.7,
                                }}
                              />
                              <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={false}
                                axisLine={false}
                              />
                              <RechartsTooltip
                                contentStyle={{
                                  borderRadius: "12px",
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                }}
                              />
                              <Radar
                                name="Puntuación"
                                dataKey="score"
                                stroke="hsl(var(--primary))"
                                fill="hsl(var(--primary))"
                                fillOpacity={0.3}
                                strokeWidth={2}
                                isAnimationActive={false}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* NUMERIC GRID */}
                        <div className="flex flex-col gap-4">
                          <div
                            className="grid grid-cols-2 gap-3 md:gap-4 relative"
                            id="pdf-block-cards"
                          >
                            <OrbitalCard
                              title="Responsabilidad"
                              score={selectedEvaluado.q6_responsabilidad}
                              max={10}
                              colorClass={getCardColor(
                                selectedEvaluado.q6_responsabilidad,
                                10,
                              )}
                              delayClass="delay-100"
                            />
                            <OrbitalCard
                              title="Involucramiento"
                              score={selectedEvaluado.q4_involucramiento}
                              max={10}
                              colorClass={getCardColor(
                                selectedEvaluado.q4_involucramiento,
                                10,
                              )}
                              delayClass="delay-200"
                            />
                            <OrbitalCard
                              title="Calidad Cap."
                              score={selectedEvaluado.q4_calidad}
                              max={10}
                              colorClass={getCardColor(
                                selectedEvaluado.q4_calidad,
                                10,
                              )}
                              delayClass="delay-300"
                            />
                            <OrbitalCard
                              title="Seguimiento"
                              score={selectedEvaluado.q4_seguimiento}
                              max={10}
                              colorClass={getCardColor(
                                selectedEvaluado.q4_seguimiento,
                                10,
                              )}
                              delayClass="delay-400"
                            />
                          </div>
                          <div id="pdf-block-culture">
                            <div
                              className={`p-5 rounded-[2rem] border flex flex-col justify-center items-center text-center gap-2 transition-all hover:scale-[1.01] animate-in slide-in-from-bottom-4 duration-700 delay-500 ${getCultureLevel(selectedEvaluado.nivel_cultura).color}`}
                            >
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">
                                Nivel de Cultura General
                              </p>
                              <h3 className="text-3xl font-black tracking-tighter">
                                {
                                  getCultureLevel(
                                    selectedEvaluado.nivel_cultura,
                                  ).name
                                }
                              </h3>
                              <p className="text-xs font-bold opacity-80 italic max-w-sm">
                                {
                                  getCultureLevel(
                                    selectedEvaluado.nivel_cultura,
                                  ).description
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resumen extra (Comentarios IA) */}
                      {selectedEvaluado.comentarios && (
                        <div id="pdf-block-ai">
                          <div className="mt-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-lg relative animate-in slide-in-from-bottom-6 fade-in duration-700 delay-500">
                            <div className="absolute top-0 right-0 p-4 opacity-10 blur-[1px]">
                              <Zap className="w-16 h-16 text-white" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
                              Diagnóstico Semántico del IA
                            </p>
                            <p className="text-white text-base font-medium leading-relaxed italic relative z-10 text-pretty">
                              "{selectedEvaluado.comentarios}"
                            </p>
                          </div>
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

function OrbitalCard({
  title,
  score,
  max,
  colorClass,
  delayClass = "",
}: {
  title: string;
  score: number;
  max: number;
  colorClass: string;
  delayClass?: string;
}) {
  const isRank = max === 3;
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-3xl border bg-card/60 backdrop-blur-md shadow-sm transition-all hover:scale-105 z-20 animate-in zoom-in-50 fade-in duration-500 fill-mode-both ${delayClass} ${colorClass}`}
    >
      <span
        className="text-[10px] font-black uppercase text-center w-full text-balance leading-tight opacity-70 mb-1 h-8 flex items-center justify-center"
        title={title}
      >
        {title}
      </span>
      <div className="text-3xl font-black tracking-tighter">
        {score}
        <span className="text-sm font-bold opacity-40">/{max}</span>
      </div>
      {isRank && (
        <span className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-50">
          Ranking
        </span>
      )}
    </div>
  );
}
