"use client";

import Image from "next/image";
import { useState } from "react";
import { Grid3X3, Play, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { currentProvider } from "@/mock/providers";
import { getGalleryByProvider } from "@/mock/gallery";

export default function ProviderGalleryPage() {
  const [items, setItems] = useState(() => getGalleryByProvider(currentProvider.id));
  const displayItems = items.length > 0 ? items : getGalleryByProvider(require("@/mock/providers").mockProviders[1]?.id || currentProvider.id);

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Image removed from gallery");
  };

  const galleryItems = items.length > 0 ? items : displayItems;

  return (
    <>
      <ProviderHeader title="Gallery" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="text-primary size-5" />
            <p className="text-muted-foreground text-sm">{galleryItems.length} media items</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="size-4" /> Upload
            </Button>
            <Button>
              <Plus className="size-4" /> Add Media
            </Button>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {galleryItems.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image src={item.url} alt={item.caption} fill className="object-cover transition-transform group-hover:scale-105" />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="rounded-full bg-white/90 p-2">
                      <Play className="text-primary size-5 fill-current" />
                    </div>
                    <Badge className="absolute top-2 left-2" variant="secondary">Video</Badge>
                  </div>
                )}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex w-full items-center justify-between">
                    <p className="line-clamp-1 text-xs text-white">{item.caption}</p>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
