import { ToolOption } from "@/lib/toolConfig";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolOptionsProps {
  options: ToolOption[];
  values: Record<string, string | number | boolean>;
  onChange: (id: string, value: string | number | boolean) => void;
}

export const ToolOptions = ({ options, values, onChange }: ToolOptionsProps) => {
  if (options.length === 0) return null;

  return (
    <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
      <h3 className="font-semibold text-foreground">Options</h3>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option) => (
          <div key={option.id} className="space-y-2">
            {option.type === "checkbox" ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={Boolean(values[option.id] ?? option.defaultValue)}
                  onCheckedChange={(checked) => onChange(option.id, Boolean(checked))}
                />
                <Label htmlFor={option.id} className="text-sm font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ) : (
              <>
                <Label htmlFor={option.id} className="text-sm text-muted-foreground">
                  {option.label}
                </Label>
                
                {option.type === "select" && option.options ? (
                  <Select
                    value={(values[option.id] as string) ?? (option.defaultValue as string)}
                    onValueChange={(value) => onChange(option.id, value)}
                  >
                    <SelectTrigger id={option.id} className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {option.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : option.type === "password" ? (
                  <Input
                    id={option.id}
                    type="password"
                    placeholder={option.placeholder}
                    value={(values[option.id] as string) ?? ""}
                    onChange={(e) => onChange(option.id, e.target.value)}
                    className="bg-background"
                  />
                ) : option.type === "number" ? (
                  <Input
                    id={option.id}
                    type="number"
                    placeholder={option.placeholder}
                    value={String(values[option.id] ?? option.defaultValue ?? "")}
                    onChange={(e) => onChange(option.id, Number(e.target.value))}
                    className="bg-background"
                  />
                ) : (
                  <Input
                    id={option.id}
                    type="text"
                    placeholder={option.placeholder}
                    value={String(values[option.id] ?? "")}
                    onChange={(e) => onChange(option.id, e.target.value)}
                    className="bg-background"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
