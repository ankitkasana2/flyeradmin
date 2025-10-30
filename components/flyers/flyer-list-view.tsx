"use client"

import { useState } from "react"
import { Edit2, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FlyerRibbon } from "./flyer-ribbon"

interface Flyer {
  id: number
  title: string
  price: "$10" | "$15" | "$40"
  category: string
  formType: "With Photo" | "Only Info" | "Birthday"
  status: "Active" | "Draft"
  isPremium: boolean
  isPhotoFlyer: boolean
  thumbnail?: string
}

interface FlyerListViewProps {
  userRole: "super-admin" | "admin" | "designer"
  onEdit?: (flyer: Flyer) => void
  onDelete?: (id: number) => void
}

const mockFlyers: Flyer[] = [
  {
    id: 1,
    title: "Birthday Bash",
    price: "$10",
    category: "Birthday",
    formType: "Only Info",
    status: "Active",
    isPremium: false,
    isPhotoFlyer: false,
  },
  {
    id: 2,
    title: "Wedding Elegance",
    price: "$40",
    category: "Wedding",
    formType: "With Photo",
    status: "Active",
    isPremium: true,
    isPhotoFlyer: true,
  },
  {
    id: 3,
    title: "Corporate Pro",
    price: "$15",
    category: "Corporate",
    formType: "Only Info",
    status: "Draft",
    isPremium: false,
    isPhotoFlyer: false,
  },
  {
    id: 4,
    title: "DJ Night Vibes",
    price: "$40",
    category: "Party",
    formType: "With Photo",
    status: "Active",
    isPremium: true,
    isPhotoFlyer: true,
  },
  {
    id: 5,
    title: "Anniversary Special",
    price: "$15",
    category: "Anniversary",
    formType: "With Photo",
    status: "Active",
    isPremium: false,
    isPhotoFlyer: true,
  },
]

export function FlyerListView({ userRole, onEdit, onDelete }: FlyerListViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [flyers, setFlyers] = useState(mockFlyers)

  const canEdit = userRole !== "designer"

  const categories = Array.from(new Set(flyers.map((f) => f.category)))

  const filteredFlyers = flyers.filter((flyer) => {
    const matchesSearch =
      flyer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flyer.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || flyer.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = (id: number) => {
    setFlyers((prev) => prev.filter((f) => f.id !== id))
    onDelete?.(id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">All Flyers</h2>

        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                categoryFilter === null
                  ? "bg-[#E50914] text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  categoryFilter === category
                    ? "bg-[#E50914] text-white"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Flyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFlyers.map((flyer) => (
          <Card
            key={flyer.id}
            className="bg-card border-border overflow-hidden hover:border-[#E50914]/50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative w-full h-40 bg-secondary flex items-center justify-center overflow-hidden">
              {flyer.thumbnail ? (
                <img
                  src={flyer.thumbnail || "/placeholder.svg"}
                  alt={flyer.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground text-sm">No image</div>
              )}
              <FlyerRibbon isPhotoFlyer={flyer.isPhotoFlyer} isPremium={flyer.isPremium} />
            </div>

            <CardContent className="p-4 space-y-3">
              {/* Title */}
              <div>
                <h3 className="font-semibold text-foreground truncate">{flyer.title}</h3>
                <p className="text-xs text-muted-foreground">{flyer.category}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-semibold text-primary">{flyer.price}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Form Type</p>
                  <p className="font-semibold text-foreground">{flyer.formType}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    flyer.status === "Active" ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
                  }`}
                >
                  {flyer.status}
                </span>
              </div>

              {/* Actions */}
              {canEdit && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(flyer)}
                    className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(flyer.id)}
                    className="flex-1 border-border text-destructive hover:bg-destructive/10 bg-transparent gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFlyers.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No flyers found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
