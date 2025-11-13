"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  email: string
  amount: string
  status: string
  date: string
  details?: {
    presenting?: string
    eventTitle?: string
    eventDate?: string
    flyerInfo?: string
    addressPhone?: string
    djs?: string[]
    hostName?: string
    sponsors?: string[]
    extras?: string[]
    deliveryTime?: string
    notes?: string
  }
}

interface OrderDetailPageProps {
  selectedOrder: Order
  onBack: () => void
}

export function OrderDetailPage({ selectedOrder, onBack }: OrderDetailPageProps) {
  const [selectedDelivery, setSelectedDelivery] = useState("5hours")

  const details = selectedOrder.details || {
    presenting: "Event Presenter",
    eventTitle: "Music Night 2025",
    eventDate: "June 15, 2025",
    flyerInfo: "A spectacular music event",
    addressPhone: "Downtown Venue, +1-800-123-4567",
    djs: ["DJ Alpha", "DJ Beta"],
    hostName: "John Doe",
    sponsors: ["Sponsor 1", "Sponsor 2", "Sponsor 3"],
    extras: ["story", "custom"],
    deliveryTime: "24hours",
    notes: "Special VIP section needed",
  }

  const deliveryOptions = [
    { id: "1h", label: "1 Hour Delivery", value: "1hours", price: "$20" },
    { id: "5h", label: "5 Hours Delivery", value: "5hours", price: "$10" },
    { id: "24h", label: "24 Hours Delivery", value: "24hours", price: "FREE" },
  ]

  const extrasList = [
    { id: "story", label: "Story Size Version", price: 10 },
    { id: "custom", label: "Make Flyer Different/Custom", price: 10 },
    { id: "animated", label: "Animated Flyer", price: 25 },
    { id: "insta", label: "Instagram Post Size", price: 0 },
  ]

  const handleSendToOwner = () => {
    const orderData = {
      orderId: selectedOrder.id,
      userEmail: selectedOrder.email,
      details,
      selectedDeliveryTime: selectedDelivery,
      timestamp: new Date().toISOString(),
    }
    console.log("[v0] Order sent to owner:", orderData)
    alert(`Order sent to owner with ${selectedDelivery} delivery time!`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Order Details - {selectedOrder.id}</h1>
          <p className="text-gray-400">Review your requirements and submit to owner</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE - Flyer Display (Small) */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-red-950/30 to-black p-6 rounded-2xl border border-gray-800 sticky top-6 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Event Flyer
              </h2>
              <div className="w-full aspect-square bg-gradient-to-br from-gray-900 to-black rounded-lg border-2 border-gray-700 flex flex-col items-center justify-center p-4 relative">
                <p className="text-gray-300 text-lg font-bold text-center">{details.eventTitle}</p>
                <p className="text-gray-500 text-sm mt-2">{details.eventDate}</p>
                <p className="text-red-500 text-xs mt-4 font-semibold">Event Flyer Preview</p>

                {/* Price Tag - Top Right */}
                <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {selectedOrder.amount}
                </div>
              </div>

              <div className="p-3 bg-gray-950 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-400 mb-1">Order ID</p>
                <p className="text-white font-semibold">{selectedOrder.id}</p>
              </div>
              <div className="p-3 bg-gray-950 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <p className="text-red-500 font-semibold">{selectedOrder.status}</p>
              </div>
              <div className="p-3 bg-gray-950 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-400 mb-1">Client Email</p>
                <p className="text-white font-semibold text-sm">{selectedOrder.email}</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Details Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Section */}
            <div className="bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl border border-gray-800 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Event Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Presenting</p>
                  <p className="text-white font-semibold">{details.presenting}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Event Title</p>
                  <p className="text-white font-semibold">{details.eventTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Date</p>
                  <p className="text-white font-semibold">{details.eventDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <p className="text-red-500 font-semibold">{selectedOrder.status}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 mb-1">Flyer Information</p>
                  <p className="text-white font-semibold">{details.flyerInfo}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 mb-1">Address & Phone</p>
                  <p className="text-white font-semibold">{details.addressPhone}</p>
                </div>
              </div>
            </div>

            {/* DJ/Artists Section */}
            <div className="bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl border border-gray-800 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                DJ or Artist
              </h2>
              <div className="space-y-2">
                {details.djs && details.djs.length > 0 ? (
                  details.djs.map((dj, index) => (
                    <div key={index} className="bg-gray-950 border border-gray-800 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Artist/DJ {index + 1}</p>
                      <p className="text-white font-semibold">{dj}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No DJs added</p>
                )}
              </div>
            </div>

            {/* Host Section */}
            <div className="bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl border border-gray-800 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Host
              </h2>
              <div>
                <p className="text-xs text-gray-400 mb-1">Host Name</p>
                <p className="text-white font-semibold">{details.hostName}</p>
              </div>
            </div>

            {/* Sponsors Section */}
            <div className="bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl border border-gray-800 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Sponsors
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {["Sponsor 1", "Sponsor 2", "Sponsor 3"].map((_, index) => (
                  <div key={index} className="bg-gray-950 border border-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Sponsor {index + 1}</p>
                    <p className="text-white font-semibold text-sm">{details.sponsors?.[index] || "N/A"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Extras Section */}
            <div className="bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl border border-gray-800 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Extras Selected
              </h2>
              <div className="space-y-2">
                {extrasList.map((extra) => {
                  const isSelected = details.extras?.includes(extra.id)
                  return (
                    <div
                      key={extra.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        isSelected ? "bg-red-950/20 border-red-500" : "bg-gray-950 border-gray-800 opacity-50"
                      }`}
                    >
                      <p className="text-sm font-semibold">{extra.label}</p>
                      <span className={isSelected ? "text-red-500 font-bold text-sm" : "text-gray-600 text-sm"}>
                        ${extra.price}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Delivery Time Section - Interactive for User Submission */}
            <div className="bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl border border-gray-800 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Select Delivery Time
              </h2>
              <div className="space-y-2">
                {deliveryOptions.map((option) => {
                  const isSelected = selectedDelivery === option.value
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedDelivery(option.value)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-red-950/20 border-red-500"
                          : "bg-gray-950 border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      <p className="text-sm font-semibold">{option.label}</p>
                      <span className={isSelected ? "text-red-500 font-bold text-sm" : "text-gray-600 text-sm"}>
                        {option.price}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Notes Section */}
            {details.notes && (
              <div className="bg-gradient-to-br from-red-950/20 to-black p-6 rounded-2xl border border-gray-800 space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Custom Notes
                </h2>
                <p className="text-white text-sm">{details.notes}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="border-gray-800 text-white hover:bg-gray-950 font-semibold bg-transparent"
                onClick={onBack}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
