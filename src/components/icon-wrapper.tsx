import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function IconWrapper({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-12 h-12 bg-accent/20 rounded-full",
        className
      )}
    >
      <Icon className="w-6 h-6 text-accent" />
    </div>
  );
}
