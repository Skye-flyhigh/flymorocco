"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { ParticipantSchema } from "@/lib/validation/CaaFormdata";

export default function AddParticipants(
  participantAction,
  sectionStyle,
  fieldsetStyle,
  fieldsetLabel,
  fieldsetLegend,
): {
  participantAction: (payload: {
    participantData: typeof ParticipantSchema;
  }) => void;
  sectionStyle: string;
  fieldsetStyle: string;
  fieldsetLabel: string;
  fieldsetLegend: string;
} {
  const [nbParticipants, setNbParticipants] = useState<number>(0);
  const [participantData, setParticipantData] = useState<
    (typeof ParticipantSchema)[]
  >([]);

  return (
    <section className={sectionStyle}>
      <button onClick={() => setNbParticipants(nbParticipants + 1)}>
        <h3>Add new participant:</h3>
        <Plus />
      </button>
    </section>
  );
}
