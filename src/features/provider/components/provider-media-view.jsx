"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Eye,
  ImageIcon,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { ROUTES, providerMediaVideoEditRoute } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import {
  formatCompactViews,
  useProviderMediaStore,
} from "@/store/provider-media.store";

const MAX_PHOTOS_PER_UPLOAD = 5;
const FALLBACK_PHOTO = "/images/nearby-bright-dental.png";
const FALLBACK_VIDEO = "/images/doctor-videos/video-1.png";

function PhotosEmptyIllustration() {
  return (
    <div className="relative mx-auto mb-6 flex h-48 w-56 items-end justify-center">
      <span className="absolute top-6 left-10 size-1.5 rounded-full bg-[#93C5FD]" />
      <span className="absolute top-12 right-12 size-1 rounded-full bg-[#60A5FA]" />
      <span className="absolute top-20 left-16 size-1 rounded-full bg-[#BFDBFE]" />
      <span className="absolute right-10 bottom-32 size-1.5 rounded-full bg-[#93C5FD]" />

      <div className="absolute bottom-12 left-2 flex flex-col items-center">
        <div className="mb-0.5 flex items-end gap-0.5">
          <span className="h-5 w-2.5 rounded-t-full bg-[#4ADE80]" />
          <span className="h-7 w-2.5 rounded-t-full bg-[#22C55E]" />
          <span className="h-4 w-2 rounded-t-full bg-[#86EFAC]" />
        </div>
        <div className="h-5 w-7 rounded-b-lg bg-[#93C5FD]" />
      </div>

      <div className="relative z-10 mb-8 drop-shadow-md">
        <div className="flex size-[6.5rem] items-center justify-center rounded-2xl border-[3px] border-[#93C5FD] bg-[#E8F1FF]">
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="flex size-7 items-center justify-center rounded-md bg-white shadow-sm"
              >
                <ImageIcon className="size-3.5 text-[#93C5FD]" strokeWidth={2} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-1 bottom-20">
        <div className="relative">
          <span className="absolute top-3 -left-4 h-px w-4 border-t border-dashed border-[#60A5FA]" />
          <span className="absolute top-1 -left-7 h-px w-3 rotate-[-20deg] border-t border-dashed border-[#93C5FD]" />
          <div className="size-0 border-y-[7px] border-l-[14px] border-y-transparent border-l-[#1865EA]" />
        </div>
      </div>
    </div>
  );
}

function VideosEmptyIllustration() {
  return (
    <div className="relative mx-auto mb-6 flex h-48 w-56 items-end justify-center">
      <span className="absolute top-8 left-12 size-1.5 rounded-full bg-[#93C5FD]" />
      <span className="absolute top-14 right-14 size-1 rounded-full bg-[#60A5FA]" />
      <span className="absolute right-10 bottom-36 size-1.5 rounded-full bg-[#93C5FD]" />

      <div className="absolute bottom-14 left-3 flex flex-col items-center">
        <div className="mb-0.5 flex items-end gap-0.5">
          <span className="h-5 w-2.5 rounded-t-full bg-[#4ADE80]" />
          <span className="h-7 w-2.5 rounded-t-full bg-[#22C55E]" />
          <span className="h-4 w-2 rounded-t-full bg-[#86EFAC]" />
        </div>
        <div className="h-5 w-7 rounded-b-lg bg-[#93C5FD]" />
      </div>

      <div className="relative z-10 mb-10 drop-shadow-md">
        <div className="w-[6.75rem] overflow-hidden rounded-2xl border-[3px] border-[#1865EA] bg-white shadow-sm">
          <div className="flex h-5 items-end justify-center gap-1 bg-[#1865EA] px-2 pb-1">
            <span className="h-2 w-3 rounded-sm bg-white/80" />
            <span className="h-3 w-3 rounded-sm bg-white/90" />
            <span className="h-2.5 w-3 rounded-sm bg-white/70" />
          </div>
          <div className="flex h-16 items-center justify-center bg-[#E8F1FF]">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#1865EA] text-white shadow-sm">
              <span className="ml-0.5 size-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadPhotosModal({ open, onClose, onSave }) {
  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState([]);
  const fileInputId = useId();
  const inputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setPending([]);
      return undefined;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const remaining = MAX_PHOTOS_PER_UPLOAD - pending.length;

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const nextUrls = files
      .slice(0, Math.max(0, remaining))
      .map((file) => URL.createObjectURL(file));
    if (files.length > remaining) {
      toast.error(`Maximum ${MAX_PHOTOS_PER_UPLOAD} images can be uploaded.`);
    }
    setPending((prev) => [...prev, ...nextUrls].slice(0, MAX_PHOTOS_PER_UPLOAD));
    e.target.value = "";
  };

  const removePending = (index) => {
    setPending((prev) => prev.filter((_, i) => i !== index));
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-photos-title"
        className="relative w-full max-w-[360px] rounded-[1.5rem] bg-white px-5 pt-6 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <h2
          id="upload-photos-title"
          className="text-center text-lg font-bold text-[#111827]"
        >
          Upload Photos
        </h2>

        <input
          id={fileInputId}
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={handleFiles}
        />

        {pending.length > 0 ? (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {pending.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative aspect-square overflow-hidden rounded-xl bg-[#F4F7FF]"
              >
                <Image src={src} alt="" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => removePending(index)}
                  className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-[#1865EA] text-white shadow-sm"
                  aria-label="Remove photo"
                >
                  <X className="size-3" strokeWidth={2.5} />
                </button>
              </div>
            ))}
            {pending.length < MAX_PHOTOS_PER_UPLOAD ? (
              <label
                htmlFor={fileInputId}
                className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#93C5FD] bg-[#F4F7FF] transition-colors hover:bg-[#E8F1FF]"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#1865EA] text-white">
                  <Plus className="size-4" strokeWidth={2.5} />
                </span>
              </label>
            ) : null}
          </div>
        ) : (
          <label
            htmlFor={fileInputId}
            className="mt-5 flex min-h-[9.5rem] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-[#93C5FD] bg-[#F4F7FF] px-4 py-6 transition-colors hover:bg-[#E8F1FF]"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm">
              <Plus className="size-5" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold text-[#0F172A]">Add Photos</span>
          </label>
        )}

        <p className="mt-2 text-right text-[11px] font-medium text-[#EF4444]">
          Maximum {MAX_PHOTOS_PER_UPLOAD} images can be uploaded.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl bg-[#F2F4F7] text-sm font-semibold text-[#374151] transition-colors hover:bg-[#E8ECF1]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!pending.length) {
                toast.error("Please add at least one photo");
                return;
              }
              onSave(pending);
            }}
            className="h-12 rounded-xl bg-[#1865EA] text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function DeleteVideoModal({ open, onClose, onConfirm }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-video-title"
        className="relative w-full max-w-[340px] rounded-[1.5rem] bg-white px-5 pt-8 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <div className="relative mx-auto mb-5 flex size-20 items-center justify-center">
          <span className="absolute -top-1 left-2 text-sm font-bold text-[#F87171]">
            +
          </span>
          <span className="absolute top-1 right-1 size-2 rounded-full border-2 border-[#F87171]" />
          <span className="absolute bottom-2 left-0 text-xs font-bold text-[#FCA5A5]">
            +
          </span>
          <span className="absolute right-0 bottom-3 size-1.5 rounded-full bg-[#FCA5A5]" />
          <span className="flex size-16 items-center justify-center rounded-full bg-[#FEE2E2]">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-sm">
              <Trash2 className="size-5" strokeWidth={2.2} />
            </span>
          </span>
        </div>

        <h2
          id="delete-video-title"
          className="text-center text-xl font-bold text-[#111827]"
        >
          Delete Videos
        </h2>
        <p className="mx-auto mt-2 max-w-[260px] text-center text-sm leading-relaxed text-[#64748B]">
          Are you sure you want to remove this video from your service?
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl bg-[#F2F4F7] text-sm font-semibold text-[#374151] transition-colors hover:bg-[#E8ECF1]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 rounded-xl bg-[#EF4444] text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function VideoGridCard({ video, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [menuOpen]);

  return (
    <article className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#E8F1FF]">
      <Image
        src={video.thumbnail || FALLBACK_VIDEO}
        alt={video.title || "Video"}
        fill
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2 pt-8 pb-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white">
          <Eye className="size-3.5" strokeWidth={2.2} />
          {formatCompactViews(video.views)}
        </span>
      </div>

      <div className="absolute top-2 right-2" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex size-7 items-center justify-center rounded-full bg-white text-[#1865EA] shadow-sm"
          aria-label="Video actions"
          aria-expanded={menuOpen}
        >
          <MoreVertical className="size-3.5" />
        </button>
        {menuOpen ? (
          <div className="absolute top-full right-0 z-20 mt-1.5 min-w-[7.5rem] overflow-hidden rounded-xl border border-[#EEF1F6] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFF]"
              onClick={() => {
                setMenuOpen(false);
                onEdit(video);
              }}
            >
              <Pencil className="size-3.5 text-[#64748B]" />
              Edit
            </button>
            <div className="mx-3 border-t border-[#EEF1F6]" />
            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFF]"
              onClick={() => {
                setMenuOpen(false);
                onDelete(video);
              }}
            >
              <Trash2 className="size-3.5 text-[#64748B]" />
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function ProviderMediaView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceEmpty = searchParams.get("empty") === "1";
  const tabParam = searchParams.get("tab");

  const photos = useProviderMediaStore((s) => s.photos);
  const videos = useProviderMediaStore((s) => s.videos);
  const addPhotos = useProviderMediaStore((s) => s.addPhotos);
  const deletePhoto = useProviderMediaStore((s) => s.deletePhoto);
  const deleteVideo = useProviderMediaStore((s) => s.deleteVideo);

  const [tab, setTab] = useState(() => (tabParam === "videos" ? "videos" : "photos"));
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (tabParam === "videos" || tabParam === "photos") {
      setTab(tabParam === "videos" ? "videos" : "photos");
    }
  }, [tabParam]);

  const photoList = forceEmpty ? [] : photos;
  const videoList = forceEmpty ? [] : videos;
  const isPhotosEmpty = photoList.length === 0;
  const isVideosEmpty = videoList.length === 0;

  const setTabAndQuery = (next) => {
    setTab(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    router.replace(`${ROUTES.PROVIDER_MEDIA}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleHeaderAdd = () => {
    if (tab === "photos") {
      setUploadOpen(true);
      return;
    }
    router.push(ROUTES.PROVIDER_MEDIA_VIDEO_NEW);
  };

  const handleSavePhotos = (urls) => {
    addPhotos(urls);
    setUploadOpen(false);
    toast.success(
      urls.length === 1 ? "Photo uploaded" : `${urls.length} photos uploaded`,
    );
  };

  const handleConfirmDeleteVideo = () => {
    if (!deleteTarget) return;
    deleteVideo(deleteTarget.id);
    setDeleteTarget(null);
    toast.success("Video deleted");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-1 px-3 lg:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#F4F7FF]"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="flex-1 truncate text-center text-lg font-bold text-[#111827]">
            Post Upload
          </h1>
          <button
            type="button"
            onClick={handleHeaderAdd}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm transition-opacity hover:opacity-90"
            aria-label={tab === "photos" ? "Add photos" : "Add video"}
          >
            <Plus className="size-5" strokeWidth={2.4} />
          </button>
        </div>
      </header>

      <div className="shrink-0 border-b border-[#E8EEF8] bg-white">
        <div className="mx-auto max-w-3xl px-4 py-3 lg:px-6">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F4F7FF] p-1 ring-1 ring-[#E8EEF8]">
            <button
              type="button"
              onClick={() => setTabAndQuery("photos")}
              className={cn(
                "h-10 rounded-lg text-sm font-semibold transition-colors",
                tab === "photos"
                  ? "bg-[#1865EA] text-white shadow-sm"
                  : "bg-transparent text-[#64748B]",
              )}
            >
              Gallery Photos
            </button>
            <button
              type="button"
              onClick={() => setTabAndQuery("videos")}
              className={cn(
                "h-10 rounded-lg text-sm font-semibold transition-colors",
                tab === "videos"
                  ? "bg-[#1865EA] text-white shadow-sm"
                  : "bg-transparent text-[#64748B]",
              )}
            >
              Shorts Videos
            </button>
          </div>
        </div>
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 lg:px-6 lg:py-6">
          {tab === "photos" ? (
            isPhotosEmpty ? (
              <div className="flex min-h-[calc(100dvh-12rem)] flex-col items-center justify-center px-4 pb-16 text-center">
                <PhotosEmptyIllustration />
                <h2 className="text-xl font-bold text-[#0F172A]">
                  No Photos Added Yet
                </h2>
                <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-[#94A3B8]">
                  You haven&apos;t added any photos yet. Add photos for a richer
                  profile.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="flex aspect-square items-center justify-center rounded-2xl bg-[#E8EEF8] text-[#94A3B8] transition-colors hover:bg-[#DEE5F2]"
                  aria-label="Add photos"
                >
                  <ImageIcon className="size-8" strokeWidth={1.6} />
                </button>
                {photoList.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square overflow-hidden rounded-2xl bg-[#E8F1FF]"
                  >
                    <Image
                      src={photo.url || FALLBACK_PHOTO}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => {
                        deletePhoto(photo.id);
                        toast.success("Photo removed");
                      }}
                      className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-[#1865EA] text-white shadow-sm transition-opacity hover:opacity-90"
                      aria-label="Delete photo"
                    >
                      <X className="size-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : isVideosEmpty ? (
            <div className="flex min-h-[calc(100dvh-12rem)] flex-col items-center justify-center px-4 pb-16 text-center">
              <VideosEmptyIllustration />
              <h2 className="text-xl font-bold text-[#0F172A]">No Videos Yet</h2>
              <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-[#94A3B8]">
                You haven&apos;t saved any videos yet. Upload a short video to get
                started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {videoList.map((video) => (
                <VideoGridCard
                  key={video.id}
                  video={video}
                  onEdit={(v) => router.push(providerMediaVideoEditRoute(v.id))}
                  onDelete={(v) => setDeleteTarget(v)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <UploadPhotosModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={handleSavePhotos}
      />
      <DeleteVideoModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDeleteVideo}
      />
    </div>
  );
}
