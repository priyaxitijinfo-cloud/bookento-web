"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="size-[11rem] shrink-0 md:size-[9.5rem]" aria-hidden />,
});

const LOTTIE_SRC = "/lottie/successful.json";

export function BookingSuccessModal({
  open,
  doctorName,
  serviceCount,
  scheduledTime,
  onDone,
}) {
  const lottieRef = useRef(null);
  const [animationData, setAnimationData] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const startAnimation = useCallback(() => {
    lottieRef.current?.stop();
    lottieRef.current?.goToAndPlay(0, true);
  }, []);

  if (!open || !mounted) return null;

  const serviceLabel = serviceCount === 1 ? "service" : "services";

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5 max-md:bg-black/45 md:bg-black/50 md:p-6 md:backdrop-blur-[10px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-success-title"
        className="relative w-full max-w-[24rem] overflow-hidden rounded-[1.75rem] bg-white text-center shadow-[0_20px_60px_rgba(15,23,42,0.28)] max-md:px-6 max-md:pt-7 max-md:pb-6 md:max-w-[26rem] md:rounded-[2rem] md:px-8 md:pt-8 md:pb-8 md:shadow-[0_24px_64px_rgba(15,23,42,0.32)]"
      >
        <Image
          src="/icons/dailog-bg.png"
          alt=""
          fill
          sizes="(max-width: 768px) 384px, 416px"
          className="pointer-events-none object-cover object-top"
          unoptimized
          priority
        />

        <div className="relative z-10">
          <div className="relative mx-auto flex h-[11rem] items-center justify-center md:h-[10rem]">
            {animationData ? (
              <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop
                autoplay={false}
                onDOMLoaded={startAnimation}
                rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
                className="pointer-events-none relative z-10 size-[11rem] md:size-[10rem]"
              />
            ) : loadFailed ? (
              <div className="relative z-10 flex size-28 items-center justify-center md:size-[6.5rem]">
                <img
                  src="/icons/Successfully.svg"
                  alt=""
                  className="size-full object-contain"
                  draggable={false}
                  aria-hidden
                />
              </div>
            ) : (
              <div
                className="relative z-10 size-28 animate-pulse rounded-full bg-[#E8F7EE] md:size-[6.5rem]"
                aria-hidden
              />
            )}
          </div>

          <h2
            id="booking-success-title"
            className="mt-[30px] text-[1.375rem] leading-tight font-bold text-[#111827] md:mt-1 md:text-[1.5rem]"
          >
            Booking Confirmed
          </h2>
          <p className="mt-[22px] text-[14px] leading-relaxed text-[#64748B] md:mx-auto md:mt-3 md:max-w-[15.5rem] md:text-[15px] md:leading-snug">
            <span className="md:hidden">
              {serviceCount} {serviceLabel} booked with {doctorName}. See you today at{" "}
              {scheduledTime}.
            </span>
            <span className="hidden md:inline">
              {serviceCount} {serviceLabel} booked
              <br />
              See you today at {scheduledTime}.
            </span>
          </p>
          <button
            type="button"
            onClick={onDone}
            className="mt-7 flex h-[3.25rem] w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#4B8DF8] to-[#1865EA] text-[15px] font-semibold text-white transition-opacity hover:opacity-95 md:mt-8 md:h-12 md:rounded-xl md:text-base"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
