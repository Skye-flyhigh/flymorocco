"use client";

import { useState } from "react";
import Annexe2and4Form from "../../components/rules/Annexe2and4Form";

export default function Page() {
  const [annexe2, setAnnexe2] = useState<boolean>(false);
  const [annexe4, setAnnexe4] = useState<boolean>(false);

  return (
    <main>
      <Annexe2and4Form />
    </main>
  );
}
