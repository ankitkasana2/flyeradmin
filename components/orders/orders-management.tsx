"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Search, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ordersStore } from "@/stores/ordersStore";
import { OrderDetailPage } from "./order-detail-page";

const msToHMS = (ms: number) => {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const two = (n: number) => n.toString().padStart(2, "0");
  return `${two(hrs)}:${two(mins)}:${two(secs)}`;
};

const formatDate = (iso: string) => new Date(iso).toLocaleString();

export const OrdersManagement = observer(() => {
  const {
    loading,
    error,
    searchTerm,
    statusFilter,
    selectedOrder,
    visibleOrders,
    setSearchTerm,
    setStatusFilter,
    setSelectedOrder,
    updateOrderStatus,
  } = ordersStore;

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (selectedOrder) {
    return (
      <OrderDetailPage
        selectedOrder={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-border rounded-full animate-spin mx-auto border-t-primary"></div>
          <p className="text-sm font-medium text-muted-foreground">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4 max-w-md p-8">
          <h2 className="text-lg font-bold text-foreground">
            Unable to Load Orders
          </h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => ordersStore.fetchOrders()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Orders
        </h1>
        <p className="text-sm text-muted-foreground font-light">
          Manage and track all orders in real-time
        </p>
      </div>

      <Card className="border border-border bg-card">
        <CardHeader className="border-b border-border pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-foreground tracking-tight">
              Active Orders
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {visibleOrders.active.length} active ·{" "}
              {visibleOrders.completed.length} completed
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, phone, order ID, flyer or file name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/50 text-sm"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {["All", "1H", "5H", "24H", "Completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s as any)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    statusFilter === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-border rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 border-b border-border">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Order ID
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Flyers
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Priority
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Countdown
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {visibleOrders.active.map((order) => {
                  const { fastest, remainingMs } =
                    ordersStore.getOrderPriority(order);
                  const isExpired = remainingMs <= 0 && fastest !== "Completed";

                  const getPriorityDisplay = () => {
                    switch (fastest) {
                      case "1H":
                        return { label: "1H", color: "text-primary font-bold" };
                      case "5H":
                        return {
                          label: "5H",
                          color: "text-foreground font-semibold",
                        };
                      case "24H":
                        return { label: "24H", color: "text-muted-foreground" };
                      default:
                        return {
                          label: fastest,
                          color: "text-muted-foreground",
                        };
                    }
                  };

                  const priority = getPriorityDisplay();

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`table-row-hover cursor-pointer ${
                        isExpired ? "gentle-pulse bg-primary/5" : ""
                      }`}
                    >
                      <td className="py-4 px-4 text-foreground font-medium text-sm">
                        {order.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-foreground text-sm font-medium">
                            {order.email}
                          </span>
                          {order.whatsapp && (
                            <span className="text-xs text-muted-foreground">
                              {order.whatsapp}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-foreground text-sm font-medium">
                        {order.flyers.length}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs ${priority.color}`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`font-mono text-xs font-bold ${
                            isExpired ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {msToHMS(remainingMs)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, e.target.value as any);
                          }}
                          className="px-2 py-1.5 rounded text-xs border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 font-medium"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button className="text-primary hover:text-primary/80 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {visibleOrders.completed.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                Completed Orders ({visibleOrders.completed.length})
              </h3>
              <div className="border border-border rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/20 border-b border-border">
                    <tr>
                      <th className="text-left py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                        Order ID
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                        Email
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                        Flyers
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                        Date
                      </th>
                      <th className="text-center py-4 px-4 font-semibold text-foreground text-xs uppercase tracking-wide">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {visibleOrders.completed.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="table-row-hover cursor-pointer"
                      >
                        <td className="py-4 px-4 text-foreground font-medium text-sm">
                          {order.id}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground text-sm">
                          {order.email}
                        </td>
                        <td className="py-4 px-4 text-foreground text-sm font-medium">
                          {order.flyers.length}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground text-sm">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button className="text-primary hover:text-primary/80 transition-colors">
                            <ChevronRight className="w-4 h-4" />
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
  );
});
