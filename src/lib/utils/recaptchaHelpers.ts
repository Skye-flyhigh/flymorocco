import { RefObject } from "react";

/**
 * Adds reCAPTCHA token to form and submits it
 * Reusable utility to avoid code duplication across forms
 */
export function addTokenAndSubmit(
  token: string,
  formRef: RefObject<HTMLFormElement | null>,
  customSubmitHandler?: (formData: FormData) => void,
) {
  const form = formRef.current;
  if (!form) return;

  // Remove any existing reCAPTCHA token to prevent duplicates
  const existingToken = form.querySelector('input[name="recaptcha-token"]');
  if (existingToken) {
    existingToken.remove();
  }

  // Add new token
  const tokenInput = document.createElement("input");
  tokenInput.type = "hidden";
  tokenInput.name = "recaptcha-token";
  tokenInput.value = token;
  form.appendChild(tokenInput);

  if (customSubmitHandler) {
    // Custom submission logic (for forms that need FormData processing)
    const formData = new FormData(form);
    customSubmitHandler(formData);
  } else {
    // Standard form submission (works with useActionState)
    form.requestSubmit();
  }
}

/**
 * Standard reCAPTCHA configuration for useActionState forms
 */
export function createRecaptchaConfig(
  action: string,
  formRef: RefObject<HTMLFormElement | null>,
) {
  return {
    sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
    onVerify: (token: string) => {
      addTokenAndSubmit(token, formRef);
    },
    action,
  };
}

/**
 * reCAPTCHA configuration for forms with custom submit handlers
 */
export function createCustomRecaptchaConfig(
  action: string,
  formRef: RefObject<HTMLFormElement | null>,
  customSubmitHandler: (formData: FormData) => void,
) {
  return {
    sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
    onVerify: (token: string) => {
      addTokenAndSubmit(token, formRef, customSubmitHandler);
    },
    action,
  };
}
