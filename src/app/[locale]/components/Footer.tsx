import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <aside>
        <Image
          src="/images/FMorocco-logo-single-transparent-white.svg"
          alt="Flymorocco Logo"
          width={70}
          height={70}
          priority
        />

        <p>
          Flymorocco
          <br />© {new Date().getFullYear()} FlyMorocco. <br />
          {t("copyright")}
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Services</h6>
        <Link href="/site-guides" className="link link-hover">
          Site Guide
        </Link>
        <Link href="/rules" className="link link-hover">
          Rules
        </Link>
        <Link href="/tours" className="link link-hover">
          Tours
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <Link href="/about" className="link link-hover">
          About us
        </Link>
        <Link href="/contact" className="link link-hover">
          Contact
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <Link href="/terms" className="link link-hover">
          Terms of use
        </Link>
        <Link href="/privacy" className="link link-hover">
          Privacy policy
        </Link>
        <Link href="/cookies" className="link link-hover">
          Cookie policy
        </Link>
      </nav>
    </footer>
  );
}
