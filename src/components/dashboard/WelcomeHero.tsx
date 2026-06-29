import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Radar,
  ShieldCheck,
} from "lucide-react";

interface WelcomeHeroProps {
  email: string;
  onDismiss: () => void;
}

const extractName = (email: string) => {
  if (!email) return "Invitado";
  const namePart = email.split("@")[0];
  const name = namePart.split(".")[0].replace(/[-_]/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const insightCards = [
  {
    icon: Brain,
    title: "Modelo psicologico",
    value: "6 dimensiones",
    color: "text-sky-700",
    bg: "bg-sky-50",
  },
  {
    icon: ShieldCheck,
    title: "Prevencion operacional",
    value: "riesgo priorizado",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  {
    icon: Radar,
    title: "Senales tempranas",
    value: "monitoreo activo",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
];

const barData = [72, 86, 64, 91, 78, 88, 69, 95];

export const WelcomeHero = ({ email, onDismiss }: WelcomeHeroProps) => {
  const name = extractName(email);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#f4f7fb] px-4 py-5 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        animate={{ opacity: [0.35, 0.9, 0.35] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:grid-cols-[1.02fr_0.98fr]"
      >
        <div className="flex min-h-[520px] flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12">
          <div className="space-y-8">
            <motion.div
              initial={{ x: -18, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.55 }}
              className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.32em] text-primary"
            >
              <span className="h-px w-10 bg-primary" />
              Sistema inteligente Lidera Mina
            </motion.div>

            <div className="space-y-5">
              <motion.h1
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.22, duration: 0.6 }}
                className="max-w-2xl text-4xl font-black leading-[0.98] tracking-normal text-slate-950 sm:text-5xl lg:text-6xl"
              >
                Hola, <span className="text-primary">{name}</span>.
                <span className="block text-slate-500">
                  Bienvenido al centro de inteligencia.
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.32, duration: 0.6 }}
                className="max-w-xl text-base font-medium leading-7 text-slate-600 sm:text-lg"
              >
                Accede a una lectura ejecutiva del comportamiento, la seguridad
                y los factores criticos que impulsan decisiones preventivas en
                la operacion.
              </motion.p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {insightCards.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.42 + index * 0.08, duration: 0.5 }}
                  className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm"
                >
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${item.bg} ${item.color}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.72, duration: 0.5 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDismiss}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-7 py-4 text-[12px] font-black uppercase tracking-[0.22em] text-white shadow-[0_18px_35px_-18px_hsl(var(--primary))] transition hover:bg-primary/95 sm:w-fit"
          >
            Ingresar al dashboard
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden border-t border-slate-200/70 bg-slate-950 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <motion.div
            className="absolute inset-0 opacity-35"
            style={{
              background:
                "linear-gradient(115deg, transparent 0%, rgba(14,165,233,0.22) 38%, transparent 62%), radial-gradient(circle at 70% 20%, rgba(34,197,94,0.22), transparent 34%)",
            }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.075)_1px,transparent_1px)] bg-[size:36px_36px]" />

          <motion.div
            initial={{ y: 22, opacity: 0, rotateX: 10 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ delay: 0.26, duration: 0.75, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-normal text-white">
                  Lectura operacional en vivo
                </h2>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Indice preventivo
                  </p>
                  <p className="mt-1 text-4xl font-black text-white">89%</p>
                </div>
                <Activity className="h-8 w-8 text-emerald-300" />
              </div>

              <div className="flex h-28 items-end gap-2">
                {barData.map((height, index) => (
                  <motion.div
                    key={`${height}-${index}`}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-primary to-sky-300"
                    initial={{ height: 8 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      delay: 0.6 + index * 0.06,
                      duration: 0.75,
                      repeat: Infinity,
                      repeatType: "mirror",
                      repeatDelay: 2.4,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-xl border border-white/10 bg-white/[0.07] p-4"
              >
                <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Estado
                </p>
                <p className="mt-1 text-sm font-black text-white">
                  Optimizado
                </p>
              </motion.div>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-xl border border-white/10 bg-white/[0.07] p-4"
              >
                <BarChart3 className="mb-3 h-5 w-5 text-sky-300" />
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Fidelidad
                </p>
                <p className="mt-1 text-sm font-black text-white">99.8%</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};
