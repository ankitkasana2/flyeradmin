"use client";

import { useState } from "react";
import { type Flyer, CATEGORIES } from "@/lib/flyer-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface EditFlyerModalProps {
  flyer: Flyer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    updatedFlyer: Flyer,
    oldCategory: string,
    newCategory: string
  ) => void;
}

export function EditFlyerModal({
  flyer,
  isOpen,
  onClose,
  onSave,
}: EditFlyerModalProps) {
  const [title, setTitle] = useState(flyer.title);
  const [price, setPrice] = useState(flyer.price);
  const [formType, setFormType] = useState(flyer.formType);
  const [selectedCategory, setSelectedCategory] = useState(flyer.category);
  const [recentlyAdded, setRecentlyAdded] = useState(flyer.recentlyAdded);

  const handleSave = () => {
    const updatedFlyer: Flyer = {
      ...flyer,
      title,
      price: price as 10 | 15 | 40,
      formType: formType as "With Image" | "Without Image",
      category: selectedCategory,
      recentlyAdded,
    };
    onSave(updatedFlyer, flyer.category, selectedCategory);
    onClose();
  };

  const handleReset = () => {
    setTitle(flyer.title);
    setPrice(flyer.price);
    setFormType(flyer.formType);
    setSelectedCategory(flyer.category);
    setRecentlyAdded(flyer.recentlyAdded);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-card to-card/95 border border-border/40">
        <DialogHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Edit Flyer
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Main Title */}
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">
              Main Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter flyer title"
              className="bg-background/50 border-border/60 text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Price Type */}
      <div>
  <label className="text-sm font-bold text-foreground block mb-3">
    Flyer Price Type
  </label>
  <div className="flex gap-4">
    {[10, 15, 40].map((p) => (
      <button
        key={p}
        onClick={() => setPrice(p as 10 | 15 | 40)}
        className={`px-8 py-3 rounded-lg font-bold transition-all duration-200 transform active:scale-95 shadow-lg ${
          price === p
            ? "bg-red-600 hover:bg-red-700 active:bg-red-800 text-black"
            : "bg-muted/50 text-muted-foreground hover:bg-muted/80 border border-border/40"
        }`}
      >
        ${p}
      </button>
    ))}
  </div>
</div>

          {/* Form Type */}
        <div>
  <label className="text-sm font-bold text-foreground block mb-3">
    Form Type
  </label>
  <div className="flex gap-4">
    {["With Image", "Without Image"].map((type) => (
      <button
        key={type}
        onClick={() => setFormType(type as "With Image" | "Without Image")}
        className={`px-8 py-3 rounded-lg font-bold transition-all duration-200 transform active:scale-95 shadow-lg ${
          formType === type
            ? "bg-red-600 hover:bg-red-700 active:bg-red-800 text-black"
            : "bg-muted/50 text-muted-foreground hover:bg-muted/80 border border-border/40"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
</div>

          {/* Categories - Clickable Tags */}
        <div>
  <label className="text-sm font-bold text-foreground mb-3 block">
    Categories
  </label>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
    {CATEGORIES.map((cat) => (
      <button
        key={cat}
        onClick={() => setSelectedCategory(cat)}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 ${
          selectedCategory === cat
            ? "bg-red-600 text-black font-bold shadow-md"
            : "bg-muted/50 text-muted-foreground hover:bg-muted/80 border border-border/40"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
</div>
          {/* Recently Added Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/40">
            <label className="text-sm font-bold text-foreground">
              Recently Added Option
            </label>
            <button
              onClick={() => setRecentlyAdded(!recentlyAdded)}
              className={`px-4 py-2 rounded-lg font-bold transition-all transform ${recentlyAdded
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105"
                  : "bg-muted text-muted-foreground border border-border/40"
                }`}
            >
              {recentlyAdded ? "YES" : "NO"}
            </button>
          </div>
        </div>

        <DialogFooter className="border-t border-border/40 pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-border/40 bg-transparent"
          >
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border/40 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 active:scale-98 text-black font-bold shadow-lg transition-all duration-200"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
