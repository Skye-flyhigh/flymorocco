"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ParticipantType } from "@/lib/validation/CaaFormdata";
import { useTranslations } from "next-intl";

type AddParticipantsProps = {
  participantAction: (payload: { participants: ParticipantType[] }) => void;
};

export default function AddParticipants({
  participantAction,
} : AddParticipantsProps)  {
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
      return [...s, initialValues];
    });
  };

  useEffect(() => {
    participantAction({ participants })
  }, [participants, participantAction])

  return (
    <section id="CAA-form-section">
      {participants.map((participant, i) => {
        return (
          <fieldset key={i} className="CAA-form-fieldset">
            {Object.entries(participant).map(([key, value]) => {
              if (typeof value === "object" || key === "glider") return null;
              return (
                <div key={key}>
                  <label htmlFor={key} className="CAA-form-label">
                    {t(`${key}.label`)}
                  </label>

                  <input
                    type={key === "insuranceValidity" ? "date" : "text"}
                    name={key}
                    className="input"
                    placeholder={t(`${key}.placeholder`)}
                    defaultValue={
                      key === "insuranceValidity"
                        ? new Date(participant[key as keyof ParticipantType])
                            .toISOString()
                            .split("T")[0]
                        : (participant[
                            key as keyof ParticipantType
                          ]?.toString() ?? "")
                    }
                    required
                  />
                </div>
              );
            })}
          </fieldset>
        );
      })}

      <h3>Add new participant:</h3>
      <button onClick={addParticipants}>
        <Plus />
      </button>
      <button
        onClick={() => {
          setParticipants((prev) => prev.slice(0, -1));
        }}
      >
        <Minus />
      </button>

      <button
        onClick={() => {
          setParticipants([]);
        }}
      >
        Reset
      </button>
    </section>
  );
}
