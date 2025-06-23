"use client";
import { Contact, House, MapPinned, Scale, TreePalm } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function NavbarMobile() {
  const t = useTranslations("nav");
  const path = usePathname();
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

  const strippedPathname =
    path === "/en" ? "/" : path.replace(/^\/(en|fr)/, "");
  const isActive = (href: string) => strippedPathname === href;
  console.log("Mobile nav pathname check:", strippedPathname);

  return (
    <nav
      role="navigation"
      aria-label="Mobile navigation"
      className={`fixed bottom-2 w-5/6 z-[1000] inset-x-0 mx-auto rounded-full glass shadow-md flex justify-around items-center p-2 md:hidden transition-transform duration-300 ${hidden && "translate-y-full !bottom-0"}`}
    >
      <h2 className="sr-only">Main navigation</h2>
      <Link
        href="/"
        aria-current={isActive("/") ? "page" : undefined}
        className={`flex flex-col items-center text-sm transition-all hover:text-secondary w-24 p-2 rounded-full ${isActive("/") && "text-secondary-content font-semibold backdrop-brightness-150 shadow-2xs"}`}
      >
        <House />
        <span>{t("home")}</span>
      </Link>
      <Link
        href="/site-guides"
        aria-current={isActive("/site-guides") ? "page" : undefined}
        className={`flex flex-col items-center text-sm transition-all hover:text-secondary w-24 p-2 rounded-full ${isActive("/site-guides") && "text-secondary-content font-semibold backdrop-brightness-150 shadow-2xs"}`}
      >
        <MapPinned />
        <span>{t("siteGuides")}</span>
      </Link>
      <Link
        href="/rules"
        aria-current={isActive("/rules") ? "page" : undefined}
        className={`flex flex-col items-center text-sm transition-all hover:text-secondary w-24 p-2 rounded-full ${isActive("/rules") && "text-secondary-content font-semibold backdrop-brightness-150 shadow-2xs"}`}
      >
        <Scale />
        <span>{t("rules")}</span>
      </Link>
      <Link
        href="/tours"
        aria-current={isActive("/tours") ? "page" : undefined}
        className={`flex flex-col items-center text-sm transition-all hover:text-secondary w-24 p-2 rounded-full ${isActive("/tours") && "text-secondary-content font-semibold backdrop-brightness-150 shadow-2xs"}`}
      >
        <TreePalm />
        <span>{t("tours")}</span>
      </Link>
      <Link
        href="/about"
        aria-current={isActive("/about") ? "page" : undefined}
        className={`flex flex-col items-center text-sm transition-all hover:text-secondary w-24 p-2 rounded-full ${isActive("/about") && "text-secondary-content font-semibold backdrop-brightness-150 shadow-2xs"}`}
      >
        <Contact />
        <span>{t("about")}</span>
      </Link>
    </nav>
  );
}
