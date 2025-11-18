"use client"

import type React from "react"

import { useState } from "react"
import { GripVertical, Plus, Trash2, Pin, PinOff, X } from 'lucide-react'
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", flyers: "" })

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

  const handleCreateCarousel = () => {
    if (!formData.name.trim()) return
    
    const newCarousel = {
      id: Math.max(...carousels.map(c => c.id), 0) + 1,
      name: formData.name,
      position: carousels.length + 1,
      flyers: parseInt(formData.flyers) || 0,
      isPinned: false
    }
    
    setCarousels([...carousels, newCarousel])
    setFormData({ name: "", flyers: "" })
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Carousel Management</h1>
          <p className="text-muted-foreground">Manage homepage carousels and their order</p>
        </div>
        {canEdit && (
          <Button 
            className="bg-[#E50914] text-white hover:bg-[#C40812] gap-2"
            onClick={() => setIsModalOpen(true)}
          >
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
                className={`p-4 bg-secondary rounded-lg border border-border flex items-center justify-between ${canEdit ? "cursor-move hover:bg-secondary/80" : ""
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
          <div className="flex justify-end mt-7">
            <Button className="bg-[#E50914] text-white hover:bg-[#C40812] gap-2">
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-card border-border w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-foreground">Create New Carousel</CardTitle>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Carousel Name</label>
                <input
                  type="text"
                  placeholder="e.g., Featured Flyers"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Number of Flyers</label>
                <input
                  type="number"
                  placeholder="e.g., 12"
                  value={formData.flyers}
                  onChange={(e) => setFormData({ ...formData, flyers: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-border text-foreground hover:bg-secondary"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#E50914] text-white hover:bg-[#C40812]"
                  onClick={handleCreateCarousel}
                >
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
