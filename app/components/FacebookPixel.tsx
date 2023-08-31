"use client";
import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const FacebookPixelEvents: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        console.log({ FACEBOOKPIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOKPIXEL_ID || "1447250482703220" });
        ReactPixel.init(process.env.NEXT_PUBLIC_FACEBOOKPIXEL_ID || "1447250482703220"); //don't forget to change this
        ReactPixel.pageView();
      });
  }, [pathname, searchParams]);

  return null;
};
