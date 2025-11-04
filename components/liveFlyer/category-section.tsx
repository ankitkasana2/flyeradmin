"use client"

import type { Flyer } from "@/lib/flyer-data"
import { FlyerCard } from "./flyer-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState } from "react"

interface CategorySectionProps {
  category: string
  flyers: Flyer[]
  onEdit: (flyer: Flyer) => void
  onDelete: (flyer: Flyer) => void
}

export function CategorySection({ category, flyers, onEdit, onDelete }: CategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (flyers.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="border-l-4 border-primary pl-4">
        <h2 className="text-2xl font-bold text-foreground">{category}</h2>
        <p className="text-sm text-muted-foreground mt-1">{flyers.length} flyers</p>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-colors"
            title="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
        )}

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {flyers.map((flyer) => (
            <div key={flyer.id} className="flex-shrink-0 w-40">
              <FlyerCard flyer={flyer} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-colors"
            title="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        )}
      </div>
    </section>
  )
}
