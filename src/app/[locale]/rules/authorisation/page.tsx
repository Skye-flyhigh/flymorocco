import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import { Metadata } from "next";
import AnnexeClientWrapper from "../../components/rules/AnnexeClientWrap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, page: "caaForms" });
}

export default function Page() {
  return <AnnexeClientWrapper />;
}
