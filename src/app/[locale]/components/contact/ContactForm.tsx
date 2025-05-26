"use client";

import { useActionState } from "react";
import FormButton from "../rules/FormButton";
import submitMessage from "@/lib/submit/submitContactForm";

export default function ContactForm() {
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
    <section className="py-20 px-10 h-screen">
      <form key={state.success ? "success" : "form"} action={formAction}>
        <fieldset>
          <legend className="legend">Enter your details and message</legend>
          <div className="form-control">
            <label htmlFor="name" className="label" aria-required="true">
              Your name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
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
            <label htmlFor="email" className="label" aria-required="true">
              Your email
            </label>
            <input
              type="email"
              name="email"
              placeholder="address@provider.com"
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

            <label htmlFor="message" className="label" aria-required="true">
              Your message
            </label>
            <textarea
              name="message"
              placeholder="Your message, enquiries, etc."
              className={`input ${state?.errors?.message ? "textarea-error" : ""}`}
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
          <p aria-live="polite" className="text-success">
            Form submitted successfully
          </p>
        )}
        <FormButton status={isPending} />
      </form>
    </section>
  );
}
