import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export const Gauge = ({ value, color, colorClass }: { value: number, color?: string, colorClass: string }) => {
    const data = [
      { value: value },
      { value: Math.max(0, 100 - value) }
    ];
  
    // Using simple color matching for the gauge based on Tailwind classes if color is not provided
    const fillColor = color || (
        colorClass.includes('emerald') ? '#10b981' : 
        colorClass.includes('amber') ? '#f59e0b' : 
        colorClass.includes('red') ? '#ef4444' : 
        colorClass.includes('cyan') ? '#06b6d4' : 
        colorClass.includes('primary') ? '#0f766e' : '#cbd5e1'
    );

    return (
      <div className="w-24 h-16 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="90%"
              startAngle={180}
              endAngle={0}
              innerRadius={25}
              outerRadius={38}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
            >
              <Cell fill={fillColor} />
              <Cell fill="rgba(0,0,0,0.05)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute bottom-1 left-0 right-0 text-center">
          <span className={cn("text-[11px] font-black", colorClass)}>{Math.round(value)}%</span>
        </div>
      </div>
    );
};

// ────────────────────────────────────────────────────────────
// OrbCard: círculo orbital con modo desktop y móvil
