"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

export default function TopLoader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest("a");

      if (
        link &&
        link.href &&
        link.origin === window.location.origin &&
        !link.target &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        NProgress.start();
      }
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}