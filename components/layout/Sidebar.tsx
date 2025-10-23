"use client"

import { LayoutDashboard, FileText, ShoppingCart, Layers, Settings } from "lucide-react"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  userRole: "super-admin" | "admin" | "designer"
}

export function Sidebar({ currentPage, onPageChange, userRole }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "flyers", label: "Flyers", icon: FileText },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "carousel", label: "Carousels", icon: Layers },
  ]

  // Filter menu items based on role
  const filteredItems = menuItems.filter((item) => {
    if (userRole === "designer" && item.id === "carousel") return false
    return true
  })

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#E50914] text-white rounded flex items-center justify-center font-bold text-lg">
            N
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">Admin</h1>
            <p className="text-xs text-muted-foreground">Flyer Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  )
}
