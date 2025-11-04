"use client"

import { useState } from "react"
import { type Flyer, CATEGORIES } from "@/lib/flyer-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface EditFlyerModalProps {
  flyer: Flyer
  isOpen: boolean
  onClose: () => void
  onSave: (updatedFlyer: Flyer, oldCategory: string, newCategory: string) => void
}

export function EditFlyerModal({ flyer, isOpen, onClose, onSave }: EditFlyerModalProps) {
  const [title, setTitle] = useState(flyer.title)
  const [price, setPrice] = useState(flyer.price)
  const [formType, setFormType] = useState(flyer.formType)
  const [selectedCategory, setSelectedCategory] = useState(flyer.category)
  const [recentlyAdded, setRecentlyAdded] = useState(flyer.recentlyAdded)

  const handleSave = () => {
    const updatedFlyer: Flyer = {
      ...flyer,
      title,
      price: price as 10 | 15 | 40,
      formType: formType as "With Image" | "Without Image",
      category: selectedCategory,
      recentlyAdded,
    }
    onSave(updatedFlyer, flyer.category, selectedCategory)
    onClose()
  }

  const handleReset = () => {
    setTitle(flyer.title)
    setPrice(flyer.price)
    setFormType(flyer.formType)
    setSelectedCategory(flyer.category)
    setRecentlyAdded(flyer.recentlyAdded)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Flyer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Main Title */}
          <div>
            <label className="text-sm font-medium text-foreground">Main Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter flyer title"
              className="mt-2"
            />
          </div>

          {/* Price Type */}
          <div>
            <label className="text-sm font-medium text-foreground">Flyer Price Type</label>
            <div className="flex gap-3 mt-2">
              {[10, 15, 40].map((p) => (
                <button
                  key={p}
                  onClick={() => setPrice(p as 10 | 15 | 40)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    price === p
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>
          </div>

          {/* Form Type */}
          <div>
            <label className="text-sm font-medium text-foreground">Form Type</label>
            <div className="flex gap-3 mt-2">
              {["With Image", "Without Image"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFormType(type as "With Image" | "Without Image")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    formType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Categories - Clickable Tags */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Categories</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-red-500 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Recently Added Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Recently Added Option</label>
            <button
              onClick={() => setRecentlyAdded(!recentlyAdded)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                recentlyAdded
                  ? "bg-green-500/20 text-green-700 border border-green-500"
                  : "bg-muted text-muted-foreground border border-transparent"
              }`}
            >
              {recentlyAdded ? "YES" : "NO"}
            </button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
