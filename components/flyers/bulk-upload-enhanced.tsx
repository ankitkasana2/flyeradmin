"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, Save, FileText, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { parseCSV, generateCSVTemplate, type CSVFlyerData } from "./csv-parser"
import { extractZipFiles, arrayBufferToBase64 } from "./zip-handler"

interface FlyerPreview {
  id: string
  file?: File
  preview: string
  title: string
  price: "$10" | "$15" | "$40"
  formType: "With Photo" | "Only Info" | "Birthday"
  categories: string[]
  recentlyAdded: boolean
  source: "image" | "csv" | "zip"
}

interface BulkUploadEnhancedProps {
  onClose: () => void
  onUpload: (flyers: FlyerPreview[]) => void
}

export function BulkUploadEnhanced({ onClose, onUpload }: BulkUploadEnhancedProps) {
  const [flyers, setFlyers] = useState<FlyerPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadMode, setUploadMode] = useState<"images" | "csv" | "zip">("images")
  const [csvData, setCSVData] = useState<CSVFlyerData[]>([])
  const [showCategorization, setShowCategorization] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const priceOptions = ["$10", "$15", "$40"] as const
  const formTypes = ["With Photo", "Only Info", "Birthday"] as const
  const categories = [
    "Hookah",
    "Halloween",
    "Summer",
    "Birthday",
    "Wedding",
    "Corporate",
    "Anniversary",
    "Graduation",
    "Party",
    "Event",
  ]

  const handleCSVUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const parsedFlyers = parseCSV(content)
      setCSVData(parsedFlyers)
      setShowCategorization(true)
    }
    reader.readAsText(file)
  }

  const handleZipUpload = async (file: File) => {
    try {
      const entries = await extractZipFiles(file)
      const newFlyers: FlyerPreview[] = []
      const csvEntries = entries.filter((e) => e.type === "csv")
      const imageEntries = entries.filter((e) => e.type === "image")

      // Process CSV data if present
      if (csvEntries.length > 0) {
        const csvContent = new TextDecoder().decode(csvEntries[0].data)
        const parsedFlyers = parseCSV(csvContent)
        setCSVData(parsedFlyers)
      }

      // Process images
      for (const entry of imageEntries.slice(0, 30 - flyers.length)) {
        const base64 = arrayBufferToBase64(entry.data)
        const preview = `data:image/${entry.name.split(".").pop()};base64,${base64}`

        newFlyers.push({
          id: `${Date.now()}-${Math.random()}`,
          preview,
          title: entry.name.replace(/\.[^/.]+$/, ""),
          price: "$10",
          formType: "Only Info",
          categories: [],
          recentlyAdded: true,
          source: "zip",
        })
      }

      setFlyers((prev) => [...prev, ...newFlyers])
      setShowCategorization(true)
    } catch (error) {
      console.error("Error processing ZIP file:", error)
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const file = files[0]

    if (uploadMode === "csv") {
      handleCSVUpload(file)
    } else if (uploadMode === "zip") {
      handleZipUpload(file)
    } else {
      // Handle image uploads
      const newFlyers: FlyerPreview[] = []
      for (let i = 0; i < Math.min(files.length, 30 - flyers.length); i++) {
        const imageFile = files[i]
        if (imageFile.type.startsWith("image/")) {
          const reader = new FileReader()
          reader.onload = (e) => {
            newFlyers.push({
              id: `${Date.now()}-${i}`,
              file: imageFile,
              preview: e.target?.result as string,
              title: imageFile.name.replace(/\.[^/.]+$/, ""),
              price: "$10",
              formType: "Only Info",
              categories: [],
              recentlyAdded: true,
              source: "image",
            })

            if (newFlyers.length === Math.min(files.length, 30 - flyers.length)) {
              setFlyers((prev) => [...prev, ...newFlyers])
            }
          }
          reader.readAsDataURL(imageFile)
        }
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

  const applyCSVData = () => {
    const updatedFlyers = flyers.map((flyer, index) => {
      if (index < csvData.length) {
        return {
          ...flyer,
          title: csvData[index].title,
          price: csvData[index].price,
          formType: csvData[index].formType,
          categories: csvData[index].categories,
          recentlyAdded: csvData[index].recentlyAdded,
        }
      }
      return flyer
    })
    setFlyers(updatedFlyers)
    setShowCategorization(false)
    setCSVData([])
  }

  const handleSave = () => {
    if (flyers.length > 0) {
      onUpload(flyers)
      setFlyers([])
      setUploadMode("images")
    }
  }

  const downloadCSVTemplate = () => {
    const template = generateCSVTemplate()
    const blob = new Blob([template], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "flyer-template.csv"
    a.click()
  }

  return (
    <Card className="bg-card border-border mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-foreground">Bulk Flyer Upload</CardTitle>
          <CardDescription className="text-muted-foreground">
            Upload up to 30 flyers via images, CSV, or ZIP file
          </CardDescription>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Mode Selector */}
        {flyers.length === 0 && !showCategorization && (
          <div className="flex gap-2 border-b border-border pb-4">
            <Button
              onClick={() => setUploadMode("images")}
              variant={uploadMode === "images" ? "default" : "outline"}
              className={
                uploadMode === "images"
                  ? "bg-[#E50914] text-white"
                  : "border-border text-foreground hover:bg-secondary bg-transparent"
              }
            >
              <Upload className="w-4 h-4 mr-2" />
              Images
            </Button>
            <Button
              onClick={() => setUploadMode("csv")}
              variant={uploadMode === "csv" ? "default" : "outline"}
              className={
                uploadMode === "csv"
                  ? "bg-[#E50914] text-white"
                  : "border-border text-foreground hover:bg-secondary bg-transparent"
              }
            >
              <FileText className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              onClick={() => setUploadMode("zip")}
              variant={uploadMode === "zip" ? "default" : "outline"}
              className={
                uploadMode === "zip"
                  ? "bg-[#E50914] text-white"
                  : "border-border text-foreground hover:bg-secondary bg-transparent"
              }
            >
              <Archive className="w-4 h-4 mr-2" />
              ZIP
            </Button>
            {uploadMode === "csv" && (
              <Button
                onClick={downloadCSVTemplate}
                variant="outline"
                className="ml-auto border-border text-foreground hover:bg-secondary bg-transparent"
              >
                Download Template
              </Button>
            )}
          </div>
        )}

        {/* Categorization Modal */}
        {showCategorization && csvData.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-card border-border max-w-2xl w-full max-h-96 overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-foreground">Categorize Imported Flyers</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Review and assign categories to {csvData.length} flyers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {csvData.map((flyer, index) => (
                  <div key={index} className="p-4 bg-secondary rounded-lg border border-border">
                    <div className="mb-3">
                      <p className="font-semibold text-foreground">{flyer.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {flyer.price} • {flyer.formType}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-2">Categories</label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              const updated = [...csvData]
                              updated[index].categories = updated[index].categories.includes(category)
                                ? updated[index].categories.filter((c) => c !== category)
                                : [...updated[index].categories, category]
                              setCSVData(updated)
                            }}
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
                ))}
                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCategorization(false)
                      setCSVData([])
                    }}
                    className="border-border text-foreground hover:bg-secondary bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button onClick={applyCSVData} className="bg-[#E50914] text-white hover:bg-[#C40812]">
                    Apply Categories
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Area */}
        {flyers.length === 0 && !showCategorization && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-[#E50914] bg-[#E50914]/5" : "border-border"
            }`}
          >
            {uploadMode === "images" && (
              <>
                <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-foreground font-semibold mb-1">Drag and drop your flyers here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to select files (up to 30 images)</p>
              </>
            )}
            {uploadMode === "csv" && (
              <>
                <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-foreground font-semibold mb-1">Upload your CSV file</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Include title, price, formtype, categories, and recentlyadded columns
                </p>
              </>
            )}
            {uploadMode === "zip" && (
              <>
                <Archive className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-foreground font-semibold mb-1">Upload your ZIP file</p>
                <p className="text-sm text-muted-foreground mb-4">Include images and optional CSV file for metadata</p>
              </>
            )}
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#E50914] text-white hover:bg-[#C40812]"
            >
              Select File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={uploadMode === "csv" ? ".csv" : uploadMode === "zip" ? ".zip" : "image/*"}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              multiple={uploadMode === "images"}
            />
          </div>
        )}

        {/* Flyers Preview List */}
        {flyers.length > 0 && !showCategorization && (
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
                accept={uploadMode === "csv" ? ".csv" : uploadMode === "zip" ? ".zip" : "image/*"}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                multiple={uploadMode === "images"}
              />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {flyers.map((flyer) => (
                <div key={flyer.id} className="p-4 bg-secondary rounded-lg border border-border">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={flyer.preview || "/placeholder.svg"}
                        alt={flyer.title}
                        className="w-24 h-24 object-cover rounded border border-border"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Title</label>
                          <Input
                            value={flyer.title}
                            onChange={(e) => updateFlyer(flyer.id, { title: e.target.value })}
                            className="bg-input border-border text-foreground text-sm"
                          />
                        </div>

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
        {flyers.length > 0 && !showCategorization && (
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
