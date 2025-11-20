"use client"

import { observer } from "mobx-react-lite"
import { Search, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ordersStore } from "@/stores/ordersStore"
import { OrderDetailPage } from "./order-detail-page"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed": return "bg-green-100 text-green-900"
    case "Processing": return "bg-yellow-100 text-yellow-900"
    case "Pending": return "bg-red-100 text-red-900"
    default: return "bg-gray-200 text-black"
  }
}

const getPriorityBadgeClass = (fastest: string) => {
  switch (fastest) {
    case "1H": return "bg-[#FF4D4F] text-white"
    case "5H": return "bg-[#FF8C3A] text-white"
    case "24H": return "bg-[#3B82F6] text-white"
    case "Completed": return "bg-green-600 text-white"
    default: return "bg-gray-200 text-black"
  }
} 

const msToHMS = (ms: number) => {
  if (ms <= 0) return "00:00:00"
  const total = Math.floor(ms / 1000)
  const hrs = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const two = (n: number) => n.toString().padStart(2, "0")
  return `${two(hrs)}:${two(mins)}:${two(secs)}`
}

const formatDate = (iso: string) => new Date(iso).toLocaleString()


export const OrdersManagement = observer(() => {
  const { loading, error, searchTerm, statusFilter, selectedOrder, visibleOrders, setSearchTerm, setStatusFilter, setSelectedOrder } = ordersStore

  if (selectedOrder) {
    return <OrderDetailPage selectedOrder={selectedOrder} onBack={() => setSelectedOrder(null)} />
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading orders...</div>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 flex-col gap-4">
        <div className="text-red-600">{error}</div>
        <button onClick={() => ordersStore.fetchOrders()} className="text-blue-600 underline">Retry</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
        <p className="text-muted-foreground">View and manage all customer orders — sorted by priority</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Search, filter and update order status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email, order ID, WhatsApp, flyer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {["All", "Pending", "Processing", "Completed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === s
                        ? "bg-[#E50914] text-white"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                Showing <strong>{visibleOrders.active.length}</strong> active — <strong>{visibleOrders.completed.length}</strong> completed
              </div>
            </div>
          </div>

          {/* Active Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Email / WhatsApp</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Flyers</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Delivery</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Priority</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Countdown</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.active.map((order) => {
                  const { fastest, remainingMs } = ordersStore.getOrderPriority(order)
                  const isExpired = remainingMs <= 0

                  return (
                    <tr key={order.id} className={`border-b ${isExpired ? "bg-red-100/30 animate-pulse" : "hover:bg-secondary/50"}`}>
                      <td className="py-3 px-4 font-semibold">{order.id}</td>
                      <td className="py-3 px-4">
                        <div>{order.email}</div>
                        <div className="text-xs text-muted-foreground">{order.whatsapp ?? "No WhatsApp"}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold">{order.flyers.length}</td>
                      <td className="py-3 px-4 text-muted-foreground">{order.flyers.map(f => f.delivery).join(" • ")}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPriorityBadgeClass(fastest)}`}>
                          {fastest === "Completed" ? "Done" : `${fastest} Priority`}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-mono font-bold ${isExpired ? "text-red-600" : ""}`}>
                        {msToHMS(remainingMs)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => ordersStore.updateOrderStatus(order.id, e.target.value as any)}
                          className={`px-2 py-1 rounded text-xs font-semibold border-0 cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => setSelectedOrder(order)} className="text-primary hover:underline text-sm font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Completed Orders */}
          {visibleOrders.completed.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Completed Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Order ID</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Flyers</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-muted-foreground font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.completed.map(order => (
                      <tr key={order.id} className="border-b hover:bg-secondary/50">
                        <td className="py-3 px-4 font-semibold">{order.id}</td>
                        <td className="py-3 px-4 text-muted-foreground">{order.email}</td>
                        <td className="py-3 px-4 font-semibold">{order.flyers.length}</td>
                        <td className="py-3 px-4 text-muted-foreground">{formatDate(order.createdAt)}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => setSelectedOrder(order)} className="text-primary hover:underline text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
})