"use client";

import {
  FullFormSchema,
  FullFormSchemaType,
  ParticipantType,
} from "@/lib/validation/CaaFormdata";
import { submitCaaForm } from "@/lib/submit/submitCaaForm";
import {
  useActionState,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { useTranslations } from "use-intl";
import SiteSelector from "./SiteSelector";
import { CircleX } from "lucide-react";
import AddParticipants from "./AddParticipants";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";
import FormButton from "./FormButton";
import { useRecaptcha } from "@/hooks/useRecaptcha";

export default function Annexe2and4Form() {
  const t = useTranslations("rules");
  const formRef = useRef<HTMLFormElement>(null);

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
    participants,
  };

  const result = FullFormSchema.safeParse(initialValues);
  if (!result.success) {
    console.error(
      "🚨 Form initialValues do not match schema:",
      result.error.format(),
    );
  }

  const initFormData = {
    formType: "annexe2and4",
    "identification.firstName": "",
    "identification.lastName": "",
    "identification.nationality": "",
    "identification.passportNumber": "",
    "contact.contactEmail": "example@provider.com",
    "contact.contactPhone": "1234567890",
    "contact.address": "",
    "trip.insuranceValidity": new Date().toDateString(),
    "trip.startDate": new Date().toDateString(),
    "trip.endDate": new Date().toDateString(),
    "glider.gliderManufacturer": "",
    "glider.gliderModel": "",
    "glider.gliderSize": "",
    "glider.gliderColors": "",
    participants: "",
    siteSelection: "",
  };

  const [currState, handleSubmit, isPending] = useActionState(submitCaaForm, {
    formData: initFormData,
    error: null,
    success: false,
  });

  const { executeRecaptcha } = useRecaptcha({
    sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
    onVerify: (token) => {
      console.log("Annexe2and4 reCAPTCHA token received:", token);
      const form = formRef.current;
      if (form) {
        const tokenInput = document.createElement("input");
        tokenInput.type = "hidden";
        tokenInput.name = "recaptcha-token";
        tokenInput.value = token;
        form.appendChild(tokenInput);

        const formData = new FormData(form);
        const data: { [key: string]: string } = {};
        formData.forEach((value, key) => {
          data[key] = value.toString();
        });
        console.log("Submitting Annexe2and4 form with token");
        handleSubmit(data);
      }
    },
    action: "annexe2and4_form",
  });

  const handleParticipantsUpdate = useCallback(
    (payload: { validParticipants: ParticipantType[] }) => {
      setParticipants(payload.validParticipants);
    },
    [],
  );

  const handleSiteSelectionUpdate = useCallback(
    (payload: { selectedZones: string[] }) => {
      setSiteSelection(payload.selectedZones);
    },
    [],
  );

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
      <form
        ref={formRef}
        id="CAA-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await executeRecaptcha();
        }}
      >
        <h2 className="text-3xl font-semibold title m-4 self-center border-b-base-300">
          {t("annexe2and4.title")}
        </h2>
        <input type="hidden" name="formType" value="annexe2and4" />

        <FormSuccess
          formStatus={currState.success}
          message={t("form.submitSuccess")}
        />
        <FormError formError={currState.error} />

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
                          name={`${fieldsetKey}.${fieldKey}`}
                          className={inputErrorStyling(fieldKey)}
                          placeholder={t(`form.${fieldKey}.placeholder`)}
                          defaultValue={currState.formData[fieldKey]}
                          aria-describedby={`${fieldKey}-error`}
                          required
                        />
                      ) : (
                        <input
                          type={type}
                          name={`${fieldsetKey}.${fieldKey}`}
                          className={inputErrorStyling(fieldKey)}
                          placeholder={t(`form.${fieldKey}.placeholder`)}
                          defaultValue={
                            fieldKey === "insuranceValidity" ||
                            fieldKey === "startDate" ||
                            fieldKey === "endDate"
                              ? currState.formData[fieldKey]
                              : currState.formData[fieldKey]
                          }
                          aria-invalid={inputErrors[fieldKey] !== ""}
                          aria-describedby={`${fieldKey}-error`}
                          required
                        />
                      )}
                      {inputErrors[fieldKey] && (
                        <p
                          className="alert alert-error"
                          aria-live="polite"
                          id={`${fieldKey}-error`}
                        >
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
        <input
          type="hidden"
          name="participants"
          defaultValue={JSON.stringify(participants)}
        />
        <AddParticipants participantAction={handleParticipantsUpdate} />

        <h3 className="text-2xl p-5 m-6 fieldset-legend">
          {t("form.siteSelector")}
        </h3>

        <input
          type="hidden"
          name="siteSelection"
          defaultValue={JSON.stringify(siteSelection)}
        />
        <SiteSelector selectionAction={handleSiteSelectionUpdate} />

        {/* Submit Button */}
        <FormButton status={isPending} />
      </form>
    </section>
  );
}
