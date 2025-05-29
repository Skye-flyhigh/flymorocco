"use client";

import { useActionState } from "react";
import submitMessage from "@/lib/submit/submitContactForm";
import { useTranslations } from "next-intl";
import FormSuccess from "../rules/FormSuccess";

export default function ContactForm() {
  const t = useTranslations("contact");
  const initialFormData = {
    name: "",
    email: "",
    message: "",
  };
  const [state, formAction, isPending] = useActionState(submitMessage, {
    data: initialFormData,
    errors: null,
    success: false,
  });

  return (
    <section className="py-20 px-10 h-2/3 m-auto">
      <form
        key={state.success ? "success" : "form"}
        action={formAction}
        className="flex flex-col items-center justify-center"
      >
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-md border p-4">
          <legend className="fieldset-legend text-xl">{t("form")}</legend>
          <div className="form-control">
            <label
              htmlFor="name"
              className="fieldset-label"
              aria-required="true"
            >
              {t("name.label")}
            </label>
            <input
              type="text"
              name="name"
              placeholder={t("name.placeholder")}
              className={`input ${state?.errors?.name ? "input-error" : ""}`}
              defaultValue={state?.data?.name ?? ""}
              aria-invalid={!!state?.errors?.name}
              aria-describedby="name-error"
              disabled={isPending}
              required
            />
            {state?.errors?.name && (
              <p aria-live="polite" className="text-error">
                {state.errors.name}
              </p>
            )}
            <label
              htmlFor="email"
              className="fieldset-label"
              aria-required="true"
            >
              {t("email.label")}
            </label>
            <input
              type="email"
              name="email"
              placeholder={t("email.placeholder")}
              className={`input ${state?.errors?.email ? "input-error" : ""}`}
              defaultValue={state?.data?.email ?? ""}
              aria-invalid={!!state?.errors?.email}
              aria-describedby="email-error"
              disabled={isPending}
              required
            />
            {state?.errors?.email && (
              <p aria-live="polite" className="text-error">
                {state.errors.email}
              </p>
            )}

            <label
              htmlFor="message"
              className="fieldset-label"
              aria-required="true"
            >
              {t("message.label")}
            </label>
            <textarea
              name="message"
              placeholder={t("message.placeholder")}
              className={`textarea !w-full ${state?.errors?.message ? "textarea-error" : ""}`}
              defaultValue={state?.data?.message ?? ""}
              aria-invalid={!!state?.errors?.message}
              aria-describedby="message-error"
              disabled={isPending}
              required
            />
            {state?.errors?.message && (
              <p aria-live="polite" className="text-error">
                {state.errors.message}
              </p>
            )}
          </div>
        </fieldset>
        {state?.success && (
          <FormSuccess formStatus={state.success} message={t("success")} />
        )}
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary w-fit self-center m-6"
        >
          {isPending ? "Sending..." : "Submit"}
        </button>
      </form>
    </section>
  );
}
