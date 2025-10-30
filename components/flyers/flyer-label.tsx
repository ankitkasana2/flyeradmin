"use client"

interface FlyerLabelProps {
  label: string
  variant?: "photo" | "premium" | "new" | "featured" | "custom"
  customColor?: string
}

export function FlyerLabel({ label, variant = "custom", customColor }: FlyerLabelProps) {
  const variantStyles = {
    photo: "bg-[#E50914] text-white",
    premium: "bg-yellow-600 text-white",
    new: "bg-green-600 text-white",
    featured: "bg-blue-600 text-white",
    custom: `${customColor || "bg-gray-600"} text-white`,
  }

  return <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${variantStyles[variant]}`}>{label}</span>
}
