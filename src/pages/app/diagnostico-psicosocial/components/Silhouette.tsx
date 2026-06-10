import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DimensionesEntry } from "@/lib/sheets-adapter";

export const Silhouette = ({ entry, colorClass }: { entry: DimensionesEntry, colorClass: string }) => {
    const isFemale = entry.genero === "FEMENINO";
    const [isModelViewerReady, setIsModelViewerReady] = useState(false);
    const [isModelLoaded, setIsModelLoaded] = useState(false);

    useEffect(() => {
        if (isFemale) return;

        let isMounted = true;
        import("@google/model-viewer").then(() => {
            if (isMounted) setIsModelViewerReady(true);
        });

        return () => {
            isMounted = false;
        };
    }, [isFemale]);

    useEffect(() => {
        setIsModelLoaded(false);
    }, [entry.genero]);

    return (
        <motion.div 
            className="relative flex w-full items-center justify-center min-h-[500px] sm:min-h-[560px] lg:min-h-[620px]"
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
              className="absolute h-72 w-72 rounded-full bg-primary/20 blur-[90px] sm:h-96 sm:w-96"
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className={cn("relative z-10 drop-shadow-[0_0_20px_rgba(15,118,110,0.15)] transition-all duration-1000", colorClass)}>
                <motion.div
                    animate={{ scale: [0.98, 1.01, 0.98] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center"
                >
                    {isFemale ? (
                        <img
                            src="/iconos genero/icono mujer.webp"
                            alt={entry.genero}
                            className="w-64 h-auto max-h-[350px] object-contain drop-shadow-2xl"
                        />
                    ) : (
                        <div
                            className="relative flex items-center justify-center"
                            style={{
                                width: "clamp(320px, 34vw, 460px)",
                                height: "clamp(500px, 58vh, 640px)",
                            }}
                        >
                            {!isModelLoaded && (
                                <div className="absolute inset-8 animate-pulse rounded-full bg-primary/10 blur-2xl" />
                            )}
                            {isModelViewerReady && (
                                <model-viewer
                                    src="/models/minero-hombre.dashboard.glb"
                                    alt="Modelo 3D de colaborador masculino"
                                    loading="lazy"
                                    reveal="auto"
                                    camera-controls
                                    auto-rotate
                                    auto-rotate-delay="0"
                                    disable-zoom
                                    interaction-prompt="none"
                                    rotation-per-second="24deg"
                                    camera-orbit="0deg 78deg 1.9m"
                                    camera-target="0m 0.01m 0m"
                                    field-of-view="34deg"
                                    shadow-intensity="0.45"
                                    exposure="0.95"
                                    onLoad={() => setIsModelLoaded(true)}
                                    className={cn(
                                        "h-full w-full opacity-0 transition-opacity duration-700",
                                        isModelLoaded && "opacity-100"
                                    )}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "block",
                                        backgroundColor: "transparent",
                                        ["--poster-color" as string]: "transparent",
                                    }}
                                />
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
            
            <div className="absolute bottom-4 left-1/2 h-6 w-44 -translate-x-1/2 sm:w-56">
                <motion.div 
                  className="w-full h-full bg-primary/10 rounded-full blur-xl"
                  animate={{ scaleX: [1, 1.6, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
            </div>
        </motion.div>
    );
};
