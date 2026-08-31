import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <div className="relative group/tooltip inline-block">
      {children}
      <div
        className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5",
          "bg-[#1D1E2C] text-white text-xs font-semibold rounded-lg shadow-lg",
          "opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200",
          "pointer-events-none z-50",
          className
        )}
      >
        {content}
        {/* Triangle pointer */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[#1D1E2C]" />
      </div>
    </div>
  );
}
