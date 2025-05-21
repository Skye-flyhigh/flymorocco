import { submitCaaForm } from "@/lib/submit/submitCaaForm";
import { Annex2Type } from "@/lib/validation/CaaFormdata";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import FormButton from "./FormButton";
import FormSuccess from "./FormSuccess";
import FormError from "./FormError";

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
  const initFormData = {
    formType: "annexe2",
    "identification.firstName": "",
    "identification.lastName": "",
    "contact.contactEmail": "example@provider.com",
  };

  const [currState, handleSubmit, isPending] = useActionState(submitCaaForm, {
    formData: initFormData,
    success: false,
    error: null,
  });

  return (
    <section id="annexe-2-form" className="w-screen bg-base-200 flex">
      <form
        id="CAA-form"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data: { [key: string]: string } = {};
          formData.forEach((value, key) => {
            data[key] = value.toString();
          });
          handleSubmit(data);
        }}
      >
        <h2 className="text-3xl font-semibold title m-4 self-center border-b-base-300">
          {t("annexe2.title")}
        </h2>
        <FormSuccess
          formStatus={currState.success}
          message={t("form.submitSuccess")}
        />
        <FormError formError={currState.error} />

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
        <FormButton status={isPending} />
      </form>
    </section>
  );
}
