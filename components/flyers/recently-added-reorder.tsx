"use client"

import type React from "react"

import { useState } from "react"
import { GripVertical, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FlyerRibbon } from "./flyer-ribbon"

interface RecentlyAddedFlyer {
  id: number
  title: string
  thumbnail?: string
  price: "$10" | "$15" | "$40"
  isPremium: boolean
  isPhotoFlyer: boolean
  position: number
}

interface RecentlyAddedReorderProps {
  userRole: "super-admin" | "admin" | "designer"
  onSaveOrder?: (flyers: RecentlyAddedFlyer[]) => void
}

const mockRecentlyAdded: RecentlyAddedFlyer[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Flyer ${i + 1}`,
  price: (["$10", "$15", "$40"] as const)[i % 3],
  isPremium: i % 4 === 0,
  isPhotoFlyer: i % 3 === 0,
  position: i + 1,
}))

export function RecentlyAddedReorder({ userRole, onSaveOrder }: RecentlyAddedReorderProps) {
  const [flyers, setFlyers] = useState(mockRecentlyAdded)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const canEdit = userRole !== "designer"

  const handleDragStart = (id: number) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetId: number) => {
    if (draggedItem === null || draggedItem === targetId) return

    const draggedIndex = flyers.findIndex((f) => f.id === draggedItem)
    const targetIndex = flyers.findIndex((f) => f.id === targetId)

    const newFlyers = [...flyers]
    const [draggedFlyer] = newFlyers.splice(draggedIndex, 1)
    newFlyers.splice(targetIndex, 0, draggedFlyer)

    setFlyers(newFlyers.map((f, idx) => ({ ...f, position: idx + 1 })))
    setDraggedItem(null)
    setHasChanges(true)
  }

  const handleSave = () => {
    console.log("[v0] Saving recently added order:", flyers)
    onSaveOrder?.(flyers)
    setHasChanges(false)
  }

  const handleReset = () => {
    setFlyers(mockRecentlyAdded)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Recently Added Reordering</h2>
          <p className="text-muted-foreground">Drag to reorder the last 100 uploaded flyers</p>
        </div>
        {canEdit && hasChanges && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Reset
            </Button>
            <Button onClick={handleSave} className="bg-[#E50914] text-white hover:bg-[#C40812] gap-2">
              <Save className="w-4 h-4" />
              Save Order
            </Button>
          </div>
        )}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Flyer Order</CardTitle>
          <CardDescription className="text-muted-foreground">
            {flyers.length} flyers • Showing positions 1-{Math.min(flyers.length, 100)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
            {flyers.map((flyer) => (
              <div
                key={flyer.id}
                draggable={canEdit}
                onDragStart={() => handleDragStart(flyer.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(flyer.id)}
                className={`p-3 bg-secondary rounded-lg border border-border flex items-start gap-3 ${
                  canEdit ? "cursor-move hover:border-[#E50914]/50" : ""
                } transition-colors`}
              >
                {/* Position and Drag Handle */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-8 h-8 rounded bg-[#E50914] text-white flex items-center justify-center text-xs font-bold">
                    {flyer.position}
                  </div>
                  {canEdit && <GripVertical className="w-4 h-4 text-muted-foreground" />}
                </div>

                {/* Thumbnail */}
                <div className="relative w-16 h-16 bg-input rounded border border-border flex-shrink-0 overflow-hidden">
                  {flyer.thumbnail ? (
                    <img
                      src={flyer.thumbnail || "/placeholder.svg"}
                      alt={flyer.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                  <FlyerRibbon isPhotoFlyer={flyer.isPhotoFlyer} isPremium={flyer.isPremium} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{flyer.title}</p>
                  <p className="text-xs text-muted-foreground">{flyer.price}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!canEdit && (
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Designers can view the order but cannot make changes.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
