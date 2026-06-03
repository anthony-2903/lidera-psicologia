import { ChevronRight, Search, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { RauraEntry } from "@/lib/sheets-adapter";
import { DPMS_RAURA_TABLE_COLUMN_WIDTHS, DPMS_RAURA_TABLE_WIDTH } from "../dpmsRaura.constants";

type IndividualResponsesViewProps = {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCompany: string;
  onCompanyChange: (value: string) => void;
  companies: string[];
  filteredEntries: RauraEntry[];
  selectedEntry: RauraEntry | null;
  onSelectEntry: (entry: RauraEntry) => void;
  tableOffsetX: number;
  onTableOffsetXChange: (value: number) => void;
};

export const IndividualResponsesView = ({
  search,
  onSearchChange,
  selectedCompany,
  onCompanyChange,
  companies,
  filteredEntries,
  selectedEntry,
  onSelectEntry,
  tableOffsetX,
  onTableOffsetXChange,
}: IndividualResponsesViewProps) => (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-16 duration-1000 fill-mode-forwards">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-6 flex-1 items-center">
                <div className="relative flex-1 group w-full">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 to-blue-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                  <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-primary relative z-10" />
                  <Input
                    placeholder="Buscar por Área, Personal, Empresa o Contrata..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-20 h-20 bg-white/60 backdrop-blur-3xl border-border/40 rounded-[2rem] shadow-2xl focus:ring-8 focus:ring-primary/5 text-xl font-black tracking-tight relative z-10 border-2"
                  />
                </div>

                <Select
                  value={selectedCompany}
                  onValueChange={onCompanyChange}
                >
                  <SelectTrigger className="w-full sm:w-[280px] h-20 bg-white/60 backdrop-blur-3xl border-border/40 rounded-[2rem] shadow-2xl text-lg font-black tracking-tight border-2 px-8">
                    <SelectValue placeholder="Filtrar por Empresa" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 bg-white/90 backdrop-blur-xl">
                    <SelectItem value="all" className="font-bold py-3">
                      Todas las Empresas
                    </SelectItem>
                    {companies.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="font-bold py-3 uppercase"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="hidden xl:flex items-center gap-8 bg-card px-16 py-7 rounded-[3rem] border-2 border-border/20 shadow-3xl group ">
                <div className="text-right border-r-2 border-border/20 pr-10">
                  <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-2 italic">
                    Neural Index
                  </p>
                  <p className="text-xs font-bold text-primary">
                    Active Search_
                  </p>
                </div>
                <div>
                  <p className="text-5xl font-black text-foreground tabular-nums tracking-tighter italic">
                    {filteredEntries.length}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-1">
                    Found
                  </p>
                </div>
              </div>
            </div>

            <Card className="border-2 shadow-2xl rounded-[2.5rem] overflow-visible bg-white/40 backdrop-blur-3xl border-border/40">
              <div className="sticky top-0 z-30 overflow-hidden rounded-t-[2.5rem] border-b border-border/30 bg-slate-100/95 shadow-lg backdrop-blur-md">
                <div
                  style={{
                    width: `${DPMS_RAURA_TABLE_WIDTH}px`,
                    marginLeft: `-${tableOffsetX}px`,
                  }}
                >
                  <Table className="w-full table-fixed">
                    <colgroup>
                      {DPMS_RAURA_TABLE_COLUMN_WIDTHS.map((width, index) => (
                        <col key={index} style={{ width }} />
                      ))}
                    </colgroup>
                    <TableHeader className="bg-slate-100/95">
                      <TableRow className="hover:bg-transparent border-b-2">
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 px-8 bg-slate-100/95 shadow-sm">
                          N°
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          Área
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          Fecha
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          Personal de dirección
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          Empresa
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm">
                          Nombre de Empresa o Contrata
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm text-center">
                          Encuestas
                        </TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 bg-slate-100/95 shadow-sm text-center">
                          Detalle
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </div>
              </div>

              <div className="h-[48vh] min-h-[320px] max-h-[560px] overflow-y-scroll overflow-x-hidden custom-scrollbar relative">
                <div
                  style={{
                    width: `${DPMS_RAURA_TABLE_WIDTH}px`,
                    marginLeft: `-${tableOffsetX}px`,
                  }}
                >
                  <Table className="w-full table-fixed">
                    <colgroup>
                      {DPMS_RAURA_TABLE_COLUMN_WIDTHS.map((width, index) => (
                        <col key={index} style={{ width }} />
                      ))}
                    </colgroup>
                    <TableHeader className="hidden">
                      <TableRow className="hover:bg-transparent border-b-2">
                        <TableHead>N°</TableHead>
                        <TableHead>Área</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Personal de dirección</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Nombre de Empresa o Contrata</TableHead>
                        <TableHead>Encuestas</TableHead>
                        <TableHead>Detalle</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntries.map((entry) => (
                        <TableRow
                          key={entry.id}
                          onClick={() => onSelectEntry(entry)}
                          className={cn(
                            "group hover:bg-muted/30 transition-colors border-b-border/10 cursor-pointer",
                            selectedEntry?.id === entry.id ? "bg-primary/5" : "",
                          )}
                        >
                          <TableCell className="font-mono text-[10px] font-bold text-muted-foreground/40 px-8 py-5">
                            #{entry.id}
                          </TableCell>
                          <TableCell>
                            <span className="text-[11px] font-black text-foreground group-hover:translate-x-1 transition-transform uppercase italic tracking-tight truncate block">
                              {entry.area}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-[10px] font-black uppercase text-muted-foreground italic whitespace-nowrap">
                              {entry.fecha}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                <User className="w-4 h-4" />
                              </div>
                              <span className="font-black italic uppercase text-xs tracking-tight group-hover:translate-x-1 transition-transform truncate">
                                {entry.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="text-[9px] font-black bg-primary/5 text-primary border-primary/10 uppercase italic"
                            >
                              {entry.empresa}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase truncate">
                              {entry.contrata || "No especificado"}
                            </p>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className="text-[9px] font-bold border-primary/20 bg-primary/5 text-primary whitespace-nowrap"
                            >
                              {Object.keys(entry.responses || {}).length} respuestas
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border/40 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:rotate-12 transition-all shadow-lg">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="border-t border-border/30 bg-white/95 px-4 py-3 rounded-b-[2.5rem]">
                <div
                  className="driver-safety-scrollbar overflow-x-scroll overflow-y-hidden rounded-full bg-slate-100/80 border border-slate-200/80 shadow-inner"
                  aria-label="Desplazamiento horizontal de la tabla DPMS-Raura"
                  onScroll={(event) => onTableOffsetXChange(event.currentTarget.scrollLeft)}
                >
                  <div
                    className="h-3"
                    style={{ width: `${DPMS_RAURA_TABLE_WIDTH}px` }}
                  />
                </div>
              </div>
            </Card>
          </div>
);
