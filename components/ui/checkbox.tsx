import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Checkbox({ label, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("inline-flex items-center gap-2 text-sm text-stone-700", className)}>
      <input type="checkbox" className="h-4 w-4 rounded border-stone-300 text-[var(--primary)]" {...props} />
      <span>{label}</span>
    </label>
  );
}
