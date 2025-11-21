"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Copy, CheckCircle2, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FlyerDetails {
  id: string;
  fileName: string;
  title: string;
  price: number;
  delivery: "1H" | "5H" | "24H";
  formFields?: Record<string, string>;
  logos?: string[];
  images?: string[];
  completedAt?: string;
}

interface Order {
  id: string;
  email: string;
  whatsapp?: string;
  name?: string;
  paymentMethod?: string;
  totalAmount?: string;
  date: string;
  flyers?: FlyerDetails[];
  adminNotes?: string;
  status: string;
  createdAt?: string;
}

interface OrderDetailPageProps {
  selectedOrder?: Order;
  onBack: () => void;
}

export function OrderDetailPage({
  selectedOrder,
  onBack,
}: OrderDetailPageProps) {
  const [now, setNow] = useState(Date.now());
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState(selectedOrder?.adminNotes || "");

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const calculateRemainingTime = (flyerDelivery: string, createdAt: string) => {
    const deliveryMap = { "1H": 1, "5H": 5, "24H": 24 };
    const hours = deliveryMap[flyerDelivery as keyof typeof deliveryMap] || 24;
    const deadline = new Date(createdAt).getTime() + hours * 60 * 60 * 1000;
    const remainingMs = deadline - now;

    if (remainingMs <= 0) return "00:00:00";
    const total = Math.floor(remainingMs / 1000);
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    const two = (n: number) => n.toString().padStart(2, "0");
    return `${two(hrs)}:${two(mins)}:${two(secs)}`;
  };

  const getPriorityDisplay = (delivery: string) => {
    switch (delivery) {
      case "1H":
        return { label: "1H - URGENT", color: "text-primary font-bold" };
      case "5H":
        return { label: "5H - HIGH", color: "text-foreground font-semibold" };
      case "24H":
        return { label: "24H - NORMAL", color: "text-muted-foreground" };
      default:
        return { label: delivery, color: "text-muted-foreground" };
    }
  };

  const mockFlyers: FlyerDetails[] = selectedOrder?.flyers || [
    {
      id: "F1",
      fileName: "grodify237586.jpg",
      title: "Event Flyer",
      price: 15,
      delivery: "1H",
      formFields: { eventName: "Music Night 2025", venue: "Downtown Venue" },
    },
  ];

  if (!selectedOrder) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <button
          onClick={onBack}
          className="text-primary hover:text-primary/80 font-semibold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="sticky top-0 bg-background/95 border-b border-border z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            Order #{selectedOrder.id}
          </h1>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <Card className="border border-border bg-card">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-bold text-foreground tracking-tight">
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: "Name",
                  value: selectedOrder.name || "N/A",
                  id: "name",
                },
                { label: "Email", value: selectedOrder.email, id: "email" },
                {
                  label: "WhatsApp",
                  value: selectedOrder.whatsapp || "N/A",
                  id: "whatsapp",
                },
                {
                  label: "Payment Method",
                  value: selectedOrder.paymentMethod || "N/A",
                  id: "payment",
                },
                {
                  label: "Total Amount",
                  value: selectedOrder.totalAmount || "N/A",
                  id: "amount",
                },
                {
                  label: "Order Date",
                  value: new Date(
                    selectedOrder.createdAt || selectedOrder.date
                  ).toLocaleString(),
                  id: "date",
                },
              ].map((field) => (
                <div
                  key={field.id}
                  className="p-3 bg-secondary border border-border rounded hover:border-primary/50 transition-all group cursor-copy"
                >
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    {field.label}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-foreground break-all font-medium">
                      {field.value}
                    </p>
                    <button
                      onClick={() => copyToClipboard(field.value, field.id)}
                      className={`flex-shrink-0 transition-all ${
                        copiedField === field.id
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground tracking-tight uppercase">
            Flyers ({mockFlyers.length})
          </h2>

          {mockFlyers.map((flyer, index) => {
            const remainingTime = calculateRemainingTime(
              flyer.delivery,
              selectedOrder.createdAt || selectedOrder.date
            );
            const isExpired = remainingTime === "00:00:00";
            const priority = getPriorityDisplay(flyer.delivery);

            return (
              <Card
                key={flyer.id}
                className={`border bg-card transition-all ${
                  isExpired ? "border-primary gentle-pulse" : "border-border"
                }`}
              >
                <CardHeader className="border-b border-border pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        Flyer #{index + 1}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {flyer.title}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${priority.color} whitespace-nowrap`}
                    >
                      {priority.label}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary border border-border rounded">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        File Name
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-mono text-foreground break-all font-medium">
                          {flyer.fileName}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              flyer.fileName,
                              `fileName-${flyer.id}`
                            )
                          }
                          className={`flex-shrink-0 transition-all ${
                            copiedField === `fileName-${flyer.id}`
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-secondary border border-border rounded">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        Title
                      </p>
                      <p className="text-xs text-foreground font-medium">
                        {flyer.title}
                      </p>
                    </div>

                    <div className="p-3 bg-secondary border border-border rounded">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        Price
                      </p>
                      <p className="text-xs text-foreground font-bold">
                        ${flyer.price}
                      </p>
                    </div>

                    <div
                      className={`p-3 rounded border ${
                        isExpired
                          ? "bg-primary/10 border-primary"
                          : "bg-secondary border-border"
                      }`}
                    >
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        Countdown
                      </p>
                      <p
                        className={`font-mono font-bold text-xs ${
                          isExpired ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {remainingTime}
                      </p>
                    </div>
                  </div>

                  {flyer.formFields &&
                    Object.keys(flyer.formFields).length > 0 && (
                      <div className="border-t border-border/30 pt-5 space-y-3">
                        <h4 className="font-semibold text-sm text-foreground uppercase tracking-wide">
                          Form Fields
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(flyer.formFields).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="p-2.5 bg-secondary border border-border rounded hover:border-primary/50 transition-all"
                              >
                                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </p>
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs text-foreground break-all font-medium">
                                    {value}
                                  </p>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(value, `field-${key}`)
                                    }
                                    className={`flex-shrink-0 transition-all ${
                                      copiedField === `field-${key}`
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm h-9 mt-3 transition-all">
                          Copy All Fields
                        </Button>
                      </div>
                    )}

                  <div className="border-t border-border/30 pt-5 flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-secondary border-border text-foreground hover:bg-secondary/80 font-semibold h-9 gap-2 text-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                    </Button>
                    <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-9 gap-2 text-sm transition-all">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Complete
                    </Button>
                    <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-9 gap-2 text-sm transition-all">
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Admin Notes section */}
        <Card className="border border-border bg-card">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-bold text-foreground tracking-tight">
              Admin Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes..."
              className="w-full p-3 bg-secondary border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-24 resize-none text-sm font-medium"
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-9 text-sm transition-all">
              Save Notes
            </Button>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="bg-secondary border-border text-foreground hover:bg-secondary/80 font-semibold h-9 gap-2 text-sm transition-all"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Button>
      </div>
    </div>
  );
}
