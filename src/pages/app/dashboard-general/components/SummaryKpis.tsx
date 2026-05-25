import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface SummaryKpisProps {
  totalEvaluated: number;
  statusTotals: {
    completo: number;
    proceso: number;
    falta: number;
  };
}

const percentOf = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

export const SummaryKpis = ({ totalEvaluated, statusTotals }: SummaryKpisProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white border-2 border-emerald-500/20 rounded-[32px] p-6 flex items-center gap-6 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500">
      <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shrink-0">
        <CheckCircle className="w-8 h-8" />
      </div>
      <div className="flex-1 text-center">
        <p className="text-[10px] font-black leading-tight text-emerald-700 uppercase tracking-widest">EVALUACIONES<br />APLICADAS</p>
        <p className="text-4xl font-black text-emerald-600 mt-1">{statusTotals.completo}</p>
        <div className="mt-1 bg-emerald-500 text-white font-black text-xs px-3 py-0.5 rounded-full inline-block">
          {percentOf(statusTotals.completo, totalEvaluated)}%
        </div>
      </div>
    </div>

    <div className="bg-white border-2 border-amber-500/20 rounded-[32px] p-6 flex items-center gap-6 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500">
      <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg shrink-0">
        <Clock className="w-8 h-8 animate-pulse" />
      </div>
      <div className="flex-1 text-center">
        <p className="text-[10px] font-black leading-tight text-amber-700 uppercase tracking-widest">EN PROCESO DE<br />APLICACIÓN</p>
        <p className="text-4xl font-black text-amber-500 mt-1">{statusTotals.proceso}</p>
        <div className="mt-1 bg-amber-500 text-white font-black text-xs px-3 py-0.5 rounded-full inline-block">
          {percentOf(statusTotals.proceso, totalEvaluated)}%
        </div>
      </div>
    </div>

    <div className="bg-white border-2 border-red-500/20 rounded-[32px] p-6 flex items-center gap-6 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500">
      <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shrink-0">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="flex-1 text-center">
        <p className="text-[10px] font-black leading-tight text-red-700 uppercase tracking-widest">PENDIENTES DE<br />APLICACIÓN</p>
        <p className="text-4xl font-black text-red-500 mt-1">{statusTotals.falta}</p>
        <div className="mt-1 bg-red-500 text-white font-black text-xs px-3 py-0.5 rounded-full inline-block">
          {percentOf(statusTotals.falta, totalEvaluated)}%
        </div>
      </div>
    </div>
  </div>
);
