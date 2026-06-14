import { Check as CheckIcon, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const MultiSelectFilter = ({
  label,
  options,
  selected,
  onChange,
  placeholder,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) => {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full h-12 justify-between bg-white/50 border-border/40 rounded-xl shadow-sm text-[11px] font-bold px-3",
              selected.length === 0 && "text-muted-foreground",
            )}
          >
            <div className="flex gap-1 items-center overflow-hidden">
              {selected.length > 0 ? (
                <div className="flex items-center gap-1">
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 rounded-md bg-primary/10 text-primary border-none text-[9px] font-black"
                  >
                    {selected.length}
                  </Badge>
                  <span className="truncate max-w-[120px]">
                    {selected.length === options.length
                      ? "Todos"
                      : selected.join(", ")}
                  </span>
                </div>
              ) : (
                placeholder || "Seleccionar..."
              )}
            </div>
            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[240px] p-0 rounded-2xl shadow-2xl border-primary/5 z-[100]"
          align="start"
        >
          <Command className="rounded-2xl">
            <CommandInput
              placeholder={`Buscar ${label.toLowerCase()}...`}
              className="h-10 text-xs"
            />
            <CommandList className="max-h-[300px] custom-scrollbar">
              <CommandEmpty className="py-4 text-xs text-center text-muted-foreground">
                No se encontraron resultados.
              </CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    if (selected.length === options.length) {
                      onChange([]);
                    } else {
                      onChange([...options]);
                    }
                  }}
                  className="flex items-center gap-2 cursor-pointer py-2.5 px-3 aria-selected:bg-primary/5"
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border border-primary transition-colors",
                      selected.length === options.length
                        ? "bg-primary text-primary-foreground"
                        : "bg-transparent",
                    )}
                  >
                    {selected.length === options.length && (
                      <CheckIcon className="h-3 w-3" />
                    )}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tight">
                    Seleccionar Todos
                  </span>
                </CommandItem>
                <div className="h-px bg-border/40 my-1 mx-1" />
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      const newSelected = selected.includes(option)
                        ? selected.filter((v) => v !== option)
                        : [...selected, option];
                      onChange(newSelected);
                    }}
                    className="flex items-center gap-2 cursor-pointer py-2.5 px-3 aria-selected:bg-primary/5"
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border border-primary transition-colors",
                        selected.includes(option)
                          ? "bg-primary text-primary-foreground"
                          : "bg-transparent",
                      )}
                    >
                      {selected.includes(option) && (
                        <CheckIcon className="h-3 w-3" />
                      )}
                    </div>
                    <span className="text-xs font-medium">{option}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

