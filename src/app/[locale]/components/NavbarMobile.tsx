"use client";
import { Contact, House, MapPinned, Scale, TreePalm } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NavbarMobile() {
  const t = useTranslations("nav");
  const [hidden, setHidden] = useState<boolean>(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setHidden(currentScroll > lastScrollY.current && currentScroll > 10);
      lastScrollY.current = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed bottom-2 w-5/6 z-[1000] inset-x-0 mx-auto rounded-full glass shadow-md flex justify-around items-center p-2 md:hidden transition-transform duration-300 ${hidden && "translate-y-full !bottom-0"}`}
    >
      <Link
        href="/"
        className="flex flex-col items-center text-sm transition-colors hover:text-primary"
      >
        <House />
        <span>{t("home")}</span>
      </Link>
      <Link
        href="/site-guides"
        className="flex flex-col items-center text-sm transition-colors hover:text-primary"
      >
        <MapPinned />
        <span>{t("siteGuides")}</span>
      </Link>
      <Link
        href="/rules"
        className="flex flex-col items-center text-sm transition-colors hover:text-primary"
      >
        <Scale />
        <span>{t("rules")}</span>
      </Link>
      <Link
        href="/tours"
        className="flex flex-col items-center text-sm transition-colors hover:text-primary"
      >
        <TreePalm />
        <span>{t("tours")}</span>
      </Link>
      <Link
        href="/about"
        className="flex flex-col items-center text-sm transition-colors hover:text-primary"
      >
        <Contact />
        <span>{t("about")}</span>
      </Link>
    </nav>
  );
}
