"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, MessageCircle, Plus } from "lucide-react";

import { HeroHeartIcon } from "@/components/icons/hero-nav-icons";
import { ProviderHeader } from "@/components/layout/provider-nav";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { posts } from "@/mock/posts";
import { formatRelativeTime } from "@/utils/format.utils";

export default function ProviderPostsPage() {
  const [liked, setLiked] = useState({});

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <ProviderHeader title="Posts" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {posts.length} posts published
          </p>
          <Button>
            <Plus className="size-4" /> Create Post
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Avatar
                    src={post.providerAvatar}
                    name={post.providerName}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium">{post.providerName}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatRelativeTime(post.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="line-clamp-2 text-sm">{post.caption}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.hashtags.map((tag) => (
                    <span key={tag} className="text-primary text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <button
                    type="button"
                    onClick={() => toggleLike(post.id)}
                    className="text-muted-foreground hover:text-destructive flex items-center gap-1 text-sm transition-colors"
                  >
                    <HeroHeartIcon
                      tone="dark"
                      filled={Boolean(liked[post.id] || post.isLiked)}
                      className="text-muted-foreground size-4"
                    />
                    {post.likes + (liked[post.id] ? 1 : 0)}
                  </button>
                  <span className="text-muted-foreground flex items-center gap-1 text-sm">
                    <MessageCircle className="size-4" /> {post.comments}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Eye className="size-4" /> Public
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
