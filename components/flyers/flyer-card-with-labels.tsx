"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FlyerRibbon } from "./flyer-ribbon"
import { FlyerLabel } from "./flyer-label"

interface FlyerCardWithLabelsProps {
  id: number
  title: string
  thumbnail?: string
  price: "$10" | "$15" | "$40"
  category: string
  formType: "With Photo" | "Only Info" | "Birthday"
  isPremium?: boolean
  isPhotoFlyer?: boolean
  isNew?: boolean
  isFeatured?: boolean
}

export function FlyerCardWithLabels({
  id,
  title,
  thumbnail,
  price,
  category,
  formType,
  isPremium,
  isPhotoFlyer,
  isNew,
  isFeatured,
}: FlyerCardWithLabelsProps) {
  return (
    <Card className="bg-card border-border overflow-hidden hover:border-[#E50914]/50 transition-colors">
      {/* Thumbnail with Ribbons */}
      <div className="relative w-full h-40 bg-secondary flex items-center justify-center overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-muted-foreground text-sm">No image</div>
        )}
        <FlyerRibbon isPhotoFlyer={isPhotoFlyer} isPremium={isPremium} />
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-semibold text-foreground truncate">{title}</h3>
          <p className="text-xs text-muted-foreground">{category}</p>
        </div>

        {/* Labels */}
        <div className="flex flex-wrap gap-2">
          {isPhotoFlyer && <FlyerLabel label="PHOTO" variant="photo" />}
          {isPremium && <FlyerLabel label="PREMIUM" variant="premium" />}
          {isNew && <FlyerLabel label="NEW" variant="new" />}
          {isFeatured && <FlyerLabel label="FEATURED" variant="featured" />}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className="font-semibold text-primary">{price}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Form Type</p>
            <p className="font-semibold text-foreground">{formType}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
