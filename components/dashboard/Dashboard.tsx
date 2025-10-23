"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ActiveOrders } from "./ActiveOrders"
import { TopFlyers } from "./TopFlyers"


const dashboardData = {
  stats: [
    { label: "Total Orders", value: "1,234", change: "+12%", period: "Today" },
    { label: "Revenue", value: "$45,678", change: "+8%", period: "Today" },
    { label: "New Users", value: "89", change: "+5%", period: "Today" },
    { label: "Active Flyers", value: "156", change: "+3%", period: "This Week" },
  ],
  chartData: [
    { name: "Mon", orders: 120, revenue: 2400 },
    { name: "Tue", orders: 150, revenue: 2210 },
    { name: "Wed", orders: 130, revenue: 2290 },
    { name: "Thu", orders: 180, revenue: 2000 },
    { name: "Fri", orders: 200, revenue: 2181 },
    { name: "Sat", orders: 220, revenue: 2500 },
    { name: "Sun", orders: 190, revenue: 2100 },
  ],
  categoryData: [
    { name: "Birthday", value: 35 },
    { name: "Wedding", value: 25 },
    { name: "Corporate", value: 20 },
    { name: "Other", value: 20 },
  ],
}

const COLORS = ["#E50914", "#FF6B6B", "#FFA500", "#FFD700"]

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardData.stats.map((stat, idx) => (
          <Card key={idx} className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-primary">
                  {stat.change} from {stat.period}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Orders & Revenue</CardTitle>
            <CardDescription className="text-muted-foreground">Weekly performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                <Legend />
                <Bar dataKey="orders" fill="#E50914" />
                <Bar dataKey="revenue" fill="#FF6B6B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Category Distribution</CardTitle>
            <CardDescription className="text-muted-foreground">Flyer types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders and Top Flyers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveOrders />
        <TopFlyers />
      </div>
    </div>
  )
}
