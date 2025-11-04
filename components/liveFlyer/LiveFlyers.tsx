"use client"

import { useState, useMemo } from "react"
import { generateDemoFlyers, CATEGORIES, type Flyer } from "@/lib/flyer-data"
import { CategorySection } from "./category-section"
import { EditFlyerModal } from "./edit-flyer-modal"
import { DeleteFlyerDialog } from "./delete-flyer-dialog"


export default function Home() {
  const [flyers, setFlyers] = useState<Flyer[]>(generateDemoFlyers())
  const [editingFlyer, setEditingFlyer] = useState<Flyer | null>(null)
  const [deletingFlyer, setDeletingFlyer] = useState<Flyer | null>(null)
  const [categoryChangeConfirm, setCategoryChangeConfirm] = useState<{
    flyer: Flyer
    oldCategory: string
    newCategory: string
  } | null>(null)

  // Group flyers by category
  const flyersByCategory = useMemo(
    () =>
      CATEGORIES.reduce(
        (acc, category) => {
          acc[category] = flyers.filter((f) => f.category === category)
          return acc
        },
        {} as Record<string, typeof flyers>,
      ),
    [flyers],
  )

  const handleEditSave = (updatedFlyer: Flyer, oldCategory: string, newCategory: string) => {
    if (oldCategory !== newCategory) {
      // Category changed - show confirmation dialog
      setCategoryChangeConfirm({
        flyer: updatedFlyer,
        oldCategory,
        newCategory,
      })
    } else {
      // Same category - save directly
      setFlyers((prev) => prev.map((f) => (f.id === updatedFlyer.id ? updatedFlyer : f)))
    }
    setEditingFlyer(null)
  }

  const confirmCategoryChange = () => {
    if (categoryChangeConfirm) {
      setFlyers((prev) => prev.map((f) => (f.id === categoryChangeConfirm.flyer.id ? categoryChangeConfirm.flyer : f)))
      setCategoryChangeConfirm(null)
    }
  }

  const handleDelete = () => {
    if (deletingFlyer) {
      setFlyers((prev) => prev.filter((f) => f.id !== deletingFlyer.id))
      setDeletingFlyer(null)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-foreground">Flyer Collections</h1>
          <p className="text-muted-foreground mt-2">Browse premium and custom flyers across all categories</p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {CATEGORIES.map((category) => (
            <CategorySection
              key={category}
              category={category}
              flyers={flyersByCategory[category]}
              onEdit={setEditingFlyer}
              onDelete={setDeletingFlyer}
            />
          ))}
        </div>
      </div>

      {/* Ribbon Legend */}
      <section className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Ribbon Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-3">PHOTO Ribbon</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Appears on all flyers using the "With Image" form (any price tier: $10 or $15)
              </p>
              <p className="text-sm text-muted-foreground">
                On $40 Premium flyers, the PHOTO ribbon appears below the PREMIUM ribbon in a smaller size.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">PREMIUM Ribbon</h3>
              <p className="text-sm text-muted-foreground mb-3">Automatically displayed on all $40 price tier flyers</p>
              <p className="text-sm text-muted-foreground">
                Appears at the top with priority when combined with the PHOTO ribbon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {editingFlyer && (
        <EditFlyerModal
          flyer={editingFlyer}
          isOpen={!!editingFlyer}
          onClose={() => setEditingFlyer(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Category Change Confirmation */}
      {categoryChangeConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg shadow-lg p-6 max-w-md">
            <h3 className="text-lg font-bold text-foreground mb-3">Move Flyer to Different Category?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You are moving <span className="font-semibold">"{categoryChangeConfirm.flyer.title}"</span> from{" "}
              <span className="font-semibold">"{categoryChangeConfirm.oldCategory}"</span> to{" "}
              <span className="font-semibold">"{categoryChangeConfirm.newCategory}"</span>. This flyer will appear in
              the new category after confirmation.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCategoryChangeConfirm(null)}
                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmCategoryChange}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deletingFlyer && (
        <DeleteFlyerDialog
          isOpen={!!deletingFlyer}
          flyerTitle={deletingFlyer.title}
          onConfirm={handleDelete}
          onCancel={() => setDeletingFlyer(null)}
        />
      )}
    </main>
  )
}
