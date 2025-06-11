import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function TourService() {
  const t = useTranslations("tours.tourService");
  return (
    <section
      id="tour-service"
      className="flex flex-col lg:flex-row items-center justify-center py-20 px-10"
    >
      <div
        id="content-container"
        className="flex flex-col w-full max-w-xl mb-10 lg:mb-0 mr-0 lg:mr-10"
      >
        <h1 className="section-title">{t("title")}</h1>
        <p>{t("participants")}</p>
        <div className="join join-vertical bg-base-100">
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title font-semibold">
              {t("accommodation.title")}
            </div>
            <div className="collapse-content text-sm">
              {t("accommodation.description")}
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title font-semibold">
              {t("guides.title")}
            </div>
            <div className="collapse-content text-sm">
              {t("guides.description")}
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title font-semibold">
              {t("transportation.title")}
            </div>
            <div className="collapse-content text-sm">
              {t("transportation.description")}
            </div>
          </div>

          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title font-semibold">
              {t("airport.title")}
            </div>
            <div className="collapse-content text-sm">
              {t("airport.description")}
            </div>
          </div>
        </div>
        <h3 className="text-sm font-semibold mb-2 mt-2">
          {t("tourExclusions.title")}
        </h3>
        <ul className="list-disc list-inside text-base-content/80 text-xs">
          <li>{t("tourExclusions.item1")}</li>
          <li>{t("tourExclusions.item2")}</li>
          <li>{t("tourExclusions.item3")}</li>
          <li>{t("tourExclusions.item4")}</li>
          <li>{t("tourExclusions.item5")}</li>
        </ul>
        <p className="text-xs text-base-content/60 mt-3">
          {t("tourExclusions.terms")}
          <Link href="/terms" className="link link-primary">
            {t("tourExclusions.termsLink")}
          </Link>
          .
        </p>
        <Link
          href="#tour-calendar"
          className="btn btn-primary m-5 w-fit self-center"
        >
          {t("viewSchedule")}
        </Link>
      </div>
      <Image
        height={1500}
        width={1497}
        src="/images/niviuk-aguergour-square.jpeg"
        alt="Tour Service"
        className="aspect-square lg:max-w-xl mask mask-squircle overflow-x-hidden"
        loading="lazy"
      />
    </section>
  );
}
