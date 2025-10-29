"use client"
import { useState, useEffect } from "react"
import { Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Helper: convert "45m", "2h 30m", "8h" → seconds
const parseTimeToSeconds = (time: string): number => {
  const hours = time.match(/(\d+)h/)?.[1] ?? "0"
  const minutes = time.match(/(\d+)m/)?.[1] ?? "0"
  return parseInt(hours) * 3600 + parseInt(minutes) * 60
}

const activeOrders = [
  { id: "ORD-001", customer: "John Doe", time: "45m", priority: "urgent", status: "1h" },
  { id: "ORD-002", customer: "Jane Smith", time: "2h 30m", priority: "medium", status: "5h" },
  { id: "ORD-003", customer: "Bob Johnson", time: "8h", priority: "normal", status: "24h" },
  { id: "ORD-004", customer: "Alice Brown", time: "30m", priority: "urgent", status: "1h" },
]

export function ActiveOrders() {

  // Store remaining seconds for each order
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    activeOrders.forEach((o) => {
      init[o.id] = parseTimeToSeconds(o.time)
    })
    return init
  })

  // Countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = { ...prev }
        let anyActive = false

        activeOrders.forEach((order) => {
          if (next[order.id] > 0) {
            next[order.id] -= 1
            anyActive = true
          }
        })

        if (!anyActive) clearInterval(interval)
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format seconds → "Xm Ys" or "Overdue"
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return <span className="text-red-600 font-bold">Overdue</span>

    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    const parts: string[] = []
    if (h > 0) parts.push(`${h}h`)
    if (m > 0) parts.push(`${m}m`)
    if (s > 0 || parts.length === 0) parts.push(`${s}s`)

    return <>{parts.join(" ")}</>
  }

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "priority-urgent"
      case "medium":
        return "priority-medium"
      default:
        return "priority-normal"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-500"
      case "medium":
        return "text-orange-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Active Orders
        </CardTitle>
        <CardDescription className="text-muted-foreground">Orders with countdown timers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeOrders.map((order) => (
            <div key={order.id} className={`p-4 rounded-lg ${getPriorityClass(order.priority)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${getPriorityColor(order.priority)}`}>{order.status}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                  {formatTime(timeLeft[order.id] ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
