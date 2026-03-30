import { Users, UsersRound, CheckCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const kpis = [
  { label: "Total Participantes", value: "48", icon: Users, color: "text-info" },
  { label: "Total Grupos", value: "6", icon: UsersRound, color: "text-primary" },
  { label: "Completados", value: "72%", icon: CheckCircle, color: "text-success" },
  { label: "Media de Edad", value: "34.5", icon: Calendar, color: "text-accent" },
];

const genderData = [
  { name: "Masculino", value: 35, color: "hsl(212, 52%, 25%)" },
  { name: "Femenino", value: 11, color: "hsl(38, 92%, 50%)" },
  { name: "Otro", value: 2, color: "hsl(142, 71%, 45%)" },
];

const areaData = [
  { area: "Operaciones", count: 15 },
  { area: "Mantenimiento", count: 10 },
  { area: "Seguridad", count: 8 },
  { area: "Geología", count: 7 },
  { area: "Administración", count: 5 },
  { area: "Logística", count: 3 },
];

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard General</h1>
        <p className="text-muted-foreground text-sm mt-1">Vista general del programa de liderazgo</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="shadow-md border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{kpi.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${kpi.color}`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <Card className="shadow-md border-border">
          <CardHeader>
            <CardTitle className="text-base">Distribución por Género</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {genderData.map((g) => (
                <div key={g.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                  <span className="text-muted-foreground">{g.name}: {g.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Area Distribution */}
        <Card className="shadow-md border-border">
          <CardHeader>
            <CardTitle className="text-base">Participantes por Área</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={areaData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="area" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(212, 52%, 25%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
