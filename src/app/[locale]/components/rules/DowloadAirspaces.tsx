import { useTranslations } from "next-intl";

export default function DownloadAirspaces() {
  const t = useTranslations("rules.download");

  const openairFiles = [
    {
      title: "Morocco-OpenAir-FL190",
      description:
        "Airspaces in OpenAir format representing airspaces starting below FL190.",
      format: "txt",
      size: 31,
      lastUpdate: "2023-03-09",
    },
    {
      title: "Morocco-OpenAir",
      description: "Airspaces in OpenAir format, all airspaces.",
      format: "txt",
      size: 62,
      lastUpdate: "2023-03-09",
    },
  ];

  return (
    <section
      id="download"
      className="w-screen min-h-3/4 px-5 pb-20 flex flex-col justify-between items-center"
    >
      <div
        id="content"
        className="max-w-11/12 w-fit flex flex-col justify-center items-center"
      >
        <div id="original-content" className="m-5 ">
          <h4 className="text-2xl bold">{t("sia")}</h4>
          <p>{t("vfrMaps")}</p>
          <a
            href="http://siamaroc.onda.ma/cartes_vfr.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary m-5 mx-auto"
          >
            SIA Maroc
          </a>
        </div>
        <div id="openair" className="m-5 w-fit">
          <h4 className="text-2xl bold">{t("openair.title")}</h4>
          <p>{t("openair.subtitle")}</p>
        </div>
      </div>
      <table className="divide-y divide-base-300 mt-6 text-sm">
        <thead className="bg-base-200 text-left font-semibold">
          <tr>
            <th className="px-4 py-3">{t("openair.name")}</th>
            <th className="px-4 py-3">{t("openair.description")}</th>
            <th className="px-4 py-3 sm:visible hidden">
              {t("openair.format")}
            </th>
            <th className="px-4 py-3 sm:visible hidden">{t("openair.size")}</th>
            <th className="px-4 py-3 sm:visible hidden">
              {t("openair.update")}
            </th>
            <th className="px-4 py-3">{t("openair.link")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {openairFiles.map((file, i) => (
            <tr key={i} className="hover:bg-base-100">
              <td className="px-4 py-2 font-medium text-primary-content">
                {file.title}
              </td>
              <td className="px-4 py-2">{file.description}</td>
              <td className="px-4 py-2 sm:visible hidden uppercase">
                {file.format}
              </td>
              <td className="px-4 py-2 sm:visible hidden">{file.size} KB</td>
              <td className="px-4 py-2 sm:visible hidden">{file.lastUpdate}</td>
              <td className="px-4 py-2">
                <a
                  href={`/downloads/${file.title}.${file.format || "txt"}`}
                  className="text-accent link link-secondary hover:underline"
                  download
                >
                  {t("openair.download")}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
