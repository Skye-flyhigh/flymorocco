import { submitCaaForm } from "@/lib/submit/submitCaaForm";
import { Annex2Type } from "@/lib/validation/CaaFormdata";
import { BadgeCheck, CircleX } from "lucide-react";
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
    success: false,
  });

  return (
    <section id="annexe-2-form" className="w-screen bg-base-200 flex">
      <form id="CAA-form" action={handleSubmit}>
        <h2 className="text-3xl font-semibold title m-4 self-center border-b-base-300">
          {t("annexe2.title")}
        </h2>
        {currState.success && (
          <div
            role="alert"
            className="alert alert-success  self-center m-5 w-fit"
          >
            <BadgeCheck />
            {t("form.submitSuccess")}
          </div>
        )}
        {currState.error && (
          <div role="alert" className="alert alert-error">
            <CircleX />
            {currState.error}
          </div>
        )}
        <section id="CAA-form-section">
          <input type="hidden" name="formType" value="annexe2" />
          <fieldset id="identification" className="CAA-form-fieldset">
            <legend className="CAA-form-legend">
              {t("form.identification")}
            </legend>
            {(
              Object.keys(
                initialValues.identification,
              ) as (keyof typeof initialValues.identification)[]
            ).map((field) => (
              <div key={field}>
                <label htmlFor={field} className="CAA-form-label">
                  {t(`form.${field}.label`)}
                </label>
                <input
                  type="text"
                  name={`identification.${field}`}
                  className="input"
                  placeholder={t(`form.${field}.placeholder`)}
                  defaultValue={currState.formData[field] ?? ""}
                  required
                />
              </div>
            ))}
          </fieldset>
          <fieldset id="contact" className="CAA-form-fieldset">
            <legend className="CAA-form-legend">{t("form.contact")}</legend>
            <label htmlFor="contactEmail" className="CAA-form-label">
              {" "}
              {t(`form.contactEmail.label`)}
            </label>
            <input
              type="text"
              name="contact.contactEmail"
              className="input"
              placeholder={t(`form.contactEmail.placeholder`)}
              defaultValue={currState.formData.contactEmail ?? ""}
              required
            />
          </fieldset>
        </section>
        <button
          type="submit"
          className="btn btn-primary w-fit self-center"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Generate documents"}
        </button>
      </form>
    </section>
  );
}
