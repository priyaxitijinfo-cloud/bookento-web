"use client";

import { useCallback, useRef } from "react";

export function useLongPress({
  onLongPress,
  onClick,
  delay = 450,
  moveThreshold = 12,
} = {}) {
  const timerRef = useRef(null);
  const longPressTriggeredRef = useRef(false);
  const pointerIdRef = useRef(null);
  const startPointRef = useRef({ x: 0, y: 0 });

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(
    (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      longPressTriggeredRef.current = false;
      pointerIdRef.current = event.pointerId;
      startPointRef.current = { x: event.clientX, y: event.clientY };
      event.currentTarget.setPointerCapture?.(event.pointerId);
      clear();

      const target = event.currentTarget;
      timerRef.current = setTimeout(() => {
        longPressTriggeredRef.current = true;
        if (
          typeof navigator !== "undefined" &&
          typeof navigator.vibrate === "function"
        ) {
          navigator.vibrate(12);
        }
        onLongPress?.({ currentTarget: target });
      }, delay);
    },
    [clear, delay, onLongPress],
  );

  const move = useCallback(
    (event) => {
      if (!timerRef.current) return;
      const dx = event.clientX - startPointRef.current.x;
      const dy = event.clientY - startPointRef.current.y;
      if (dx * dx + dy * dy > moveThreshold * moveThreshold) {
        clear();
      }
    },
    [clear, moveThreshold],
  );

  const end = useCallback(
    (event) => {
      const wasLongPress = longPressTriggeredRef.current;
      clear();
      if (event.currentTarget.hasPointerCapture?.(pointerIdRef.current)) {
        event.currentTarget.releasePointerCapture?.(pointerIdRef.current);
      }
      pointerIdRef.current = null;
      if (!wasLongPress) {
        onClick?.(event);
      }
    },
    [clear, onClick],
  );

  const cancel = useCallback(
    (event) => {
      clear();
      longPressTriggeredRef.current = false;
      if (event?.currentTarget?.hasPointerCapture?.(pointerIdRef.current)) {
        event.currentTarget.releasePointerCapture?.(pointerIdRef.current);
      }
      pointerIdRef.current = null;
    },
    [clear],
  );

  return {
    onPointerDown: start,
    onPointerMove: move,
    onPointerUp: end,
    onPointerCancel: cancel,
    onContextMenu: (event) => {
      event.preventDefault();
    },
  };
}
