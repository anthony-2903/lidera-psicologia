import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BelbinResultsProps {
  scores: Record<string, number>;
}

const BelbinResults = ({ scores }: BelbinResultsProps) => {
  // Simple mock mapping to role names for visualization
  // Real Belbin scoring involves a complex mapping matrix A-I to roles
  const data = [
    { name: "Cerebro", value: 15, color: "#6366f1" },
    { name: "Investigador", value: 12, color: "#8b5cf6" },
    { name: "Coordinador", value: 18, color: "#a855f7" },
    { name: "Impulsor", value: 10, color: "#d946ef" },
    { name: "Monitor", value: 8, color: "#ec4899" },
    { name: "Cohesionador", value: 14, color: "#f43f5e" },
    { name: "Implementador", value: 9, color: "#f97316" },
    { name: "Finalizador", value: 11, color: "#eab308" },
    { name: "Especialista", value: 7, color: "#22c55e" },
  ];

  return (
    <div className="py-10 space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none ring-1 ring-white/10 bg-card/40 backdrop-blur-md rounded-[32px] overflow-hidden p-8 h-[500px]">
          <CardHeader className="p-0 pb-8">
            <CardTitle className="text-2xl font-black tracking-tight text-left">Distribución de Roles de Equipo</CardTitle>
            <CardDescription className="font-bold text-muted-foreground text-left">Perfil predominante basado en su autopercepción.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ 
                    backgroundColor: "rgba(15, 15, 20, 0.9)", 
                    borderRadius: "16px", 
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontWeight: "900"
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none ring-1 ring-white/10 bg-primary/10 text-primary rounded-[32px] p-8">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-left">Rol Dominante</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-left">
              <h4 className="text-4xl font-black tracking-tighter">Coordinador</h4>
              <p className="text-xs font-bold text-primary/70 mt-2 uppercase tracking-widest leading-relaxed">
                Usted es maduro y seguro de sí mismo. Identifica el talento y aclara las metas de su equipo con naturalidad.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none ring-1 ring-white/10 bg-card/40 backdrop-blur-md rounded-[32px] p-8 text-left">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Recomendación General</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm font-bold text-foreground/80 leading-relaxed italic">
                "Usted tiende a delegar bien, pero tenga cuidado de no ser percibido como alguien que evita su propio trabajo."
              </p>
              <div className="mt-6 flex gap-2">
                <Badge className="bg-indigo-500/10 text-indigo-500 border-none">LÍDER</Badge>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none">SOCIAL</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BelbinResults;
