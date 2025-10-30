"use client"

import type React from "react"

import { useState } from "react"
import { GripVertical, Plus, Trash2, Pin, PinOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CarouselManagementProps {
  userRole: "super-admin" | "admin" | "designer"
}

const mockCarousels = [
  { id: 1, name: "Featured Flyers", position: 1, flyers: 8, isPinned: true },
  { id: 2, name: "New Arrivals", position: 2, flyers: 12, isPinned: false },
  { id: 3, name: "Best Sellers", position: 3, flyers: 10, isPinned: true },
  { id: 4, name: "Birthday Collection", position: 4, flyers: 15, isPinned: false },
]

export function CarouselManagement({ userRole }: CarouselManagementProps) {
  const [carousels, setCarousels] = useState(mockCarousels)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  const canEdit = userRole !== "designer"

  const handleDragStart = (id: number) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetId: number) => {
    if (draggedItem === null || draggedItem === targetId) return

    const draggedIndex = carousels.findIndex((c) => c.id === draggedItem)
    const targetIndex = carousels.findIndex((c) => c.id === targetId)

    const newCarousels = [...carousels]
    const [draggedCarousel] = newCarousels.splice(draggedIndex, 1)
    newCarousels.splice(targetIndex, 0, draggedCarousel)

    setCarousels(newCarousels.map((c, idx) => ({ ...c, position: idx + 1 })))
    setDraggedItem(null)
  }

  const togglePin = (id: number) => {
    setCarousels(carousels.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Carousel Management</h1>
          <p className="text-muted-foreground">Manage homepage carousels and their order</p>
        </div>
        {canEdit && (
          <Button className="bg-[#E50914] text-white hover:bg-[#C40812] gap-2">
            <Plus className="w-4 h-4" />
            New Carousel
          </Button>
        )}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Active Carousels</CardTitle>
          <CardDescription className="text-muted-foreground">Drag to reorder carousels on homepage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {carousels.map((carousel) => (
              <div
                key={carousel.id}
                draggable={canEdit}
                onDragStart={() => handleDragStart(carousel.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(carousel.id)}
                className={`p-4 bg-secondary rounded-lg border border-border flex items-center justify-between ${
                  canEdit ? "cursor-move hover:bg-secondary/80" : ""
                } transition-colors`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {canEdit && <GripVertical className="w-5 h-5 text-muted-foreground" />}
                  <div>
                    <p className="font-semibold text-foreground">{carousel.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Position #{carousel.position} • {carousel.flyers} flyers
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {canEdit && (
                    <>
                      <button
                        onClick={() => togglePin(carousel.id)}
                        className="p-2 hover:bg-primary/20 rounded transition-colors"
                      >
                        {carousel.isPinned ? (
                          <Pin className="w-5 h-5 text-primary" />
                        ) : (
                          <PinOff className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      <button className="p-2 hover:bg-destructive/20 rounded transition-colors">
                        <Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Carousel Settings</CardTitle>
          <CardDescription className="text-muted-foreground">Configure carousel display options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Premium Carousel Style</p>
                <p className="text-sm text-muted-foreground">Enable special styling for premium carousels</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-semibold text-foreground">Auto-rotate Carousels</p>
                <p className="text-sm text-muted-foreground">Automatically rotate carousel content</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
