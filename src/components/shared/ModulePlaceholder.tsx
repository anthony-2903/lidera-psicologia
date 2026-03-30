import { construction } from "lucide-react";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const ModulePlaceholder = ({ title, description, icon }: ModulePlaceholderProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
        {icon || (
          <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        )}
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm max-w-md">{description}</p>
      <p className="text-xs text-muted-foreground/50 mt-4">Módulo en desarrollo — conecta el backend para habilitar funcionalidad completa</p>
    </div>
  );
};

export default ModulePlaceholder;
