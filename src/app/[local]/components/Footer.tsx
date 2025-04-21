import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="footer footer-center p-4 bg-base-200 text-base-content">
      <aside>
        <p>
          © {new Date().getFullYear()} FlyMorocco. {t("copyright")}
        </p>
      </aside>
    </footer>
  );
}
