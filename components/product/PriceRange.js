"use client";

import { useEffect, useRef, useState } from "react";

export default function PriceRange({
  min = 0,
  max,
  value = [min, max],
  onChange,
  step = 1000,
  debounce = 500,
}) {
  const [range, setRange] = useState(value);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => setRange(value), [value]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const update = (clientX, thumb) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || max <= min) return;

    const percent = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const raw = min + percent * (max - min);
    const nextValue = Math.round(raw / step) * step;

    setRange((prev) => {
      const next = [...prev];

      if (thumb === 0) {
        next[0] = Math.min(nextValue, prev[1] - step);
      } else {
        next[1] = Math.max(nextValue, prev[0] + step);
      }

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(next), debounce);

      return next;
    });
  };

  const startDrag = (thumb, e) => {
    e.preventDefault();

    const move = (event) => update(event.clientX, thumb);

    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };

  const minPercent = ((range[0] - min) / (max - min)) * 100;
  const maxPercent = ((range[1] - min) / (max - min)) * 100;

  const formatPrice = (price) =>
    `${price.toLocaleString("fa-IR")} تومان`;

  return (
    <div className="w-full min-w-0 select-none" dir="ltr">
      <div
        ref={trackRef}
        className="relative mx-2 h-6 touch-none"
        onPointerDown={(e) => {
          if (e.target !== trackRef.current) return;

          const rect = trackRef.current.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          const position = min + percent * (max - min);

          const thumb =
            Math.abs(position - range[0]) <= Math.abs(position - range[1])
              ? 0
              : 1;

          startDrag(thumb, e);
        }}
      >
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-muted" />

        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-coffee-600"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        <button
          type="button"
          aria-label="حداقل قیمت"
          onPointerDown={(e) => startDrag(0, e)}
          className="absolute top-1/2 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-coffee-600 shadow-md cursor-grab active:cursor-grabbing touch-none"
          style={{ left: `${minPercent}%` }}
        />

        <button
          type="button"
          aria-label="حداکثر قیمت"
          onPointerDown={(e) => startDrag(1, e)}
          className="absolute top-1/2 z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-coffee-600 shadow-md cursor-grab active:cursor-grabbing touch-none"
          style={{ left: `${maxPercent}%` }}
        />
      </div>

      <div
        className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground"
        dir="rtl"
      >
        <div className="min-w-0 truncate text-right">
          {formatPrice(range[1])}
        </div>

        <div className="min-w-0 truncate text-left">
          {formatPrice(range[0])}
        </div>
      </div>
    </div>
  );
}