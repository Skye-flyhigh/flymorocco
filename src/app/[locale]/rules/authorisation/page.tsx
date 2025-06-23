import { buildPageMetadata } from "@/lib/metadata/buildPageMetadata";
import AnnexeClientWrapper from "../../components/rules/AnnexeClientWrap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, page: "caaForms" });
}

export default function Page() {
  return <AnnexeClientWrapper />;
}
