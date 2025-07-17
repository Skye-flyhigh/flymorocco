"use client";

import { useActionState, useRef } from "react";
import submitMessage from "@/lib/submit/submitContactForm";
import { useTranslations } from "next-intl";
import FormSuccess from "../rules/FormSuccess";
import { useRecaptcha } from "@/hooks/useRecaptcha";

export default function ContactForm() {
  const t = useTranslations("contact");
  const formRef = useRef<HTMLFormElement>(null);

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

  const { executeRecaptcha } = useRecaptcha({
    sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
    onVerify: (token) => {
      console.log("reCAPTCHA token received:", token);
      // Add token to form and submit
      const form = formRef.current;
      if (form) {
        const tokenInput = document.createElement("input");
        tokenInput.type = "hidden";
        tokenInput.name = "recaptcha-token";
        tokenInput.value = token;
        form.appendChild(tokenInput);
        console.log("Submitting form with token");
        form.requestSubmit();
      }
    },
    action: "contact_form",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if reCAPTCHA token already exists to prevent infinite loop
    const form = e.target as HTMLFormElement;
    const existingToken = form.querySelector('input[name="recaptcha-token"]');
    if (existingToken) {
      console.log("Token already exists, allowing form submission");
      return; // Let the form submit naturally
    }
    
    console.log("Form submit started");
    await executeRecaptcha();
    console.log("reCAPTCHA execution completed");
  };

  return (
    <section className="py-20 px-10 h-2/3 m-auto">
      <form
        ref={formRef}
        key={state.success ? "success" : "form"}
        action={formAction}
        onSubmit={handleSubmit}
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
              id="name"
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
              <p id="name-error" aria-live="polite" className="text-error">
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
              id="email"
              placeholder={t("email.placeholder")}
              className={`input ${state?.errors?.email ? "input-error" : ""}`}
              defaultValue={state?.data?.email ?? ""}
              aria-invalid={!!state?.errors?.email}
              aria-describedby="email-error"
              disabled={isPending}
              required
            />
            {state?.errors?.email && (
              <p id="email-error" aria-live="polite" className="text-error">
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
              id="message"
              placeholder={t("message.placeholder")}
              className={`textarea !w-full ${state?.errors?.message ? "textarea-error" : ""}`}
              defaultValue={state?.data?.message ?? ""}
              aria-invalid={!!state?.errors?.message}
              aria-describedby="message-error"
              disabled={isPending}
              required
            />
            {state?.errors?.message && (
              <p id="message-error" aria-live="polite" className="text-error">
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
          {isPending ? t("process") : t("submit")}
        </button>
      </form>
    </section>
  );
}
