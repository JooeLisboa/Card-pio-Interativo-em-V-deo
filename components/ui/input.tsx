import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm shadow-sm outline-none transition placeholder:text-stone-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10",
          className
        )}
        {...props}
      />
    );
  }
);
