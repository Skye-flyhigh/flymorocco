"use client";

import {
  FormDataSchema,
  ParticipantSchema,
} from "@/lib/validation/CaaFormdata";
import { submitCaaForm } from "@/lib/submit/submitCaaForm";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "use-intl";
import SiteSelector from "./SiteSelector";
import { BadgeCheck, CircleX } from "lucide-react";
import AddParticipants from "./AddParticipants";

//Form
export default function CaaForm() {
  const t = useTranslations("caaForm");

  const { pending } = useFormStatus();
  const [siteSelection, setSiteSelection] = useState<string[]>([]);
  const [participantData, setParticipantData] = useState<
    (typeof ParticipantSchema)[]
  >([]);
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({});

  const initialValues = {
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
    participantData,
  };

  const result = FormDataSchema.safeParse(initialValues);
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

  const { startDate, endDate } = currState.formData?.trip; //FIXME: this is not defined, we will have to have onChange

  //Validate date entry
  useEffect(() => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setInputErrors((prev) => ({
        ...prev,
        endDate: t("dateError"),
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

  //Global form styling for uniformity
  const sectionStyle =
    "flex flex-wrap items-start @md:flex-col bg-base-100 border-base-300 border mb-4";
  const fieldsetStyle =
    "m-auto min-w-96 fieldset mb-8 p-7 w-xs bg-base-200 border border-base-300";
  const fieldsetLegend = "fieldset-legend text-xl";
  const fieldsetLabel = "fieldset-label";
  const inputClassName = "input mb-4";
  const inputErrorStyling = (field: string) =>
    `${inputClassName} ${inputErrors[field] ? "input-error" : ""}`;

  return (
    <section id="CAAform" className="w-screen bg-amber-200 flex">
      <form className="flex flex-col min-w-11/12 bg-background p-5 m-6 rounded-box text-lg">
        <h2 className="text-3xl font-semibold title m-4 self-center border-b-base-300">
          {t("title")}
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
            {t("submitSuccess")}
          </div>
        )}
        <h3 className="text-2xl p-5 m-6 fieldset-legend">
          {t("generalInformation")}
        </h3>
        <section className={sectionStyle}>
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
                className={fieldsetStyle}
              >
                <legend className={fieldsetLegend}>
                  {t(`${fieldsetKey}`)}
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
                      <label htmlFor={fieldKey} className={fieldsetLabel}>
                        {t(`${fieldKey}.label`)}
                      </label>
                      {fieldKey === "address" ? (
                        <textarea
                          name={fieldKey}
                          className={inputErrorStyling(fieldKey)}
                          placeholder={t(`${fieldKey}.placeholder`)}
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
                          placeholder={t(`${fieldKey}.placeholder`)}
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
          participantAction={(payload: {
            participantData: (typeof ParticipantSchema)[];
          }) => setParticipantData(payload.participantData)}
          sectionStyle={sectionStyle}
          fieldsetStyle={fieldsetStyle}
          fieldsetLabel={fieldsetLabel}
          fieldsetLegend={fieldsetLegend}
        />

        <h3 className="text-2xl p-5 m-6 fieldset-legend">
          {t("siteSelector")}
        </h3>

        <SiteSelector
          selectionAction={(payload: { selectedZones: string[] }) =>
            setSiteSelection(payload.selectedZones)
          }
          sectionStyle={sectionStyle}
          fieldsetStyle={fieldsetStyle}
          fieldsetLabel={fieldsetLabel}
          fieldsetLegend={fieldsetLegend}
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
