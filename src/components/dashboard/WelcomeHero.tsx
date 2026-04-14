import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, ShieldCheck, Zap, ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WelcomeHeroProps {
  email: string;
  onDismiss: () => void;
}

export const WelcomeHero = ({ email, onDismiss }: WelcomeHeroProps) => {
  // Extract name from email (e.g., "anthony.gonzalez@lidera.com" -> "Anthony")
  const extractName = (email: string) => {
    if (!email) return "Invitado";
    const namePart = email.split("@")[0];
    const name = namePart.split(".")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const name = extractName(email);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative min-h-screen lg:min-h-[80vh] flex items-center justify-center p-4 md:p-6"
    >
      {/* Background Glows (Decorative) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] -z-10" />

      <motion.div className="relative w-full max-w-6xl bg-white/40 backdrop-blur-3xl shadow-[0_40px_140px_-30px_rgba(0,0,0,0.15)] rounded-3xl md:rounded-[4rem] overflow-hidden border border-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-fit lg:min-h-[600px]">
          {/* LEFT: CONTENT (7 columns for more impact) */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-20 space-y-8 lg:space-y-10 flex flex-col justify-center">
            <div className="space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.4em] text-[11px]"
              >
                <div className="w-10 h-[2px] bg-primary" />
                SISTEMA INTELIGENTE LIDERA MINA
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-slate-800 leading-[0.95] lg:leading-[0.9]">
                Hola, <span className="text-primary italic">{name}</span>.{" "}
                <br />
                <span className="text-slate-400">Bienvenido/a.</span>
              </h1>
            </div>

            <p className="max-w-xl text-base sm:text-lg lg:text-xl text-slate-400 font-medium leading-relaxed tracking-tight italic">
              "Estás a punto de acceder al más avanzado{" "}
              <span className="text-slate-600 font-bold">
                ecosistema de gestión psicológica y operacional
              </span>
              . Nuestra IA experta está lista para analizar cada dimensión
              conductual de tu equipo."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
              {[
                {
                  icon: Brain,
                  label: "IA Psicológica",
                  desc: "Expert Analysis",
                },
                {
                  icon: ShieldCheck,
                  label: "Prevención Operacional",
                  desc: "Risk Management",
                },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 p-2 transition-all"
                >
                  <div className="w-14 h-14 rounded-3xl bg-white shadow-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-black uppercase tracking-widest text-slate-800">
                      {feat.label}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 tracking-tighter">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onDismiss}
              className="w-full sm:w-fit px-12 py-6 bg-primary text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[13px] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4 group"
            >
              Ingresar al Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* RIGHT: VISUAL (5 columns) */}
          <div className="lg:col-span-5 relative bg-slate-50/50 flex items-center justify-center p-8 sm:p-12 overflow-hidden border-t lg:border-t-0 lg:border-l border-white/50">
            <div className="w-full relative max-w-sm">
              <motion.div
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 6, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 aspect-[4/5] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-3xl md:rounded-[4rem] border border-white p-6 sm:p-10 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                      <Brain className="w-8 h-8" />
                    </div>
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white shadow-sm"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tight text-slate-800">
                      IA Activa
                    </h3>
                    <p className="text-sm font-semibold text-slate-400 leading-relaxed italic">
                      Analizando patrones psicométricos y operacionales en
                      tiempo real para optimizar la toma de decisiones
                      preventiva.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between font-black text-[9px] uppercase tracking-widest text-slate-300">
                    <span>Estado: Optimizado</span>
                    <span>Fidelidad: 99.8%</span>
                  </div>
                </div>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[110%] bg-primary/5 rounded-full blur-[80px] -z-10" />
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("px-2 py-1 rounded-full text-xs font-medium", className)}>
    {children}
  </div>
);
