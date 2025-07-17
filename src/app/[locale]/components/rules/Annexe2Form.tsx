import { submitCaaForm } from "@/lib/submit/submitCaaForm";
import { Annex2Type } from "@/lib/validation/CaaFormdata";
import { useTranslations } from "next-intl";
import { useActionState, useRef } from "react";
import FormButton from "./FormButton";
import FormSuccess from "./FormSuccess";
import FormError from "./FormError";
import { useRecaptcha } from "@/hooks/useRecaptcha";

export default function Annexe2Form() {
  const t = useTranslations("rules");
  const formRef = useRef<HTMLFormElement>(null);

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

  const { executeRecaptcha } = useRecaptcha({
    sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
    onVerify: (token) => {
      console.log("Annexe2 reCAPTCHA token received:", token);
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
        console.log("Submitting Annexe2 form with token");
        handleSubmit(data);
      }
    },
    action: "annexe2_form",
  });

  return (
    <section id="annexe-2-form" className="w-screen bg-base-200 flex">
      <form
        ref={formRef}
        id="CAA-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await executeRecaptcha();
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
