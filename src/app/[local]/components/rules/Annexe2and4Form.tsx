"use client";

import {
  FullFormSchema,
  FullFormSchemaType,
  ParticipantType,
} from "@/lib/validation/CaaFormdata";
import { submitCaaForm } from "@/lib/submit/submitCaaForm";
import { useActionState, useCallback, useEffect, useState } from "react";
import { useTranslations } from "use-intl";
import SiteSelector from "./SiteSelector";
import { BadgeCheck, CircleX } from "lucide-react";
import AddParticipants from "./AddParticipants";

export default function Annexe2and4Form() {
  const t = useTranslations("rules");

  const [siteSelection, setSiteSelection] = useState<string[]>([]);
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  const initialValues: FullFormSchemaType = {
    formType: "annexe2and4",
    identification: {
      firstName: "",
      lastName: "",
      nationality: "",
      passportNumber: "",
    },
    contact: {
      contactEmail: "test@example.com",
      contactPhone: 1234567890,
      address: "",
    },
    trip: {
      insuranceValidity: new Date(),
      startDate: new Date(),
      endDate: new Date(),
    },
    glider: {
      gliderManufacturer: "",
      gliderModel: "",
      gliderSize: "",
      gliderColors: "",
    },
    siteSelection,
    participants: participants.length > 0 ? participants : undefined,
  };

  const result = FullFormSchema.safeParse(initialValues);
  if (!result.success) {
    console.error(
      "🚨 Form initialValues do not match schema:",
      result.error.format(),
    );
  }

  const [currState, handleSubmit, isPending] = useActionState(submitCaaForm, {
    formData: initialValues,
    error: null,
    success: false,
  });

  const handleParticipantsUpdate = useCallback(
    (payload: { validParticipants: ParticipantType[] }) => {
      setParticipants(payload.validParticipants);
    },
    [], //FIXME: Participants steal the show
  );

  const handleSiteSelectionUpdate = useCallback(
    (payload: { selectedZones: string[] }) => {
    setSiteSelection(payload.selectedZones);
    }, [])

  //Date validation FIXME: it breaks the app!
  const startDate = currState.formData["startDate"];
  const endDate = currState.formData["endDate"];
  const insuranceValidity = currState.formData["insuranceValidity"];
  useEffect(() => {
    if (
      startDate &&
      endDate &&
      insuranceValidity &&
      (new Date(insuranceValidity) < new Date(endDate) ||
        new Date(endDate) < new Date(startDate))
    ) {
      setInputErrors((prev) => ({
        ...prev,
        endDate: t("form.dateError"),
      }));
    } else {
      setInputErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.endDate;
        return newErrors;
      });
    }
  }, [t, startDate, endDate, insuranceValidity]);

  const inputClassName = "input mb-4";
  const inputErrorStyling = (field: string) =>
    `${inputClassName} ${inputErrors[field] ? "input-error" : ""}`;

  return (
    <section id="annexe-2-and-4-form" className="w-screen bg-base-200 flex">
      <form id="CAA-form" action={handleSubmit}>
        <h2 className="text-3xl font-semibold title m-4 self-center border-b-base-300">
          {t("annexe2and4.title")}
        </h2>
        <input type="hidden" name="formType" value="annexe2and4" />

        {/* Display Error Message */}
        {currState.error && (
          <div role="alert" className="alert alert-error">
            <CircleX />
            {currState.error}
          </div>
        )}

        {/* Display Success Message */}
        {currState.success && (
          <div role="alert" className="alert alert-success">
            <BadgeCheck />
            {t("form.submitSuccess")}
          </div>
        )}
        <h3 className="text-2xl p-5 m-6 fieldset-legend">
          {t("form.generalInformation")}
        </h3>
        <section id="CAA-form-section">
          {Object.entries(initialValues).map(([fieldsetKey, fields]) => {
            if (
              typeof fields !== "object" ||
              Array.isArray(fields) ||
              fieldsetKey === "siteSelection" ||
              fieldsetKey === "participantData"
            )
              return null;

            return (
              <fieldset
                key={fieldsetKey}
                id={fieldsetKey}
                className="CAA-form-fieldset"
              >
                <legend className="CAA-form-legend">
                  {t(`form.${fieldsetKey}`)}
                </legend>

                {Object.entries(fields).map(([fieldKey]) => {
                  let type;
                  switch (fieldKey) {
                    case "contactPhone":
                      type = "phone";
                      break;
                    case "contactEmail":
                      type = "email";
                      break;
                    case "insuranceValidity":
                    case "startDate":
                    case "endDate":
                      type = "date";
                      break;
                    default:
                      type = "text";
                  }

                  return (
                    <div key={fieldKey}>
                      <label htmlFor={fieldKey} className="CAA-form-label">
                        {t(`form.${fieldKey}.label`)}
                      </label>
                      {fieldKey === "address" ? (
                        <textarea
                          name={fieldKey}
                          className={inputErrorStyling(fieldKey)}
                          placeholder={t(`form.${fieldKey}.placeholder`)}
                          defaultValue={currState.formData[fieldKey]}
                          required
                        />
                      ) : (
                        <input
                          type={type}
                          name={fieldKey}
                          className={inputErrorStyling(fieldKey)}
                          placeholder={t(`form.${fieldKey}.placeholder`)}
                          defaultValue={
                            fieldKey === "insuranceValidity" ||
                            fieldKey === "startDate" ||
                            fieldKey === "endDate"
                              ? new Date(
                                  currState.formData[fieldKey]
                                )
                                  .toISOString()
                                  .split("T")[0]
                              : currState.formData[fieldKey]
                          }
                          required
                        />
                      )}
                      {inputErrors[fieldKey] && (
                        <p className="alert alert-error">
                          <CircleX />
                          {inputErrors[fieldKey]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </fieldset>
            );
          })}
        </section>
        <input type="hidden" name="participants" value={JSON.stringify(participants)} />
        <AddParticipants participantAction={handleParticipantsUpdate} />

        <h3 className="text-2xl p-5 m-6 fieldset-legend">
          {t("form.siteSelector")}
        </h3>

        <input type="hidden" name="siteSelection" value={JSON.stringify(siteSelection)} />
        <SiteSelector
          selectionAction={handleSiteSelectionUpdate}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-soft btn-primary"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Generate documents"}
        </button>
      </form>
    </section>
  );
}
