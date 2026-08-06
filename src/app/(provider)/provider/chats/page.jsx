"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes.constants";
import { providerConversations } from "@/mock/chat";
import { formatRelativeTime } from "@/utils/format.utils";

export default function ProviderChatsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      providerConversations.filter(
        (c) =>
          !search || c.participantName.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <>
      <ProviderHeader title="Chats" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="relative mb-4">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="space-y-2">
          {filtered.map((conv) => (
            <Link key={conv.id} href={`${ROUTES.PROVIDER_CHATS}/${conv.id}`}>
              <Card className="shadow-card hover:shadow-card-hover cursor-pointer transition-all hover:border-primary/30">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="relative">
                    <Avatar src={conv.participantAvatar} name={conv.participantName} size="lg" />
                    {conv.isOnline && (
                      <span className="bg-success absolute right-0 bottom-0 size-3 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold">{conv.participantName}</p>
                      <span className="text-muted-foreground shrink-0 text-xs">
                        {formatRelativeTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 truncate text-sm">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge className="shrink-0">{conv.unreadCount}</Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
