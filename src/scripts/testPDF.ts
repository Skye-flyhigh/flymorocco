import generateAnnexe2 from "@/lib/pdf/generateAnnexe2";
import generateAnnexe4 from "@/lib/pdf/generateAnnexe4";
import generateCaaPDF from "@/lib/pdf/generateCaaPDF";

(async () => {
  const dummyData = {
    identification: {
      firstName: "Jean-Pierre Léonardo Antoine",
      lastName: "de la Vega-Martinez del Castillo",
      nationality: "Française",
      passportNumber: "FR1234567",
      address:
        "123 Rue de la Liberté, Quartier des Oiseaux, 75000 Paris, France",
    },
    contact: {
      contactEmail: "jean.dupont@email.com",
      contactPhone: 33612345678,
      address:
        "123 Rue de la Liberté, Quartier des Oiseaux, 75000 Paris, France",
    },
    trip: {
      insuranceValidity: new Date("2025-12-31"),
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-10"),
    },
    glider: {
      gliderManufacturer: "Ozone",
      gliderModel: "Rush 6 Pro XC",
      gliderSize: "ML",
      gliderColors: "Red, White and Blue",
    },
    siteSelection: [
      "Aguergour (Z1)",
      "Tizi N'test (Z18)",
      "Aït Ourir (Z2)",
      "Ouirgane Amizmiz (Z20)",
      "Aglou (Z5)",
      "Les Rochers Bleus (Z12)",
    ],
    participants: Array.from({ length: 10 }, (_, i) => ({
      firstName: `José María Alejandro${i}`,
      lastName: `Fernandez López de la Cruz y Montoya${i}`,
      nationality: "Espagnole",
      passportNumber: `ESP00${i}12345`,
      insuranceValidity: new Date("2025-12-31"),
      glider: {
        gliderManufacturer: `SkyTech${i}`,
        gliderModel: `Thunder Hawk ${i}`,
        gliderSize: i % 2 === 0 ? "M" : "L",
        gliderColors: "Crimson, Sunset Orange, Sky Blue",
      },
    })),
  };

  await generateAnnexe4(dummyData);
})();
