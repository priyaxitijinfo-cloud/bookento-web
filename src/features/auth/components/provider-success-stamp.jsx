"use client";

import dynamic from "next/dynamic";
import { Check, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div
      className="aspect-[300/204] w-full animate-pulse rounded-2xl bg-[#E8F7EE]"
      aria-hidden
    />
  ),
});

const CONFETTI_SRC = "/lottie/confetti.json";
/** Confetti composition starts at frame 50 (see confetti.json ip) */
const CONFETTI_START = 50;
const CONFETTI_END = 125;

const stampClip =
  "[clip-path:polygon(50%_0%,63%_8%,75%_4%,82%_16%,94%_20%,92%_33%,100%_45%,94%_58%,96%_72%,84%_78%,78%_90%,65%_88%,50%_100%,35%_88%,22%_90%,16%_78%,4%_72%,6%_58%,0%_45%,8%_33%,6%_20%,18%_16%,25%_4%,37%_8%)]";

export function ProviderSuccessStamp({ tone = "success", className }) {
  const isSuccess = tone === "success";
  const lottieRef = useRef(null);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    if (!isSuccess) return undefined;

    let cancelled = false;
    fetch(CONFETTI_SRC)
      .then((response) => {
        if (!response.ok) throw new Error("Confetti Lottie not found");
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {
        if (!cancelled) setAnimationData(null);
      });

    return () => {
      cancelled = true;
    };
  }, [isSuccess]);

  const startAnimation = useCallback(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    anim.setLoop(true);
    anim.goToAndPlay(CONFETTI_START, true);
  }, []);

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[22rem] overflow-visible",
        className,
      )}
    >
      <div className="relative mx-auto aspect-[300/204] w-full overflow-visible">
        {isSuccess && animationData ? (
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop
            autoplay
            initialSegment={[CONFETTI_START, CONFETTI_END]}
            onDOMLoaded={startAnimation}
            rendererSettings={{
              preserveAspectRatio: "xMidYMid meet",
              clearCanvas: true,
            }}
            className="pointer-events-none absolute inset-[-10%] z-[1] size-[120%] max-w-none"
            aria-hidden
          />
        ) : null}

        <div className="absolute inset-0 z-[2] flex items-center justify-center">
          <div
            className={cn(
              "flex size-[5.75rem] items-center justify-center rounded-[1.75rem]",
              isSuccess ? "bg-[#22C55E]" : "bg-[#EF4444]",
              stampClip,
            )}
          >
            {isSuccess ? (
              <Check className="size-9 text-white" strokeWidth={3} />
            ) : (
              <X className="size-9 text-white" strokeWidth={3} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
