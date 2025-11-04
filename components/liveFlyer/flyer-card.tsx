"use client"

import Image from "next/image"
import { type Flyer, getRibbons } from "@/lib/flyer-data"
import { RibbonBadge } from "./ribbon-badge"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"

interface FlyerCardProps {
  flyer: Flyer
  onEdit: (flyer: Flyer) => void
  onDelete: (flyer: Flyer) => void
}

export function FlyerCard({ flyer, onEdit, onDelete }: FlyerCardProps) {
  const ribbons = getRibbons(flyer)

  return (
    <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-card border border-border group">
      {/* Ribbons Container */}
      <div className="absolute top-3 left-3 space-y-1.5 z-10">
        {ribbons.map((ribbon, idx) => (
          <RibbonBadge key={idx} text={ribbon.text} color={ribbon.color} size={ribbon.size} />
        ))}
      </div>

      <div className="absolute top-3 right-3 flex gap-2 opacity-100 z-20">
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
          onClick={() => onEdit(flyer)}
          title="Edit flyer"
        >
          <Edit className="h-4 w-4 text-blue-600" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 bg-white/90 hover:bg-red-100 shadow-md"
          onClick={() => onDelete(flyer)}
          title="Delete flyer"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>

      {/* Flyer Image */}
      <div className="relative w-full h-48 overflow-hidden bg-muted">
        <Image
          src={flyer.image || "/placeholder.svg"}
          alt={flyer.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Flyer Info */}
      <div className="p-3 text-center border-t border-border">
        <p className="font-semibold text-sm text-foreground truncate">{flyer.title}</p>
        <p className="text-xs text-muted-foreground mt-1">${flyer.price}</p>
        <p className="text-xs text-muted-foreground">{flyer.formType}</p>
      </div>
    </div>
  )
}
