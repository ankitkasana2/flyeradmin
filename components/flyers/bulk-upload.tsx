"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FlyerPreview {
  id: string
  file: File
  preview: string
  title: string
  price: "$10" | "$15" | "$40"
  formType: "With Photo" | "Only Info" | "Birthday"
  categories: string[]
  recentlyAdded: boolean
}

interface BulkUploadProps {
  onClose: () => void
  onUpload: (flyers: FlyerPreview[]) => void
}

export function BulkUpload({ onClose, onUpload }: BulkUploadProps) {
  const [flyers, setFlyers] = useState<FlyerPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const priceOptions = ["$10", "$15", "$40"] as const
  const formTypes = ["With Photo", "Only Info", "Birthday"] as const
  const categories = ["Birthday", "Wedding", "Corporate", "Anniversary", "Graduation", "Party", "Event"]

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFlyers: FlyerPreview[] = []
    for (let i = 0; i < Math.min(files.length, 30 - flyers.length); i++) {
      const file = files[i]
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          newFlyers.push({
            id: `${Date.now()}-${i}`,
            file,
            preview: e.target?.result as string,
            title: file.name.replace(/\.[^/.]+$/, ""),
            price: "$10",
            formType: "Only Info",
            categories: [],
            recentlyAdded: true,
          })

          if (newFlyers.length === Math.min(files.length, 30 - flyers.length)) {
            setFlyers((prev) => [...prev, ...newFlyers])
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const updateFlyer = (id: string, updates: Partial<FlyerPreview>) => {
    setFlyers((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const removeFlyer = (id: string) => {
    setFlyers((prev) => prev.filter((f) => f.id !== id))
  }

  const toggleCategory = (id: string, category: string) => {
    setFlyers((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            categories: f.categories.includes(category)
              ? f.categories.filter((c) => c !== category)
              : [...f.categories, category],
          }
        }
        return f
      }),
    )
  }

  const handleSave = () => {
    if (flyers.length > 0) {
      onUpload(flyers)
      setFlyers([])
    }
  }

  return (
    <Card className="bg-card border-border mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-foreground">Bulk Flyer Upload</CardTitle>
          <CardDescription className="text-muted-foreground">
            Upload up to 30 flyers at once and configure them
          </CardDescription>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        {flyers.length === 0 ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-[#E50914] bg-[#E50914]/5" : "border-border"
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-foreground font-semibold mb-1">Drag and drop your flyers here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to select files (up to 30 .webp images)</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#E50914] text-white hover:bg-[#C40812]"
            >
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                {flyers.length} flyer{flyers.length !== 1 ? "s" : ""} selected
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-border text-foreground hover:bg-secondary bg-transparent"
              >
                Add More
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Flyers Preview List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {flyers.map((flyer) => (
                <div key={flyer.id} className="p-4 bg-secondary rounded-lg border border-border">
                  <div className="flex gap-4">
                    {/* Preview Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={flyer.preview || "/placeholder.svg"}
                        alt={flyer.title}
                        className="w-24 h-24 object-cover rounded border border-border"
                      />
                    </div>

                    {/* Configuration Fields */}
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {/* Title */}
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Title</label>
                          <Input
                            value={flyer.title}
                            onChange={(e) => updateFlyer(flyer.id, { title: e.target.value })}
                            className="bg-input border-border text-foreground text-sm"
                          />
                        </div>

                        {/* Price Type */}
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Price</label>
                          <select
                            value={flyer.price}
                            onChange={(e) => updateFlyer(flyer.id, { price: e.target.value as "$10" | "$15" | "$40" })}
                            className="w-full px-2 py-1 bg-input border border-border rounded text-foreground text-sm"
                          >
                            {priceOptions.map((price) => (
                              <option key={price} value={price}>
                                {price}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Form Type */}
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Form Type</label>
                          <select
                            value={flyer.formType}
                            onChange={(e) =>
                              updateFlyer(flyer.id, {
                                formType: e.target.value as "With Photo" | "Only Info" | "Birthday",
                              })
                            }
                            className="w-full px-2 py-1 bg-input border border-border rounded text-foreground text-sm"
                          >
                            {formTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Recently Added */}
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={flyer.recentlyAdded}
                              onChange={(e) => updateFlyer(flyer.id, { recentlyAdded: e.target.checked })}
                              className="w-4 h-4"
                            />
                            <span className="text-xs font-medium text-foreground">Recently Added</span>
                          </label>
                        </div>
                      </div>

                      {/* Categories */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-2">Categories</label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => toggleCategory(flyer.id, category)}
                              className={`px-2 py-1 rounded text-xs transition-colors ${
                                flyer.categories.includes(category)
                                  ? "bg-[#E50914] text-white"
                                  : "bg-input border border-border text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFlyer(flyer.id)}
                      className="flex-shrink-0 p-2 hover:bg-destructive/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {flyers.length > 0 && (
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#E50914] text-white hover:bg-[#C40812] gap-2">
              <Save className="w-4 h-4" />
              Save All Flyers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
