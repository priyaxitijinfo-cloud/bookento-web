"use client";

import dynamic from "next/dynamic";
import { CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="size-[13rem] shrink-0 md:size-[14rem]" aria-hidden />,
});

const LOTTIE_SRC = "/lottie/successful.json";

export function BookingSuccessModal({ open, doctorName, serviceCount, scheduledTime, onDone }) {
  const lottieRef = useRef(null);
  const [animationData, setAnimationData] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setAnimationData(null);
    setLoadFailed(false);

    fetch(LOTTIE_SRC)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lottie file not found");
        }
        return response.json();
      })
      .then((data) => {
        if (!cancelled) {
          setAnimationData(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const startAnimation = useCallback(() => {
    lottieRef.current?.stop();
    lottieRef.current?.goToAndPlay(0, true);
  }, []);

  if (!open) return null;

  const serviceLabel = serviceCount === 1 ? "service" : "services";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-background shadow-2xl">
        <div className="relative">
          <img
            src="/images/booking-success-bg.png"
            alt=""
            className="absolute inset-0 size-full object-cover object-top"
            draggable={false}
            aria-hidden
          />

          <div className="relative flex h-[17rem] items-center justify-center md:h-[18rem]">
            {animationData ? (
              <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop
                autoplay={false}
                onDOMLoaded={startAnimation}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                style={{ width: "13rem", height: "13rem" }}
                className="pointer-events-none relative z-10 md:!size-[14rem]"
              />
            ) : loadFailed ? (
              <CheckCircle2
                className="relative z-10 size-28 text-[#34B233] md:size-32"
                strokeWidth={1.75}
                aria-hidden
              />
            ) : (
              <div
                className="relative z-10 size-[13rem] animate-pulse rounded-full bg-background/40 md:size-[14rem]"
                aria-hidden
              />
            )}
          </div>
        </div>

        <div className="-mt-[5px] px-6 pb-6 pt-1 text-center md:px-8 md:pb-8">
          <h2 className="text-[1.625rem] font-bold leading-tight text-foreground md:text-[1.75rem]">
            Booking Confirmed
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xs text-sm leading-relaxed md:text-[0.9375rem]">
            {serviceCount} {serviceLabel} booked with {doctorName}. See you today at {scheduledTime}.
          </p>
          <Button
            className="gradient-brand mt-7 h-12 w-full rounded-2xl text-base font-semibold shadow-[0_4px_14px_rgba(24,101,234,0.35)] md:mt-8"
            onClick={onDone}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
