"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { ParticipantType } from "@/lib/validation/CaaFormdata";

export default function AddParticipants(participantAction): {
  participantAction: (payload: { participantData: ParticipantType }) => void;
} {
  const [nbParticipants, setNbParticipants] = useState<number>(0);
  const [participantData, setParticipantData] = useState<ParticipantType[]>([]);

  return (
    <section id="CAA-form-section">
      <button onClick={() => setNbParticipants(nbParticipants + 1)}>
        <h3>Add new participant:</h3>
        <Plus />
      </button>
    </section>
  );
}
