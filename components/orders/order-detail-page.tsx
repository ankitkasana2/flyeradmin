"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Copy, CheckCircle2, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ordersStore } from "@/stores/ordersStore";

export interface OrderFromAPI {
  id: number;
  email: string | null;
  whatsapp?: string;
  name?: string;
  paymentMethod?: string;
  totalAmount?: string;
  status: 'pending' | 'processing' | 'completed';
  created_at: string;
  updated_at: string;
  web_user_id: string | null;

  // Event details
  presenting: string;
  event_title: string;
  event_date: string;
  flyer_info: string;
  address_phone: string;
  venue_logo: string | null;
  djs: (string | { name: string | { name: string }; image?: string | null })[];
  host: Record<string, any> | { name: string | { name: string }; image?: string | null };
  sponsors: (string | { name: string | { name: string }; image?: string | null })[];
  custom_notes: string;
  flyer_is: number;
  delivery_time?: string;
  total_price?: string;
  adminNotes?: string;

  // For backward compatibility
  flyers?: Array<{
    id: string;
    name?: string;
    fileName?: string;
    delivery: '1H' | '5H' | '24H';
  }>;

  // Alias for created_at
  createdAt?: string;
}

interface OrderDetailPageProps {
  selectedOrder: OrderFromAPI;
  onBack: () => void;
}

export function OrderDetailPage({
  selectedOrder,
  onBack,
}: OrderDetailPageProps) {
  const [now, setNow] = useState(Date.now());
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState(selectedOrder?.custom_notes || selectedOrder?.adminNotes || "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Parse delivery time from API
  const parseDeliveryTime = (deliveryStr?: string): '1H' | '5H' | '24H' => {
    if (!deliveryStr) return '24H';
    if (deliveryStr.includes('1 Hour') || deliveryStr.includes('1H')) return '1H';
    if (deliveryStr.includes('5 Hour') || deliveryStr.includes('5H')) return '5H';
    return '24H';
  };

  const flyerDelivery = parseDeliveryTime(selectedOrder.delivery_time);

  const calculateRemainingTime = () => {
    const hours = { "1H": 1, "5H": 5, "24H": 24 }[flyerDelivery] || 24;
    const deadline = new Date(selectedOrder.created_at).getTime() + hours * 60 * 60 * 1000;
    const remainingMs = deadline - now;
    if (remainingMs <= 0) return "00:00:00";
    const total = Math.floor(remainingMs / 1000);
    const hrs = Math.floor(total / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    const two = (n: number) => n.toString().padStart(2, "0");
    return `${two(hrs)}:${two(mins)}:${two(secs)}`;
  };

  const getDeliveryLabel = () => {
    const labels = { "1H": "1H - EXPRESS", "5H": "5H - FAST", "24H": "24H - NORMAL" };
    return labels[flyerDelivery];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Here you can add logic to upload the file to your server
      console.log('File selected:', file.name);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  // alert(JSON.stringify(selectedOrder));
  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="sticky top-0 bg-background/95 border-b border-border z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            className="bg-secondary border-border text-foreground hover:bg-secondary/80 font-semibold h-9 gap-2 text-sm transition-all"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            Order #{selectedOrder.id}
          </h1>
          {/* Status Dropdown */}
          <select
            value={selectedOrder.status}
            onChange={(e) => ordersStore.updateOrderStatus(selectedOrder.id, e.target.value as any)}
            className={`
              px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer min-w-[150px]
              transition-all duration-200 outline-none border border-border
              shadow-[0_4px_12px_rgba(0,0,0,0.45)]
              bg-[#181818]
              ${selectedOrder.status === "pending"
                ? "bg-red-500/20 text-red-400"
                : selectedOrder.status === "processing"
                  ? "bg-yellow-400/20 text-yellow-300"
                  : "bg-green-500/20 text-green-400"
              }
            `}
          >
            <option
              value="pending"
              className="font-semibold"
              style={{
                backgroundColor: "#ffdddd",
                color: "#d10000"
              }}
            >
              Pending
            </option>
            <option
              value="processing"
              className="font-semibold"
              style={{
                backgroundColor: "#fff5cc",
                color: "#b68f00"
              }}
            >
              Processing
            </option>
            <option
              value="completed"
              className="font-semibold"
              style={{
                backgroundColor: "#ddffdd",
                color: "#008f2a"
              }}
            >
              Completed
            </option>
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Customer Information - Tumhara original section */}
        <Card className="border border-border bg-card">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-bold text-foreground tracking-tight">
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Name", value: selectedOrder.name || "N/A", id: "name" },
                { label: "Email", value: selectedOrder.email || "N/A", id: "email" },
                { label: "WhatsApp", value: selectedOrder.whatsapp || "N/A", id: "whatsapp" },
                { label: "Payment Method", value: "Stripe", id: "payment" },
                { label: "Total Amount", value: selectedOrder.total_price ? `₹${selectedOrder.total_price}` : "N/A", id: "amount" },
                { label: "Order Date", value: formatDate(selectedOrder.created_at), id: "date" },
              ].map((field) => (
                <div
                  key={field.id}
                  className="p-3 bg-secondary border border-border rounded hover:border-primary/50 transition-all group cursor-copy"
                  onClick={() => copyToClipboard(field.value, field.id)}
                >
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    {field.label}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-foreground break-all font-medium">{field.value}</p>
                    {copiedField === field.id ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* NAYE API FIELDS YAHAN ADD KIYE - Tumhara original design maintain kiya */}
        <Card className="border border-border bg-card">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-bold text-foreground tracking-tight">
              Event & Flyer Details (API Data)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Presenting", value: selectedOrder.presenting || "N/A", id: "presenting" },
                { label: "Event Title", value: selectedOrder.event_title || "N/A", id: "event_title" },
                { label: "Event Date & Time", value: formatDate(selectedOrder.event_date), id: "event_date" },
                { label: "Flyer Info/Text", value: selectedOrder.flyer_info || "N/A", id: "flyer_info" },
                { label: "Address / Phone", value: selectedOrder.address_phone || "N/A", id: "address_phone" },
                { label: "Custom Notes", value: selectedOrder.custom_notes || "No notes", id: "custom_notes" },
                { label: "Flyer Type", value: selectedOrder.flyer_is === 1 ? "Static Flyer" : "Animated/Other", id: "flyer_is" },
              ].map((field) => (
                <div
                  key={field.id}
                  className="p-3 bg-secondary border border-border rounded hover:border-primary/50 transition-all group cursor-copy"
                  onClick={() => copyToClipboard(field.value, field.id)}
                >
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    {field.label}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-foreground break-all font-medium">{field.value}</p>
                    {copiedField === field.id ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />}
                  </div>
                </div>
              ))}
            </div>

            {/* DJs */}
            {selectedOrder.djs && selectedOrder.djs.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">DJ Lineup</p>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.djs.map((dj, i) => {
                    // Safely extract DJ name - ensure it's always a string
                    let djName = 'Unknown DJ';
                    if (typeof dj === 'string') {
                      djName = dj || 'Unknown DJ';
                    } else if (typeof dj === 'object' && dj !== null && 'name' in dj) {
                      const nameValue = dj.name;
                      if (typeof nameValue === 'string') {
                        djName = nameValue || 'Unknown DJ';
                      } else if (typeof nameValue === 'object' && nameValue !== null && 'name' in nameValue) {
                        // Handle nested { name: { name: "value" } } structure
                        const innerName = typeof nameValue.name === 'string' ? nameValue.name : String(nameValue.name);
                        djName = innerName || 'Unknown DJ';
                      } else if (typeof nameValue === 'object' && nameValue !== null) {
                        djName = JSON.stringify(nameValue);
                      } else {
                        djName = String(nameValue) || 'Unknown DJ';
                      }
                    }

                    const djImage = typeof dj === 'object' && dj !== null && 'image' in dj && typeof dj.image === 'string'
                      ? dj.image
                      : null;

                    return (
                      <Badge key={i} variant="secondary" className="py-1.5 px-4 flex items-center gap-2">
                        {djImage && (
                          <img src={djImage} alt={djName} className="w-5 h-5 rounded-full object-cover" />
                        )}
                        {djName}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sponsors */}
            {selectedOrder.sponsors && selectedOrder.sponsors.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sponsors</p>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.sponsors.map((s, i) => {
                    // Safely extract sponsor name - ensure it's always a string
                    let sponsorName = 'Unknown Sponsor';
                    if (typeof s === 'string') {
                      sponsorName = s || 'Unknown Sponsor';
                    } else if (typeof s === 'object' && s !== null && 'name' in s) {
                      const nameValue = s.name;
                      if (typeof nameValue === 'string') {
                        sponsorName = nameValue || 'Unknown Sponsor';
                      } else if (typeof nameValue === 'object' && nameValue !== null && 'name' in nameValue) {
                        // Handle nested { name: { name: "value" } } structure
                        const innerName = typeof nameValue.name === 'string' ? nameValue.name : String(nameValue.name);
                        sponsorName = innerName || 'Unknown Sponsor';
                      } else if (typeof nameValue === 'object' && nameValue !== null) {
                        sponsorName = JSON.stringify(nameValue);
                      } else {
                        sponsorName = String(nameValue) || 'Unknown Sponsor';
                      }
                    }

                    const sponsorImage = typeof s === 'object' && s !== null && 'image' in s && typeof s.image === 'string'
                      ? s.image
                      : null;

                    return (
                      <Badge key={i} variant="outline" className="py-1.5 px-4 flex items-center gap-2">
                        {sponsorImage && (
                          <img src={sponsorImage} alt={sponsorName} className="w-5 h-5 rounded-full object-cover" />
                        )}
                        {sponsorName}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Host */}
            {selectedOrder.host && typeof selectedOrder.host === 'object' && Object.keys(selectedOrder.host).length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Host</p>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    // Safely extract host name - ensure it's always a string
                    let hostName = 'N/A';
                    if ('name' in selectedOrder.host) {
                      const nameValue = selectedOrder.host.name;
                      hostName = typeof nameValue === 'string' ? nameValue :
                        typeof nameValue === 'object' && nameValue !== null ? JSON.stringify(nameValue) :
                          String(nameValue);
                    } else {
                      hostName = JSON.stringify(selectedOrder.host);
                    }

                    const hostImage = 'image' in selectedOrder.host && typeof selectedOrder.host.image === 'string'
                      ? selectedOrder.host.image
                      : null;

                    return (
                      <Badge variant="default" className="py-1.5 px-4 flex items-center gap-2">
                        {hostImage && (
                          <img src={hostImage} alt={hostName} className="w-5 h-5 rounded-full object-cover" />
                        )}
                        {hostName}
                      </Badge>
                    );
                  })()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tumhara original Flyers section with countdown */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-foreground tracking-tight uppercase">
            Flyer Delivery Status
          </h2>
          <Card className="border bg-card">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Flyer #1</h3>
                  <p className="text-xs text-muted-foreground mt-1">{selectedOrder.event_title}</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{getDeliveryLabel()}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-secondary border border-border rounded">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Countdown</p>
                  <p className="font-mono font-bold text-lg text-foreground">{calculateRemainingTime()}</p>
                </div>
              </div>

              <div className="border-t border-border/30 pt-5 flex gap-2">
                <input
                  type="file"
                  id="flyer-upload"
                  className="hidden"
                  accept="image/*,.pdf,.zip"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  className="flex-1 bg-secondary border-border text-foreground hover:bg-secondary/80 font-semibold h-9 gap-2 text-sm transition-all"
                  onClick={() => document.getElementById('flyer-upload')?.click()}
                >
                  <Upload className="w-3.5 h-3.5" /> {uploadedFile ? uploadedFile.name : 'Upload'}
                </Button>
                <Button
                  className="flex-1 bg-[#E50914] text-white hover:bg-[#E50914]/90 active:bg-[#E50914] font-semibold h-9 gap-2 text-sm transition-all"
                  onClick={() => ordersStore.updateOrderStatus(selectedOrder.id, 'completed')}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                </Button>
                <Button className="flex-1 bg-[#E50914] text-white hover:bg-[#E50914] active:bg-[#E50914] font-semibold h-9 gap-2 text-sm transition-none">
                  <Send className="w-3.5 h-3.5" /> Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Notes */}
        <Card className="border border-border bg-card">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base font-bold text-foreground tracking-tight">Custom Notes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes..."
              className="w-full p-3 bg-secondary border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-24 resize-none text-sm font-medium"
            />
            <Button className="font-semibold h-9 text-sm bg-[#E50914] text-white transition-none hover:bg-[#E50914] active:bg-[#E50914]">
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