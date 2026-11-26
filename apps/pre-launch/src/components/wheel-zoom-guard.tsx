"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function WheelZoomGuard({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const surface = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = surface.current;
    if (!element) return;

    function preventWheelZoom(event: WheelEvent) {
      if (event.ctrlKey || event.metaKey) event.preventDefault();
    }

    element.addEventListener("wheel", preventWheelZoom, { passive: false });
    return () => element.removeEventListener("wheel", preventWheelZoom);
  }, []);

  return (
    <main ref={surface} className={className}>
      {children}
    </main>
  );
}
