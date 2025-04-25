"use client";

import React from "react";
import { ParallaxProvider } from "react-scroll-parallax";

export default function ParallaxClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ParallaxProvider>{children}</ParallaxProvider>;
}
