import { cn } from "@/lib/utils";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  indicatorClassName?: string;
}

export function ProgressBar({ value, className, indicatorClassName, ...props }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 bg-slate-900 transition-all", indicatorClassName)}
        style={{ transform: `translateX(-${100 - safeValue}%)`,borderRight:"2px solid brown",borderRadius:"0%" }}
      />
    </div>
  );
}
