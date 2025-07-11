"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function NavbarDesktop() {
  const t = useTranslations("nav");

  return (
    <header>
      <nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 md:top-0 md:bottom-auto w-full z-[1000] glass shadow-md flex items-center"
      >
        <div className="navbar-start ml-4">
          <Link href="/" className="btn btn-ghost text-xl my-auto">
            <Image
              src="/images/FMorocco-logo-single-transparent-color.svg"
              alt="Flymorocco Logo"
              width={30}
              height={30}
              priority
            ></Image>
          </Link>
        </div>
        <div className="flex-none sm:navbar-end">
          <ul className="menu menu-horizontal px-1" role="menubar">
            <li role="none">
              <Link
                className="link link-hover"
                href="/site-guides"
                role="menuitem"
              >
                {t("siteGuides")}
              </Link>
            </li>
            <li role="none">
              <Link className="link link-hover" href="/rules" role="menuitem">
                {t("rules")}
              </Link>
            </li>
            <li role="none">
              <Link className="link link-hover" href="/tours" role="menuitem">
                {t("tours")}
              </Link>
            </li>
            <li role="none">
              <Link className="link link-hover" href="/about" role="menuitem">
                {t("about")}
              </Link>
            </li>
            <li role="none">
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
