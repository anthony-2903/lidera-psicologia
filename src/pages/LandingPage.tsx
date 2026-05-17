import { Shield, Brain, Users, TrendingUp, Target, ChevronRight, Activity, CheckCircle2, BarChart3, Presentation, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "Evaluación Psicológica",
    description: "Diagnóstico profundo de competencias cognitivas y de personalidad aplicadas al liderazgo seguro.",
    className: "md:col-span-2 bg-gradient-to-br from-card to-card/50",
  },
  {
    icon: Shield,
    title: "Seguridad Conductual",
    description: "Identificación de comportamientos riesgosos y fortalecimiento de cultura preventiva.",
    className: "md:col-span-1 bg-gradient-to-br from-primary/10 to-card",
  },
  {
    icon: Target,
    title: "Planes 70-20-10",
    description: "70% experiencial, 20% social, 10% formal. Crecimiento garantizado.",
    className: "md:col-span-1 bg-gradient-to-bl from-accent/10 to-card",
  },
  {
    icon: TrendingUp,
    title: "Dashboards en Tiempo Real",
    description: "Visualización PRE vs POST con analítica avanzada para gerencias y superintendencias.",
    className: "md:col-span-2 bg-gradient-to-tr from-card to-card/50",
  },
];

const stats = [
  { value: "95%", label: "Reducción de incidentes" },
  { value: "300+", label: "Líderes capacitados" },
  { value: "12", label: "Operaciones mineras" },
  { value: "4.8/5", label: "Satisfacción promedio" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/mountains.png" 
            alt="Montañas mineras" 
            className="w-full h-full object-cover animate-slow-pan opacity-60 mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a2942]/90 via-[#1a2942]/60 to-background"></div>
        </div>

        <div className="absolute inset-0 opacity-20 z-0 mix-blend-color-dodge">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-info blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <nav className="relative z-10 container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="LideraMina" className="w-16 h-16 rounded-xl object-contain shadow-sm" />
            <span className="text-xl font-bold text-primary-foreground tracking-tight">
              LideraMina
            </span>
          </div>
          <Button
            variant="outline"
            className="bg-transparent backdrop-blur-sm border-white/40 text-white hover:bg-white/10 hover:text-white"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </Button>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6 backdrop-blur-md border border-accent/20">
              <Activity className="w-4 h-4" />
              Programa de Liderazgo en Seguridad Minera
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-primary-foreground leading-tight mb-6 tracking-tighter">
              Transforma el liderazgo,{" "}
              <span className="text-transparent bg-clip-text gradient-gold">protege vidas</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed font-medium">
              Plataforma integral de evaluación psicológica y desarrollo de competencias de liderazgo para la industria minera. Diagnóstico, intervención y medición de impacto en seguridad conductual.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="gradient-gold text-primary font-black text-base px-8 hover:scale-105 transition-transform shadow-lg shadow-accent/20 h-14 rounded-2xl"
                onClick={() => navigate("/login")}
              >
                Acceder al Sistema
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 container mx-auto px-6 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center bg-white/5 backdrop-blur-md rounded-2xl py-6 px-4 border border-white/10 shadow-xl"
              >
                <div className="text-3xl md:text-5xl font-black text-accent mb-2">{stat.value}</div>
                <div className="text-sm font-bold uppercase tracking-wider text-primary-foreground/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* 1. Metodología Integral (Bento Grid) */}
      <section className="py-24 container mx-auto px-6 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <motion.div {...fadeIn} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
            Metodología Integral Evolucionada
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Un ecosistema digital completo que centraliza la evaluación, la intervención y la medición del impacto del liderazgo en terreno.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`group relative overflow-hidden rounded-3xl p-8 shadow-lg border border-border hover:shadow-2xl hover:border-primary/30 transition-all duration-300 ${feature.className}`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <feature.icon className="w-48 h-48" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. Módulos de Evaluación (Componente Interactivo) */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="mb-16 md:flex justify-between items-end">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
                Módulos de Evaluación
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                Nuestros instrumentos psicométricos y conductuales están validados científicamente para el entorno minero.
              </p>
            </div>
          </motion.div>

          <Tabs defaultValue="psico" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-4 bg-transparent p-0 mb-8">
              <TabsTrigger value="psico" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl h-16 rounded-xl border border-border bg-card font-bold text-base transition-all">
                <Brain className="w-5 h-5 mr-2" />
                Baterías Psicológicas
              </TabsTrigger>
              <TabsTrigger value="driver" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl h-16 rounded-xl border border-border bg-card font-bold text-base transition-all">
                <Shield className="w-5 h-5 mr-2" />
                Seguridad Conductual (Locus)
              </TabsTrigger>
              <TabsTrigger value="entrevista" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl h-16 rounded-xl border border-border bg-card font-bold text-base transition-all">
                <Users className="w-5 h-5 mr-2" />
                Entrevistas Cualitativas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="psico" className="mt-6 animate-fade-in">
              <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-r from-card to-card/50">
                <CardContent className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
                      <BarChart3 className="w-4 h-4" /> 6 Dimensiones Analizadas
                    </div>
                    <h3 className="text-3xl font-black text-foreground">Perfil de Liderazgo Integral</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Evaluamos seis ejes fundamentales: Liderazgo, Percepción de Riesgos, Comunicación, Rol de Equipo, Cultura y Motivación. Generamos un radar de competencias que permite identificar brechas críticas.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Mapeo de Perfiles Cualitativos', 'Análisis Cuantitativo', 'Dashboard Dinámico', 'Exportación a PDF/Excel'].map(item => (
                        <li key={item} className="flex items-center gap-2 text-foreground font-medium">
                          <CheckCircle2 className="w-5 h-5 text-success" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full md:w-1/3 aspect-square bg-muted rounded-2xl flex items-center justify-center border border-border">
                    <img src="/placeholder.svg" alt="Radar de competencias" className="w-3/4 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="driver" className="mt-6 animate-fade-in">
              <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-r from-card to-card/50">
                <CardContent className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-bold">
                      <Target className="w-4 h-4" /> Locus de Control
                    </div>
                    <h3 className="text-3xl font-black text-foreground">Diagnóstico Driver Safety</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Una evaluación especializada de 23 ítems que determina si un colaborador atribuye los accidentes a factores internos (Riesgo Bajo) o externos (Riesgo Alto).
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Clasificación Automática de Riesgo', 'Validación de Errores', 'Recomendaciones Parametrizadas', 'Análisis de Locus Interno/Externo'].map(item => (
                        <li key={item} className="flex items-center gap-2 text-foreground font-medium">
                          <CheckCircle2 className="w-5 h-5 text-accent" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="entrevista" className="mt-6 animate-fade-in">
              <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-r from-card to-card/50">
                <CardContent className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-info/20 text-info text-sm font-bold">
                      <Users className="w-4 h-4" /> Método Human-in-the-Loop
                    </div>
                    <h3 className="text-3xl font-black text-foreground">Diagnóstico por Competencias</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Procesamiento avanzado de entrevistas cualitativas estructuradas. Clasificamos la cultura de seguridad en niveles (Patológica a Generativa) apoyados por inteligencia artificial y validación experta.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Extracción de Insights', 'Niveles de Cultura de Seguridad', 'Seguimiento de Progreso', 'Integración con Dashboards'].map(item => (
                        <li key={item} className="flex items-center gap-2 text-foreground font-medium">
                          <CheckCircle2 className="w-5 h-5 text-info" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* 3. El Proceso del Programa (Línea de tiempo conectada) */}
      <section className="py-24 container mx-auto px-6">
        <motion.div {...fadeIn} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
            El Camino al Cambio
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Una ruta estratégica diseñada para transformar la cultura organizacional de manera medible.
          </p>
        </motion.div>

        <div className="relative">
          {/* Línea conectora horizontal (Desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-1 bg-border -z-10" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {[
              { step: "01", title: "Diagnóstico PRE", desc: "Evaluación inicial de estado actual y brechas de riesgo." },
              { step: "02", title: "Plan Estratégico", desc: "Diseño de la ruta formativa basada en los hallazgos." },
              { step: "03", title: "Intervención", desc: "Programa inmersivo en campo y aulas metodológicas." },
              { step: "04", title: "Medición POST", desc: "Validación de la curva de aprendizaje y cierre de brechas." },
            ].map((phase, i) => (
              <motion.div 
                key={phase.step} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-28 h-28 rounded-full bg-card border-[6px] border-background shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/20 transition-all duration-300">
                  <span className="text-4xl font-black text-primary/40 group-hover:text-primary transition-colors">{phase.step}</span>
                </div>
                <h3 className="font-black text-xl text-foreground mb-3">{phase.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed max-w-[250px]">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Impacto Demostrado */}
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/mountains.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-[200px] -left-[200px] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                Resultados que hablan por sí solos
              </h2>
              <p className="text-xl text-muted/70 mb-10 leading-relaxed font-medium max-w-lg">
                La seguridad no es subjetiva. Nuestro programa garantiza un retorno de inversión observable en la conducta operativa.
              </p>
              <div className="space-y-8">
                {[
                  { label: "Crecimiento en Cultura Preventiva", val: "85%", w: "w-[85%]" },
                  { label: "Alineación de Liderazgo", val: "92%", w: "w-[92%]" },
                  { label: "Cumplimiento del Plan 70-20-10", val: "100%", w: "w-full" },
                ].map((bar, i) => (
                  <div key={bar.label}>
                    <div className="flex justify-between font-bold mb-2">
                      <span>{bar.label}</span>
                      <span className="text-accent">{bar.val}</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: bar.val }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className={`h-full gradient-gold rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-tr from-primary/20 to-transparent rounded-full absolute -inset-4 blur-2xl animate-pulse" />
              <Card className="bg-card/5 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden relative z-10 rounded-3xl">
                <CardContent className="p-8">
                  <Presentation className="w-16 h-16 text-accent mb-6" />
                  <blockquote className="text-2xl font-bold text-white leading-relaxed mb-8">
                    "La implementación de LideraMina transformó nuestra forma de visualizar el riesgo. Pasamos de la reactividad a la gestión conductual predictiva."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center font-black text-xl">GM</div>
                    <div>
                      <div className="font-bold text-lg text-white">Gerente General</div>
                      <div className="text-accent font-medium">Compañía Minera Raura</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. CTA Renovado */}
      <section className="py-24 container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="gradient-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-primary-foreground mb-8 tracking-tight">
              Inicia la transformación hoy
            </h2>
            <p className="text-primary-foreground/80 text-xl mb-12 font-medium leading-relaxed">
              El dashboard de análisis te espera. Mide, comprende y mejora el liderazgo de tu operación minera.
            </p>
            <Button
              size="lg"
              className="gradient-gold text-primary font-black text-lg px-12 h-16 hover:scale-105 transition-transform shadow-xl shadow-black/20 rounded-2xl"
              onClick={() => navigate("/login")}
            >
              Acceder a la Plataforma
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="LideraMina" className="w-10 h-10 object-contain grayscale opacity-70" />
            <span className="font-black text-xl text-foreground/80 tracking-tight">LideraMina</span>
          </div>
          <div className="flex gap-6 text-sm font-bold text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Soporte</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Términos</a>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            © 2026 Plataforma Analítica. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
