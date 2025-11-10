"use client";

import { useState, useRef } from "react";
import { Upload, X, Save, Ribbon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GiBowTieRibbon } from "react-icons/gi";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BulkUpload({ onClose, onUpload }) {
  const [flyers, setFlyers] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const priceOptions = ["$10", "$15", "$40"];
  const formTypes = ["With Photo", "Only Info", "Birthday"];
  const categories = [
    "Recently Added",
    "Premium Flyers",
    "Basic Flyers",
    "DJ Image or Artist",
    "Ladies Night",
    "Brunch",
    "Summer",
    "Hookah Flyers",
    "Clean Flyers",
    "Drink Flyers",
    "Birthday Flyers",
    // Additional categories (rest of site & search)
    "Beach Party",
    "Pool Party",
    "Tropical",
    "Foam Party",
    "White Party",
    "All Black Party",
    "Halloween",
    "Winter",
    "Christmas",
    "Memorial Day",
    "Back to School",
    "President Day",
    "Saint Valentine's Day",
    "5 de Mayo",
    "Mexican Day",
    "4th of July",
    "Autumn / Fall Vibes",
    "Hip Hop Flyers",
    "Luxury Flyers",
    "Food Flyers",
    "Party Flyers",
  ];

  const handleFileSelect = (files) => {
    if (!files) return;

    const newFlyers = [];
    for (let i = 0; i < Math.min(files.length, 30 - flyers.length); i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newFlyers.push({
            id: `${Date.now()}-${i}`,
            file,
            preview: e.target?.result,
            title: file.name.replace(/\.[^/.]+$/, ""),
            price: "$10",
            formType: "Only Info",
            categories: [],
            recentlyAdded: true,
          });

          if (newFlyers.length === Math.min(files.length, 30 - flyers.length)) {
            setFlyers((prev) => [...prev, ...newFlyers]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const updateFlyer = (id, updates) => {
    setFlyers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const removeFlyer = (id) => {
    setFlyers((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleCategory = (id, category) => {
    setFlyers((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            categories: f.categories.includes(category)
              ? f.categories.filter((c) => c !== category)
              : [...f.categories, category],
          };
        }
        return f;
      })
    );
  };

  const handleSave = () => {
    if (flyers.length > 0) {
      onUpload(flyers);
      setFlyers([]);
    }
  };

  return (
    <Card className="bg-card border-border mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-foreground">Bulk Flyer Upload</CardTitle>
          <CardDescription className="text-muted-foreground">
            Upload up to 30 flyers at once and configure them
          </CardDescription>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        {flyers.length === 0 ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? "border-[#E50914] bg-[#E50914]/5" : "border-border"
              }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-foreground font-semibold mb-1">
              Drag and drop your flyers here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to select files (up to 30 .webp images)
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#E50914] text-white hover:bg-[#C40812]"
            >
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                {flyers.length} flyer{flyers.length !== 1 ? "s" : ""} selected
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-border text-foreground hover:bg-secondary bg-transparent"
              >
                Add More
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Flyers Preview List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {flyers.map((flyer) => {
                const isPremium = flyer.price === "$40";
                const hasPhoto = flyer.formType === "With Photo";
                return (

                  <div
                    key={flyer.id}
                    className="p-4 bg-[#141414] rounded-lg border border-[#333] shadow-sm"
                  >
                    <div className="flex gap-4">
                      {/* Preview Image */}
                      {/* <div className="flex-shrink-0">
                      <img
                        src={flyer.preview || "/placeholder.svg"}
                        alt={flyer.title}
                        className="w-100 h-50 object-cover rounded border border-[#333]"
                      />
                    </div> */}
                      <div className="flex-shrink-0 relative w-100 h-58">
                        {/* Premium ribbon (top-left, highest priority) */}
                        {isPremium && (
                          <div
                            aria-hidden="true"
                            className="absolute z-30"
                            style={{
                              top: 17,
                              left: -1,
                              transform: "rotate(-40deg)",
                            }}
                          >
                            <div
                              className="inline-block px-2 py-[3px] text-[11px] font-semibold rounded-sm shadow-md"
                              style={{
                                background: "linear-gradient(180deg,#F6C84C,#D6A91E)",
                                color: "#111",
                              }}
                            >
                              Premium
                            </div>
                          </div>
                        )}

                        {/* PHOTO ribbon (top-left, below Premium if present) */}
                        {hasPhoto && (
                          // <div
                          //   aria-hidden="true"
                          //   className={isPremium ? "absolute z-20" : "absolute z-30"}
                          //   style={{
                          //     top: isPremium ? 34 : 8,
                          //     left: isPremium ? -8 : -12,
                          //     transform: "rotate(-12deg)",
                          //   }}
                          // >
                          //   <div
                          //     className="inline-block px-2 py-[3px] text-[10px] font-semibold rounded-sm shadow-sm"
                          //     style={{
                          //       background: "#E50914",
                          //       color: "#fff",
                          //     }}
                          //   >
                          //     PHOTO
                          //   </div>
                          // </div>
                          // <div
                          //   aria-hidden="true"
                          //   className={isPremium ? "absolute z-20" : "absolute z-30"}
                          //   style={{
                          //     top: isPremium ? 5 : 5,
                          //     left: 0,
                          //     transform: "rotate(-40deg)",
                          //   }}
                          // >
                          //   <div
                          //     className="flex items-center gap-[4px] px-2 py-[3px] text-[10px] font-semibold rounded-sm shadow-md"
                          //     style={{
                          //       background: "linear-gradient(135deg, #FF3B3B, #D9042B)",
                          //       color: "#fff",
                          //     }}
                          //   >
                          //     <GiBowTieRibbon size={11} strokeWidth={2.3} />
                          //     {/* <span>PHOTO</span> */}
                          //   </div>
                          // </div>

                           <div
    aria-hidden="true"
    className={isPremium ? "absolute z-20" : "absolute z-30"}
    style={{
      top: isPremium ? 4 : 4,
      left:  isPremium ? -13 : -13,
      transform: "rotate(-37deg)", // adjust angle if needed
    }}
  >
    <div
      className="w-[55px] h-auto flex items-center justify-center"
    >
      <img
        src="/rib.png"
        alt="Photo Ribbon"
        className="w-[22px] h-[22px] drop-shadow-md"
      />
    </div>
  </div>
                        )}

                        {/* Image */}
                        <img
                          src={flyer.preview || "/placeholder.svg"}
                          alt={flyer.title || "flyer preview"}
                          className="w-full h-full object-cover rounded border border-[#333]"
                        />
                      </div>


                      {/* Configuration Fields */}
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Title */}
                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-gray-300 mb-1">
                              Title
                            </label>
                            <Input
                              value={flyer.title}
                              onChange={(e) =>
                                updateFlyer(flyer.id, { title: e.target.value })
                              }
                              className="bg-[#1F1F1F] border border-[#333] text-white text-sm px-2 py-1 rounded"
                            />
                          </div>

                          {/* Price Type */}
                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-gray-300 mb-1">
                              Price
                            </label>
                            <select
                              value={flyer.price}
                              onChange={(e) =>
                                updateFlyer(flyer.id, { price: e.target.value })
                              }
                              className="w-full px-2 py-1 bg-[#1F1F1F] border border-[#333] rounded text-white text-sm accent-[#E50914]"
                            >
                              {priceOptions.map((price) => (
                                <option
                                  key={price}
                                  value={price}
                                  className="bg-[#1F1F1F] text-white"
                                >
                                  {price}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Form Type */}
                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-gray-300 mb-1">
                              Form Type
                            </label>
                            <select
                              value={flyer.formType}
                              onChange={(e) =>
                                updateFlyer(flyer.id, {
                                  formType: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 bg-[#1F1F1F] border border-[#333] rounded text-white text-sm"
                            >
                              {formTypes.map((type) => (
                                <option
                                  key={type}
                                  value={type}
                                  className="bg-[#1F1F1F] text-white"
                                >
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Recently Added */}
                          <div className="flex flex-col justify-end">
                            <label className="flex items-center gap-2 cursor-pointer mt-auto">
                              <input
                                type="checkbox"
                                checked={flyer.recentlyAdded}
                                onChange={(e) =>
                                  updateFlyer(flyer.id, {
                                    recentlyAdded: e.target.checked,
                                  })
                                }
                                className="w-4 h-4 rounded border-[#333] checked:bg-[#E50914] checked:border-[#E50914] checked:accent-[#E50914] focus:ring-0"
                              />
                              <span className="text-xs font-medium text-white">
                                Recently Added
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-col">
                          <label className="text-xs font-medium text-gray-300 mb-1">
                            Category
                          </label>
                          <select
                            value={flyer.categories[0] || ""}
                            onChange={(e) =>
                              updateFlyer(flyer.id, {
                                categories: [e.target.value],
                              })
                            }
                            className="w-full px-2 py-1 bg-[#1F1F1F] border border-[#333] rounded text-white text-sm"
                          >
                            <option value="" className="bg-[#1F1F1F] text-white">
                              Select category
                            </option>
                            {categories.map((category) => (
                              <option
                                key={category}
                                value={category}
                                className="bg-[#1F1F1F] text-white"
                              >
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFlyer(flyer.id)}
                        className="flex-shrink-0 p-2 hover:bg-[#E50914]/20 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-[#E50914]" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {flyers.length > 0 && (
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#E50914] text-white hover:bg-[#C40812] gap-2"
            >
              <Save className="w-4 h-4" />
              Save All Flyers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
