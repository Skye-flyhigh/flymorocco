"use client";
import {
  Parallax,
  ParallaxBanner,
  ParallaxBannerLayer,
} from "react-scroll-parallax";

export default function Hero({
  title,
  subtitle,
  img,
}: {
  title: string;
  subtitle: string;
  img: string;
}) {
  return (
    <header id="hero" className="h-[80vh] w-screen hero min-h-80">
      <ParallaxBanner className="h-full w-full">
        <ParallaxBannerLayer image={img} speed={-10} />
        <Parallax
          speed={-15}
          className="hero-content h-full text-neutral-content text-center"
        >
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">{title}</h1>
            <p className="mb-5">{subtitle}</p>
          </div>
        </Parallax>
      </ParallaxBanner>
    </header>
  );
}
