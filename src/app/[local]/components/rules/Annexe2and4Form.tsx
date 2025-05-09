"use client";

import {
  FormData,
  FormDataMapSchema,
  ParticipantSchema,
  ParticipantType,
} from "@/lib/validation/CaaFormdata";
import { submitCaaForm } from "@/lib/submit/submitCaaForm";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "use-intl";
import SiteSelector from "./SiteSelector";
import { BadgeCheck, CircleX } from "lucide-react";
import AddParticipants from "./AddParticipants";

//Form
export default function Annexe2and4Form() {
  const t = useTranslations("rules");

  const { pending } = useFormStatus();
  const [siteSelection, setSiteSelection] = useState<string[]>([]);
  const [participants, setParticipants] = useState<
    (typeof ParticipantSchema)[]
  >([]);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  const initialValues: FormData = {
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
    participants,
  };

  const result = FormDataMapSchema.safeParse(initialValues);
  if (!result.success) {
    console.error(
      "🚨 Form initialValues do not match schema:",
      result.error.format(),
    );
  }

  const [currState, handleSubmit] = useActionState(submitCaaForm, {
    formData: initialValues,
    error: null,
    success: false,
  });

  const { startDate, endDate } = currState.formData?.trip;

  //Validate date entry
  useEffect(() => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const inputClassName = "input mb-4";
  const inputErrorStyling = (field: string) =>
    `${inputClassName} ${inputErrors[field] ? "input-error" : ""}`;

  return (
    <section id="annexe-2-and-4-form" className="w-screen bg-base-200 flex">
      <form id="CAA-form">
        <h2 className="text-3xl font-semibold title m-4 self-center border-b-base-300">
          {t("annexe2and4.title")}
        </h2>

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
                <legend className="CAA-form-legemd">
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
                          defaultValue={
                            currState.formData?.[fieldsetKey]?.[fieldKey] ?? ""
                          }
                          required
                        />
                      ) : (
                        <input
                          type={type}
                          name={fieldKey}
                          className={inputErrorStyling(fieldKey)}
                          placeholder={t(`form.${fieldKey}.placeholder`)}
                          defaultValue={
                            currState.formData?.[fieldsetKey]?.[fieldKey] ?? ""
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

        <AddParticipants
          participantAction={(payload: { participants: ParticipantType[] }) =>
            setParticipants(payload.participants)
          }
        />

        <h3 className="text-2xl p-5 m-6 fieldset-legend">
          {t("form.siteSelector")}
        </h3>

        <SiteSelector
          selectionAction={(payload: { selectedZones: string[] }) =>
            setSiteSelection(payload.selectedZones)
          }
        />

        {/* Submit Button */}
        <button
          formAction={handleSubmit}
          className="btn btn-soft btn-primary"
          disabled={pending}
        >
          {pending ? "Submitting..." : "Generate documents"}
        </button>
      </form>
    </section>
  );
}
