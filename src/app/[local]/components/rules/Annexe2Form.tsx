import { submitCaaForm } from "@/lib/submit/submitCaaForm";
import { Annex2Type } from "@/lib/validation/CaaFormdata";
import { BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

export default function Annexe2Form() {
  const t = useTranslations("rules");

  const initialValues: Annex2Type = {
    formType: "annexe2",
    identification: {
      firstName: "",
      lastName: "",
    },
    contact: {
      contactEmail: "example@provider.com",
    },
  };

  const [currState, handleSubmit, isPending] = useActionState(submitCaaForm, {
    formData: initialValues,
    error: null,
    success: false,
  });

  return (
    <section id="annexe-2-form" className="w-screen bg-base-200 flex">
      <form id="CAA-Form">
        <h2 className="text-3xl font-semibold title m-4 self-center border-b-base-300">
          {t("annexe2.title")}
        </h2>
        {currState.success && (
          <div role="alert" className="alert alert-success">
            <BadgeCheck />
            {t("form.submitSuccess")}
          </div>
        )}
        <section id="CAA-form-section">
          <fieldset id="identification" className="CAA-form-fieldset">
            <legend className="CAA-form-legend">
              {t("form.identification")}
            </legend>
            {(
              Object.keys(
                initialValues.identification,
              ) as (keyof typeof initialValues.identification)[]
            ).map(([field]) => (
              <div key={field}>
                <label htmlFor={field} className="CAA-form-label">
                  {t(`form.${field}.label`)}
                </label>
                <input
                  type="text"
                  name={field}
                  className="CAA-form-input"
                  placeholder={t(`form.${field}.placeholder`)}
                  defaultValue={currState.formData.identification[field] ?? ""}
                />
              </div>
            ))}
            <button
              formAction={handleSubmit}
              className="btn btn-soft btn-primary"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Generate documents"}
            </button>
          </fieldset>
          <fieldset id="contact" className="CAA-form-fieldset">
            <legend>{t("form.contact")}</legend>
            <label htmlFor="contactEmail" className="CAA-form-label">
              {" "}
              {t(`form.contactEmail.label`)}
            </label>
            <input
              type="text"
              name="contactEmail"
              className="CAA-form-input"
              placeholder={t(`form.contactEmail.placeholder`)}
              defaultValue={currState.formData.contact.contactEmail ?? ""}
            />
          </fieldset>
        </section>
      </form>
    </section>
  );
}
