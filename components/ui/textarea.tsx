import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-28 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm shadow-sm outline-none transition placeholder:text-stone-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10",
          className
        )}
        {...props}
      />
    );
  }
);
