import { extractImageDimensions } from "@/scripts/imageProcessing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const t = useTranslations("notFound");
  const imagePath = "/images/niviuk-agdou-800x600.webp";
  const { width, height } = extractImageDimensions(imagePath);

  return (
    <main className="w-screen h-fit grid sm:grid-cols-2 items-center @sm:grid-rows-2 px-5 py-6 sm:py-15">
      <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
        <h1 className="text-3xl font-bold">Error 404</h1>
        <h2 className="text-xl font-bold">{t("question")}</h2>
        <p className="text-neutral">{t("wanderer")}</p>
        <p className="text-neutral">{t("disappearance")}</p>
        <Link href="/" className="btn btn-primary">
          {t("goBack")}
        </Link>
      </div>
      <div id="img-container">
        <Image
          src={imagePath}
          width={width}
          height={height}
          alt="Lovely sunset in Aguergour"
          className="object-cover mask mask-squircle"
        />
      </div>
    </main>
  );
}
