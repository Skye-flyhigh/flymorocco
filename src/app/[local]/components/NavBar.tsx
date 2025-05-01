import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Navbar() {
  const t = useTranslations("nav");
  return (
    <div className="fixed top-0 left-0 w-full z-[1000] glass shadow-md flex items-center">
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
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link className="link link-hover" href="/site-guides">
              {t("siteGuides")}
            </Link>
          </li>
          <li>
            <Link className="link link-hover" href="/rules">
              {t("rules")}
            </Link>
          </li>
          <li>
            <Link className="link link-hover" href="/tours">
              {t("tours")}
            </Link>
          </li>
          <li>
            <Link className="link link-hover" href="/about">
              {t("about")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
