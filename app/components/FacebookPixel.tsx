"use client";
import { Router } from "next/router";
import { useEffect } from "react";

export default function FacebookPixel() {
  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(process.env.FACEBOOKPIXEL_ID);
        ReactPixel.pageView();

        Router.events.on("routeChangeComplete", () => {
          ReactPixel.pageView();
        });
      });
  });
  return null;
}
