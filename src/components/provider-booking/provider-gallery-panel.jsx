"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";

function GalleryTile({ item, index, onSelect, className }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-zinc-100 text-left",
        className,
      )}
      aria-label={`View ${item.caption}`}
    >
      <img
        src={item.url}
        alt={item.caption}
        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
      {item.label ? (
        <span className="absolute bottom-3 left-3 rounded-lg bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {item.label}
        </span>
      ) : null}
    </button>
  );
}

function ShowcaseGallery({ items, onSelect }) {
  const [hero, ...rest] = items;

  return (
    <div className="space-y-3 md:space-y-4">
      <GalleryTile
        item={hero}
        index={0}
        onSelect={onSelect}
        className="aspect-[21/9] w-full md:aspect-[2.4/1]"
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {rest.map((item, index) => (
          <GalleryTile
            key={item.id}
            item={item}
            index={index + 1}
            onSelect={onSelect}
            className="aspect-[4/3] w-full"
          />
        ))}
      </div>
    </div>
  );
}

function GridGallery({ items, onSelect, className }) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4", className)}>
      {items.map((item, index) => (
        <GalleryTile
          key={item.id}
          item={item}
          index={index}
          onSelect={onSelect}
          className="aspect-square w-full"
        />
      ))}
    </div>
  );
}

export function ProviderGalleryPanel({ items, className = "", variant = "auto" }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const isShowcase =
    variant === "showcase" || (variant === "auto" && Boolean(items[0]?.featured));

  const showPrevious = useCallback(() => {
    setActiveIndex((index) =>
      index === null ? null : (index - 1 + items.length) % items.length,
    );
  }, [items.length]);

  const showNext = useCallback(() => {
    setActiveIndex((index) => (index === null ? null : (index + 1) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, showNext, showPrevious]);

  if (items.length === 0) {
    return (
      <div>
        <p className="text-muted-foreground text-sm">No gallery images available.</p>
      </div>
    );
  }

  return (
    <>
      {isShowcase ? (
        <ShowcaseGallery items={items} onSelect={setActiveIndex} />
      ) : (
        <GridGallery items={items} onSelect={setActiveIndex} className={className} />
      )}

      {activeItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="bg-background/10 hover:bg-background/20 absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full text-white transition-colors"
            aria-label="Close image"
          >
            <X className="size-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                className="bg-background/10 hover:bg-background/20 absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors md:left-6"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="bg-background/10 hover:bg-background/20 absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors md:right-6"
                aria-label="Next image"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}

          <div
            className="flex max-h-full max-w-full flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeItem.url}
              alt={activeItem.caption}
              className="max-h-[85vh] max-w-[min(100%,1200px)] rounded-xl object-contain shadow-2xl"
            />
            {(activeItem.label || activeItem.caption) && (
              <p className="mt-3 text-center text-sm text-white/80">
                {activeItem.label || activeItem.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
