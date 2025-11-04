import { cn } from "@/lib/utils"

interface RibbonBadgeProps {
  text: string
  color: "gold" | "red"
  size?: "sm" | "md"
}

export function RibbonBadge({ text, color, size = "md" }: RibbonBadgeProps) {
  const colorClasses = {
    gold: "bg-yellow-500 text-gray-900",
    red: "bg-red-600 text-white",
  }

  const sizeClasses = {
    sm: "text-[9px] px-1.5 py-0.5",
    md: "text-[11px] px-2 py-1",
  }

  return (
    <div
      className={cn(
        "font-bold rounded-sm shadow-lg w-fit transform -rotate-12",
        colorClasses[color],
        sizeClasses[size],
      )}
    >
      {text}
    </div>
  )
}
