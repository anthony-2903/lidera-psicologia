import { UsersRound, PieChart as PieChartIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPANY_BAR_COLORS } from "../constants";

interface SummaryChartsProps {
  companyData: {
    company: string;
    count: number;
    percentage: string | number;
  }[];
  statusTotals: {
    completo: number;
    proceso: number;
    falta: number;
  };
}

export const SummaryCharts = ({ companyData, statusTotals }: SummaryChartsProps) => {
  const statusData = [
    { label: "Aplicadas", name: "Aplicadas", value: statusTotals.completo, color: "#22c55e" },
    { label: "En Proceso", name: "En Proceso", value: statusTotals.proceso, color: "#f59e0b" },
    { label: "Pendientes", name: "Pendientes", value: statusTotals.falta, color: "#ef4444" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="border-border/40 bg-white/60 backdrop-blur-xl shadow-2xl p-4 sm:p-8 rounded-2xl sm:rounded-[3rem] overflow-hidden group">
        <CardHeader className="px-0 pt-0 pb-8">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-[#1e293b] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#1e293b]/10 flex items-center justify-center text-[#1e293b]">
              <PieChartIcon className="w-4 h-4" />
            </div>
            Distribución por Estado
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[250px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart split-type="donut">
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    dataKey="value"
                    paddingAngle={5}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "24px", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {statusData.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/10">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                    <span className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</span>
                  </div>
                  <span className="text-lg font-black">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-white/60 backdrop-blur-xl shadow-2xl p-4 sm:p-8 rounded-2xl sm:rounded-[3rem] overflow-hidden group">
        <CardHeader className="px-0 pt-0 pb-8">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-[#6366f1] flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <UsersRound className="w-5 h-5" />
            </div>
            Participantes por Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
                  </linearGradient>
                  {companyData.map((_, index) => (
                    <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={COMPANY_BAR_COLORS[index % COMPANY_BAR_COLORS.length]} stopOpacity={0.7} />
                      <stop offset="100%" stopColor={COMPANY_BAR_COLORS[index % COMPANY_BAR_COLORS.length]} stopOpacity={1} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.05} />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="company"
                  width={120}
                  tick={{ fontSize: 9, fontWeight: 900, fill: "hsl(var(--foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(99, 102, 241, 0.05)", radius: 10 }}
                  contentStyle={{ borderRadius: "24px", border: "none", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                />
                <Bar
                  dataKey="count"
                  radius={[0, 20, 20, 0]}
                  barSize={24}
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  <LabelList
                    dataKey="percentage"
                    position="right"
                    formatter={(val: string) => `${val}%`}
                    style={{ fontSize: "10px", fontWeight: "900", fill: "hsl(var(--muted-foreground))" }}
                    offset={10}
                  />
                  {companyData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={`url(#grad-${index})`}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
