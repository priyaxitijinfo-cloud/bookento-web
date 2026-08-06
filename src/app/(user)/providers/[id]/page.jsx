"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar, Clock, MapPin, Phone, Share2, Star, Verified, Heart,
  Building2, Home, Monitor, Play,
} from "lucide-react";
import { toast } from "sonner";

import { UserBottomNav } from "@/components/layout/user-nav";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES, providerBookingRoute } from "@/constants/routes.constants";
import { getGalleryByProvider } from "@/mock/gallery";
import { getPackagesByProvider } from "@/mock/packages";
import { getProviderById } from "@/mock/providers";
import { reels } from "@/mock/reels";
import { getRatingOverview, getReviewsByProvider } from "@/mock/reviews";
import { getServicesByProvider } from "@/mock/services";
import { useProviderStore } from "@/store";
import { formatCurrency, formatDuration, formatRelativeTime } from "@/utils/format.utils";

const VISIT_ICONS = { in_clinic: Building2, home_visit: Home, online: Monitor };
const VISIT_LABELS = { in_clinic: "In Clinic", home_visit: "Home Visit", online: "Online" };

export default function ProviderDetailPage() {
  const { id } = useParams();
  const { setSelectedProvider } = useProviderStore();
  const [saved, setSaved] = useState(false);

  const provider = getProviderById(id);
  const services = provider ? getServicesByProvider(provider.id) : [];
  const packages = provider ? getPackagesByProvider(provider.id) : [];
  const reviews = provider ? getReviewsByProvider(provider.id) : [];
  const gallery = provider ? getGalleryByProvider(provider.id) : [];
  const providerReels = provider ? reels.filter((r) => r.providerId === provider.id) : [];
  const ratingOverview = provider ? getRatingOverview(provider.id) : null;

  useEffect(() => {
    if (provider) setSelectedProvider(provider);
  }, [provider, setSelectedProvider]);

  if (!provider) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <EmptyState title="Provider not found" description="This provider may have been removed." actionLabel="Browse providers" onAction={() => window.location.href = ROUTES.PROVIDERS} />
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="bg-background min-h-dvh pb-24 md:pb-6">
      {/* Cover */}
      <div className="relative h-48 md:h-64">
        <Image src={provider.coverImage} alt={provider.businessName} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <Link href={ROUTES.PROVIDERS}>
            <Button variant="secondary" size="icon" className="bg-white/90 backdrop-blur">
              ←
            </Button>
          </Link>
        </div>
        <div className="absolute right-4 top-4 flex gap-2">
          <Button variant="secondary" size="icon" className="bg-white/90" onClick={() => { setSaved(!saved); toast.success(saved ? "Removed from saved" : "Saved to favorites"); }}>
            <Heart className={saved ? "fill-destructive text-destructive" : ""} />
          </Button>
          <Button variant="secondary" size="icon" className="bg-white/90" onClick={handleShare}>
            <Share2 />
          </Button>
        </div>
      </div>

      {/* Profile header */}
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="border-background relative size-24 shrink-0 overflow-hidden rounded-2xl border-4 shadow-lg">
              <Image src={provider.avatar} alt={provider.businessName} fill className="object-cover" />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold md:text-2xl">{provider.businessName}</h1>
                {provider.isVerified && (
                  <Badge variant="success" className="gap-1">
                    <Verified className="size-3" /> Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{provider.specialty}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 font-medium">
                  <Star className="size-4 fill-warning text-warning" />
                  {provider.rating} ({provider.totalReviews} reviews)
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3" /> {provider.city} · {provider.distance} km
                </span>
              </div>
            </div>
          </div>
          <Link href={providerBookingRoute(provider.id)}>
            <Button size="lg" className="w-full sm:w-auto">
              <Calendar className="size-4" /> Book Now
            </Button>
          </Link>
        </div>

        {/* Tags & visit modes */}
        <div className="mt-4 flex flex-wrap gap-2">
          {provider.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
          {provider.serviceModes.map((mode) => {
            const Icon = VISIT_ICONS[mode] || Building2;
            return (
              <Badge key={mode} variant="outline" className="gap-1">
                <Icon className="size-3" /> {VISIT_LABELS[mode] || mode}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <main className="mx-auto mt-6 max-w-7xl px-4 pb-6">
        <Tabs defaultValue="about">
          <TabsList className="scrollbar-hide w-full justify-start overflow-x-auto">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
            <TabsTrigger value="packages">Packages ({packages.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="gallery">Gallery ({gallery.length})</TabsTrigger>
            <TabsTrigger value="reels">Reels ({providerReels.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <p className="text-muted-foreground leading-relaxed">{provider.description}</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
                      <Clock className="text-primary size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{provider.yearsOfExperience}+ Years</p>
                      <p className="text-muted-foreground text-xs">Experience</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
                      <Calendar className="text-primary size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{provider.totalBookings}+ Bookings</p>
                      <p className="text-muted-foreground text-xs">Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
                      <Phone className="text-primary size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{provider.phone}</p>
                      <p className="text-muted-foreground text-xs">Contact</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 font-semibold">Location</h3>
                <p className="text-muted-foreground text-sm">{provider.address}, {provider.city}, {provider.state} - {provider.pincode}</p>
                <div className="bg-muted mt-4 flex h-40 items-center justify-center rounded-xl">
                  <MapPin className="text-muted-foreground size-8" />
                  <span className="text-muted-foreground ml-2 text-sm">Map preview</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 font-semibold">Business Hours</h3>
                <div className="space-y-2">
                  {Object.entries(provider.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm capitalize">
                      <span className="font-medium">{day}</span>
                      <span className={hours.isOpen ? "text-muted-foreground" : "text-destructive"}>
                        {hours.isOpen ? `${hours.open} - ${hours.close}` : "Closed"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((svc) => (
                <Card key={svc.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="relative h-28 w-28 shrink-0">
                      <Image src={svc.image} alt={svc.name} fill className="object-cover" />
                    </div>
                    <CardContent className="flex flex-1 flex-col justify-center py-4">
                      <h4 className="font-semibold">{svc.name}</h4>
                      <p className="text-muted-foreground line-clamp-2 text-xs">{svc.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-primary font-bold">{formatCurrency(svc.price)}</span>
                        <span className="text-muted-foreground text-xs">{formatDuration(svc.duration)}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="packages">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                    <Badge className="absolute right-2 top-2">{pkg.discountPercent}% OFF</Badge>
                  </div>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold">{pkg.name}</h4>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{pkg.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-primary text-lg font-bold">{formatCurrency(pkg.price)}</span>
                      <span className="text-muted-foreground text-sm line-through">{formatCurrency(pkg.originalPrice)}</span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">Valid for {pkg.validityDays} days · {pkg.serviceIds.length} services</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {ratingOverview && (
              <Card>
                <CardContent className="flex items-center gap-6 pt-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{ratingOverview.averageRating}</p>
                    <div className="mt-1 flex justify-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`size-4 ${i < Math.round(ratingOverview.averageRating) ? "fill-warning text-warning" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">{ratingOverview.totalRatings} ratings</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar src={review.userAvatar} name={review.userName} size="md" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{review.userName}</p>
                        <span className="text-muted-foreground text-xs">{formatRelativeTime(review.createdAt)}</span>
                      </div>
                      <div className="mt-1 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`size-3 ${i < review.rating ? "fill-warning text-warning" : "text-muted"}`} />
                        ))}
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm">{review.comment}</p>
                      {review.reply && (
                        <div className="bg-muted mt-3 rounded-xl p-3">
                          <p className="text-xs font-medium">Provider Response</p>
                          <p className="text-muted-foreground mt-1 text-sm">{review.reply.comment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="gallery">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {gallery.map((item) => (
                <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl">
                  <Image src={item.url} alt={item.caption} fill className="object-cover transition-transform group-hover:scale-105" />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="size-10 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reels">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {providerReels.length > 0 ? providerReels.map((reel) => (
                <Link key={reel.id} href={ROUTES.REELS}>
                  <div className="group relative aspect-[9/16] overflow-hidden rounded-xl">
                    <Image src={reel.thumbnailUrl} alt={reel.caption} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex flex-col justify-end">
                      <p className="line-clamp-2 text-xs text-white">{reel.caption}</p>
                      <p className="mt-1 text-xs text-white/70">{reel.views.toLocaleString()} views</p>
                    </div>
                    <Play className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 text-white opacity-80" />
                  </div>
                </Link>
              )) : (
                <EmptyState title="No reels yet" description="This provider hasn't posted any reels." />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Sticky book bar on mobile */}
      <div className="border-border bg-background/95 safe-bottom fixed inset-x-0 bottom-0 z-40 border-t p-4 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-xs">Starting from</p>
            <p className="text-primary text-lg font-bold">{formatCurrency(provider.startingPrice)}</p>
          </div>
          <Link href={providerBookingRoute(provider.id)} className="flex-1">
            <Button className="w-full" size="lg">Book Appointment</Button>
          </Link>
        </div>
      </div>
      <UserBottomNav />
    </div>
  );
}
