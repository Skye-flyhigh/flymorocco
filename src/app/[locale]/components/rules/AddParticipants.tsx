"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ParticipantType } from "@/lib/validation/CaaFormdata";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

type AddParticipantsProps = {
  participantAction: (payload: {
    validParticipants: ParticipantType[];
  }) => void;
};

export default function AddParticipants({
  participantAction,
}: AddParticipantsProps) {
  const t = useTranslations("rules.form");
  const [participants, setParticipants] = useState<ParticipantType[]>([]);

  const initialValues: ParticipantType = {
    firstName: "",
    lastName: "",
    nationality: "",
    passportNumber: "",
    insuranceValidity: new Date(),
    glider: {
      gliderManufacturer: "",
      gliderModel: "",
      gliderSize: "",
      gliderColors: "",
    },
  };

  const addParticipants = () => {
    setParticipants((s) => {
      return [...s, JSON.parse(JSON.stringify(initialValues))]; // to provide a fresh copy and prevent accidental mutation
    });
  };

  useEffect(() => {
    const validParticipants: ParticipantType[] = participants.filter(
      (p) =>
        p.firstName.trim() &&
        p.lastName.trim() &&
        p.nationality.trim() &&
        p.passportNumber.trim() &&
        p.glider.gliderManufacturer.trim() &&
        p.glider.gliderModel.trim(),
    );
    if (validParticipants.length === 0) return;

    participantAction({ validParticipants });
  }, [participants, participantAction]);

  console.log("Participants from addParticipant component:", participants);

  return (
    <AnimatePresence>
      <motion.section
        id="CAA-form-section"
        className="!flex"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        layout
      >
        {participants.map((participant, i) => {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-wrap gap-4 mx-auto border-base-300 rounded-xl"
            >
              <h2 className="CAA-form-legend absolute ml-7">
                Participant #{i + 1}
              </h2>
              <fieldset id="identification" className="CAA-form-fieldset mt-10">
                <legend className="CAA-form-legend">
                  {t("identification")}
                </legend>

                {Object.entries(participant).map(([key, value]) => {
                  if (typeof value === "object" || key === "glider")
                    return null;
                  if (key === "insuranceValidity") {
                    return (
                      <div key={key}>
                        <label htmlFor={key} className="CAA-form-label">
                          {t(`${key}.label`)}
                        </label>

                        <input
                          type="date"
                          name="insuranceValidity"
                          className="input"
                          placeholder={t(`insuranceValidity.placeholder`)}
                          value={new Date(value).toISOString().split("T", 1)[0]}
                          onChange={(e) => {
                            const updated = [...participants];
                            updated[i] = {
                              ...updated[i],
                              insuranceValidity: new Date(e.target.value),
                            };
                            setParticipants(updated);
                          }}
                          required
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={key}>
                      <label htmlFor={key} className="CAA-form-label">
                        {t(`${key}.label`)}
                      </label>

                      <input
                        type="text"
                        name={key}
                        className="input"
                        placeholder={t(`${key}.placeholder`)}
                        value={value}
                        onChange={(e) => {
                          const updated = [...participants];
                          updated[i] = {
                            ...updated[i],
                            [key]: e.target.value,
                          };
                          setParticipants(updated);
                        }}
                        required
                      />
                    </div>
                  );
                })}
              </fieldset>
              <fieldset id="glider" className="CAA-form-fieldset md:mt-10">
                <legend className="CAA-form-legend">{t("glider")}</legend>
                {Object.entries(participant.glider).map(([key, value]) => {
                  return (
                    <div key={key}>
                      <label htmlFor={key} className="CAA-form-label">
                        {t(`${key}.label`)}
                      </label>
                      <input
                        type="text"
                        name={key}
                        className="input"
                        placeholder={t(`${key}.placeholder`)}
                        value={value}
                        onChange={(e) => {
                          const updated = [...participants];
                          updated[i].glider = {
                            ...updated[i].glider,
                            [key]: e.target.value,
                          };
                          setParticipants(updated);
                        }}
                        required
                      />
                    </div>
                  );
                })}
              </fieldset>
            </motion.div>
          );
        })}

        <motion.div
          id="container"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-wrap justify-evenly mb-4 mt-10 md:mx-10 mx-5 p-5 border-base-300 rounded-xl bg-base-200"
        >
          <h3
            id="CAA-form-legend"
            className="bg-base-100 md:px-10 px-3 py-4 rounded-full"
          >
            Add new participant:
          </h3>
          <div
            id="buttons"
            className="w-1/3 min-w-48 flex items-center justify-around"
          >
            <button
              type="button"
              className="bg-base-100 p-4 rounded-full"
              onClick={addParticipants}
            >
              <Plus />
            </button>
            {participants.length > 0 && (
              <button
                className="bg-base-100 p-4 rounded-full"
                type="button"
                onClick={() => {
                  setParticipants((prev) => prev.slice(0, -1));
                }}
              >
                <Minus />
              </button>
            )}
            {participants.length > 0 && (
              <button
                className="bg-base-100 p-4 rounded-full"
                type="button"
                onClick={() => {
                  setParticipants([]);
                }}
              >
                Reset
              </button>
            )}
          </div>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}
