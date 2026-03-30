import { Shield, Brain, Users, TrendingUp, Target, ChevronRight, HardHat, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Evaluación Psicológica",
    description: "Diagnóstico integral de competencias de liderazgo mediante instrumentos validados científicamente.",
  },
  {
    icon: Shield,
    title: "Seguridad Conductual",
    description: "Fortalecimiento de comportamientos seguros a través del liderazgo consciente en operaciones mineras.",
  },
  {
    icon: Target,
    title: "Planes de Acción 70-20-10",
    description: "Metodología probada: 70% experiencial, 20% social y 10% formal para desarrollo de competencias.",
  },
  {
    icon: TrendingUp,
    title: "Medición de Impacto",
    description: "Comparativa PRE vs POST con dashboards en tiempo real para demostrar resultados tangibles.",
  },
];

const stats = [
  { value: "95%", label: "Reducción de incidentes" },
  { value: "300+", label: "Líderes capacitados" },
  { value: "12", label: "Operaciones mineras" },
  { value: "4.8/5", label: "Satisfacción promedio" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-info blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <nav className="relative z-10 container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
              <HardHat className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-primary-foreground tracking-tight">
              LideraMina
            </span>
          </div>
          <Button
            variant="outline"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </Button>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              Programa de Liderazgo en Seguridad Minera
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
              Transforma el liderazgo,{" "}
              <span className="text-accent">protege vidas</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl leading-relaxed">
              Plataforma integral de evaluación psicológica y desarrollo de competencias de liderazgo para la industria minera. Diagnóstico, intervención y medición de impacto en seguridad conductual.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="gradient-gold text-primary font-semibold text-base px-8 hover:opacity-90 transition-opacity"
                onClick={() => navigate("/login")}
              >
                Acceder al Sistema
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base"
              >
                Conocer Metodología
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 container mx-auto px-6 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-center bg-primary-foreground/5 backdrop-blur-sm rounded-xl py-5 px-4 border border-primary-foreground/10"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-accent mb-1">{stat.value}</div>
                <div className="text-sm text-primary-foreground/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Metodología integral de desarrollo
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un sistema completo que evalúa, interviene y mide el impacto del liderazgo en la seguridad operacional minera.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Proceso del programa
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cuatro fases estructuradas para garantizar resultados medibles y sostenibles.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Diagnóstico PRE", desc: "Evaluación inicial de competencias de liderazgo y comportamientos de seguridad." },
              { step: "02", title: "Plan de Acción", desc: "Diseño personalizado de intervenciones con metodología 70-20-10." },
              { step: "03", title: "Intervención", desc: "Ejecución de sesiones experienciales, sociales y formales." },
              { step: "04", title: "Evaluación POST", desc: "Medición de impacto y comparativa con resultados iniciales." },
            ].map((phase, i) => (
              <motion.div
                key={phase.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative"
              >
                <div className="text-6xl font-black text-primary/10 mb-2">{phase.step}</div>
                <h3 className="font-bold text-lg text-foreground mb-2">{phase.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="gradient-primary rounded-2xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              ¿Listo para transformar el liderazgo en tu operación?
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8 max-w-2xl mx-auto">
              Accede al sistema y comienza el diagnóstico de competencias de liderazgo de tu equipo.
            </p>
            <Button
              size="lg"
              className="gradient-gold text-primary font-semibold text-base px-10 hover:opacity-90 transition-opacity"
              onClick={() => navigate("/login")}
            >
              Comenzar ahora
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">LideraMina</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Programa de Liderazgo en Seguridad Minera. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
