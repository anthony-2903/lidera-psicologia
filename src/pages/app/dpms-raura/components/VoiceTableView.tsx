import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RauraEntry } from "@/lib/sheets-adapter";
import { getInterpretation } from "../dpmsRaura.utils";

export const VoiceTableView = ({ entries }: { entries: RauraEntry[] }) => (
  <div className="columns-1 md:columns-2 xl:columns-3 2xl:columns-4 gap-5 animate-in fade-in zoom-in-95 duration-700 fill-mode-forwards">
    {entries
      .filter((entry) => entry.comentarios)
      .map((entry) => (
        <div key={entry.id} className="mb-5 break-inside-avoid">
          <Card className="rounded-lg border border-slate-200/80 bg-white/90 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md">
            <CardHeader className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <Badge className="max-w-full rounded-md border-0 bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primary shadow-none">
                    <span className="truncate">{entry.area}</span>
                  </Badge>
                  <p className="truncate text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                    {entry.cargo}
                  </p>
                </div>
                <div className="shrink-0 text-[10px] font-bold text-muted-foreground/45">
                  #{entry.id}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 py-4">
              <p className="text-sm font-medium leading-relaxed text-slate-700">
                "{getInterpretation(entry.comentarios)}"
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex min-w-0 items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span className="truncate text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Feedback verificado
                  </span>
                </div>
                <span className="shrink-0 text-[10px] font-bold text-muted-foreground/60">
                  {entry.fecha}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
  </div>
);
