import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DimensionesEntry } from "@/lib/sheets-adapter";

export const Silhouette = ({ entry, colorClass }: { entry: DimensionesEntry, colorClass: string }) => {
    const imageSrc = entry.genero === 'FEMENINO' 
        ? "/iconos genero/icono mujer.webp" 
        : "/iconos genero/icono hombre.webp";

    return (
        <motion.div 
            className="relative flex items-center justify-center w-full min-h-[400px]"
            animate={{ 
                y: [-12, 12, -12],
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <motion.div 
              className="absolute w-56 h-56 bg-primary/20 blur-[80px] rounded-full"
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className={cn("relative z-10 drop-shadow-[0_0_20px_rgba(15,118,110,0.15)] transition-all duration-1000", colorClass)}>
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <img 
                        src={imageSrc} 
                        alt={entry.genero}
                        className="w-64 h-auto max-h-[350px] object-contain drop-shadow-2xl"
                    />
                </motion.div>
            </div>
            
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-36 h-6">
                <motion.div 
                  className="w-full h-full bg-primary/10 rounded-full blur-xl"
                  animate={{ scaleX: [1, 1.6, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
            </div>
        </motion.div>
    );
};
