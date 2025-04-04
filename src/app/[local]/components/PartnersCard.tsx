import { PartnerMeta, partnerMeta } from "@/types/partnerMeta"
import { useTranslations } from "next-intl"
import Image from "next/image"

export default function PartnersCard() {
    const t = useTranslations("about")

    return (
        <article id="partner-cardholder" className="flex flex-row flex-wrap justify-center gap-5 transition-all duration-500">
            {Object.values(partnerMeta).map((partner: PartnerMeta) => (
                <div className="card bg-base-100 w-96 sm:w-[28rem] shadow-sm transition-all duration-300 ease-in-out" key={partner.slug} role="group" aria-labelledby={`${partner.slug}-title`}>
                        <figure>
                            <Image
                            src={partner.img}
                            alt={partner.name} 
                            className="object-cover aspect-square"
                            width={1200} height={600} loading="lazy" />
                        </figure>
                        <div className="card-body">
                            <h2 id={`${partner.slug}-title`} className="card-title">
                            {partner.name}
                            </h2>
                            <p>{t(`${partner.slug}.description`)}</p>
                            <div className="card-actions justify-end">
                                <a href={partner.url} target="_blank" rel="noopener">
                                    <button className="btn btn-primary">{t("meetButton") + " " + partner.name}</button>
                                </a>
                            </div>
                        </div>
                </div>
            ))}
        </article>
    )
}