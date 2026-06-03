import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrbCardProps {
  orb: {
    label: string;
    text: string;
    color: string;
    shadow: string;
    pos?: { x: number; y: number };
  };
  lines: string[];
  delay: number;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export const OrbCard = ({ orb, lines, delay, onHoverStart, onHoverEnd }: OrbCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const isOrbital = !!orb.pos;

  // ── Mobile / Grid mode: tarjeta acordeón ──
  if (!isOrbital) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 15, delay }}
        className="w-full"
      >
        <div
          onClick={() => setExpanded(v => !v)}
          className={cn(
            "w-full rounded-2xl border-2 border-white/40 cursor-pointer bg-gradient-to-br text-white overflow-hidden shadow-[0_0_30px_-5px]",
            orb.color,
            orb.shadow
          )}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/70 mb-0.5">{orb.label}</p>
              <p className="text-[11px] font-bold text-white leading-tight line-clamp-2">{lines[0] || '—'}</p>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0"
            >
              <ChevronRight className="w-4 h-4 text-white/70" />
            </motion.div>
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-1.5 border-t border-white/20 pt-3">
                  {lines.map((line, li) => (
                    <p key={li} className="text-[11px] text-white leading-relaxed font-medium">{line}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // ── Desktop / Orbital mode: círculo expansible ──
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{ opacity: 1, scale: 1, x: orb.pos!.x, y: orb.pos!.y }}
      transition={{ type: "spring", damping: 12, delay }}
      className="absolute z-50"
    >
      <motion.div
        layout
        onClick={() => setExpanded(v => !v)}
        onHoverStart={() => {
          setExpanded(true);
          onHoverStart?.();
        }}
        onHoverEnd={() => {
          setExpanded(false);
          onHoverEnd?.();
        }}
        animate={expanded
          ? { borderRadius: "1.5rem", width: 260, height: "auto" }
          : { borderRadius: "9999px", width: 160, height: 160 }
        }
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={cn(
          "shadow-[0_0_50px_-5px] flex flex-col items-center justify-center text-white border-2 border-white/40 cursor-pointer bg-gradient-to-br overflow-hidden",
          orb.color,
          orb.shadow
        )}
        style={{ minHeight: expanded ? undefined : 160 }}
      >
        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center justify-center w-full h-full px-3 py-3"
            >
              <span className="text-[8px] font-black uppercase tracking-widest text-white/70 text-center mb-1">
                {orb.label}
              </span>
              <span className="text-[9px] font-bold text-white text-center leading-tight line-clamp-3">
                {lines[0] || "—"}
              </span>
              <motion.div
                className="mt-2 flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Info className="w-2.5 h-2.5 text-white/80" />
                <span className="text-[7px] font-black text-white/70 uppercase tracking-widest">Ver más</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full px-5 py-5"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 mb-3 text-center">
                {orb.label}
              </p>
              <div className="space-y-2">
                {lines.map((line, li) => (
                  <p key={li} className="text-[12px] text-white leading-relaxed font-medium">
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
