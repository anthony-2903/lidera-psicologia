import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, Legend } from "recharts";
import { ComparisonRadarItem, RadarDataItem } from "@/types";

interface ComparisonRadarProps {
  activePhase: 'pre' | 'post' | 'comp';
  data: (RadarDataItem | ComparisonRadarItem)[];
}

export const ComparisonRadar = ({ activePhase, data }: ComparisonRadarProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius="75%" 
        data={data}
      >
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 900, fill: "hsl(var(--foreground))" }} />
        
        {activePhase === 'comp' ? (
          <>
            <Radar 
              name="PRE" 
              dataKey="pre" 
              stroke="#6366f1" 
              fill="#6366f1" 
              fillOpacity={0.3} 
              strokeWidth={2}
            />
            <Radar 
              name="POST" 
              dataKey="post" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.6} 
              strokeWidth={3}
            />
            <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
          </>
        ) : (
          <Radar 
            name="Resultado" 
            dataKey="A" 
            stroke={activePhase === 'pre' ? "#6366f1" : "#10b981"} 
            fill={activePhase === 'pre' ? "#6366f1" : "#10b981"} 
            fillOpacity={0.6} 
            strokeWidth={3}
          />
        )}
        
        <Radar 
          name="Objetivo" 
          dataKey={activePhase === 'comp' ? "target" : "B"} 
          stroke="#94a3b8" 
          fill="#94a3b8" 
          fillOpacity={0.05} 
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)', background: 'rgba(255,255,255,0.9)', padding: '12px' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};
