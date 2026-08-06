"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, Heart, MessageCircle, Play, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { reels } from "@/mock/reels";
import { formatRelativeTime } from "@/utils/format.utils";

export default function ProviderReelsPage() {
  const [items, setItems] = useState(reels.slice(0, 12));

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
    toast.success("Reel removed");
  };

  return (
    <>
      <ProviderHeader title="Reels" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">{items.length} reels uploaded</p>
          <Button>Upload Reel</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((reel) => (
            <Card key={reel.id} className="group overflow-hidden">
              <div className="relative aspect-[9/16] max-h-72">
                <Image src={reel.thumbnailUrl} alt={reel.caption} fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="rounded-full bg-white/90 p-3">
                    <Play className="text-primary size-6 fill-current" />
                  </div>
                </div>
                <Badge className="absolute top-2 left-2" variant="secondary">
                  {reel.views.toLocaleString()} views
                </Badge>
              </div>
              <CardContent className="p-3">
                <p className="line-clamp-2 text-sm">{reel.caption}</p>
                <p className="text-muted-foreground mt-1 text-xs">{formatRelativeTime(reel.createdAt)}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1"><Heart className="size-3.5" />{reel.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="size-3.5" />{reel.comments}</span>
                  <span className="flex items-center gap-1"><Share2 className="size-3.5" />{reel.shares}</span>
                  <span className="flex items-center gap-1"><Eye className="size-3.5" />{reel.views}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(reel.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
