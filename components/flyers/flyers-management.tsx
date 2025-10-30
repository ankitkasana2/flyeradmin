"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FlyerForm } from "./flyer-form"
import { BulkUpload } from "./bulk-upload"

interface FlyersManagementProps {
  userRole: "super-admin" | "admin" | "designer"
}

const mockFlyers = [
  { id: 1, title: "Birthday Bash", price: "$10", category: "Birthday", status: "Active" },
  { id: 2, title: "Wedding Elegance", price: "$40", category: "Wedding", status: "Active" },
  { id: 3, title: "Corporate Pro", price: "$15", category: "Corporate", status: "Draft" },
]

export function FlyersManagement({ userRole }: FlyersManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [flyers, setFlyers] = useState(mockFlyers)

  const canEdit = userRole !== "designer"

  const handleBulkUpload = (uploadedFlyers: any[]) => {
    console.log("[v0] Bulk upload received:", uploadedFlyers)
    setShowBulkUpload(false)
    // TODO: Add API call to save flyers to database
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Flyers Management</h1>
          <p className="text-muted-foreground">Create and manage your flyer templates</p>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowBulkUpload(true)}
              className="bg-[#E50914] text-white hover:bg-[#C40812] gap-2"
            >
              <Upload className="w-4 h-4" />
              Bulk Upload
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-[#E50914] text-white hover:bg-[#C40812] gap-2">
              <Plus className="w-4 h-4" />
              New Flyer
            </Button>
          </div>
        )}
      </div>

      {showBulkUpload && <BulkUpload onClose={() => setShowBulkUpload(false)} onUpload={handleBulkUpload} />}

      {showForm && <FlyerForm onClose={() => setShowForm(false)} />}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Flyers</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your flyer templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search flyers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Title</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Price</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Category</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flyers.map((flyer) => (
                  <tr key={flyer.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-foreground">{flyer.title}</td>
                    <td className="py-3 px-4 text-foreground font-semibold text-primary">{flyer.price}</td>
                    <td className="py-3 px-4 text-muted-foreground">{flyer.category}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          flyer.status === "Active"
                            ? "bg-green-900/30 text-green-400"
                            : "bg-yellow-900/30 text-yellow-400"
                        }`}
                      >
                        {flyer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {canEdit && (
                          <>
                            <button className="p-1 hover:bg-secondary rounded transition-colors">
                              <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </button>
                            <button className="p-1 hover:bg-secondary rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
