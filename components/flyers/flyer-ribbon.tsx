"use client"

interface FlyerRibbonProps {
  isPhotoFlyer?: boolean
  isPremium?: boolean
  size?: "sm" | "md" | "lg"
}

export function FlyerRibbon({ isPhotoFlyer, isPremium, size = "md" }: FlyerRibbonProps) {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-3 py-1.5",
  }

  return (
    <div className="absolute top-2 right-2 flex flex-col gap-1">
      {isPhotoFlyer && <div className={`bg-[#E50914] text-white font-bold rounded ${sizeClasses[size]}`}>PHOTO</div>}
      {isPremium && <div className={`bg-yellow-600 text-white font-bold rounded ${sizeClasses[size]}`}>PREMIUM</div>}
    </div>
  )
}
