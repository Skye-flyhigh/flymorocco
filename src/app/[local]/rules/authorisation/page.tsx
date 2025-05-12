"use client";

import Link from "next/link";
import { useState } from "react";
import Annexe2Form from "../../components/rules/Annexe2Form";
import Annexe2and4Form from "../../components/rules/Annexe2and4Form";

export default function Page() {
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedMoroccanLaw, setAgreedMoroccanLaw] = useState(false);
  const [annex4, setAnnex4] = useState(false);

  if (!agreedPrivacy || !agreedMoroccanLaw) {
    return (
      <main className="mt-10">
        <section className="flex flex-col space-y-4 max-w-xl m-auto p-6">
          <article>
            By signing the Annex 2, you are agreeing to the following Moroccan
            legal requirements:
            <ol>
              <li>
                Send to the Moroccan{" "}
                <abbr title="Civil Aviation Authority">CAA</abbr> the documents
                regarding the aircraft
              </li>
              <li>
                Remain in the geographical coordinates as described in the
                Moroccan{" "}
                <Link href="/rules/airspaces" target="_blank">
                  airspaces page
                </Link>
              </li>
              <li>
                Comply to <abbr title="Visual Flight Rules">VRF</abbr> as
                described in Moroccan regulations
              </li>
              <li>
                Comply to the limitations regarding flight and landing areas as
                defined by the{" "}
              </li>
              <li>
                Obtain prior approval from the relevant local authorities (civil
                and military) for ground coordination and conducting flights
                outside of aerodromes
              </li>
              <li>
                Coordinate flight execution with the commanders of the concerned
                airports
              </li>
              <li>
                Coordinate the start and end of the activity with the
                aerodrome’s air navigation services or, where applicable, with
                the relevant local authorities
              </li>
              <li>
                Ensure that all participants are informed of aeronautical
                information (NOTAMs)
              </li>
              <li>
                Ensure that an emergency beacon (406 MHz) is carried on board
                the aircraft
              </li>
              <li>
                Ensure that briefings and debriefings are conducted for each
                flight
              </li>
              <li>
                Ensure that communication devices are present on board the
                aircraft
              </li>
            </ol>
          </article>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              onChange={(e) => setAgreedPrivacy(e.target.checked)}
            />
            <span>
              I have read and understood the{" "}
              <Link href="/privacy" className="link">
                FlyMorocco Privacy Notice
              </Link>
              .
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              onChange={(e) => setAgreedMoroccanLaw(e.target.checked)}
            />
            <span>
              I acknowledge and agree to the{" "}
              <Link href="/rules/authorisation" className="link">
                Moroccan flying legal requirements
              </Link>
              .
            </span>
          </label>
        </section>
      </main>
    );
  } else {
    return (
      <main className="mt-15">
        <section id="form-selector">
          <div className="dropdown dropdown-bottom dropdown-center">
            <div tabIndex={0} role="button" className="btn m-1">
              Select required documents
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li onClick={() => setAnnex4(false)}>
                <a>Annex 2</a>
              </li>
              <li onClick={() => setAnnex4(true)}>
                <a>Annex 2 and 4</a>
              </li>
            </ul>
          </div>
        </section>

        {annex4 ? <Annexe2and4Form /> : <Annexe2Form />}
      </main>
    );
  }
}
