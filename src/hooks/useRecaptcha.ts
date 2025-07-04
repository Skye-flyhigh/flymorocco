import { useEffect, useRef } from "react";

interface UseRecaptchaProps {
  sitekey: string;
  onVerify: (token: string) => void;
  action?: string;
}

interface RecaptchaWindow extends Window {
  grecaptcha?: {
    ready: (callback: () => void) => void;
    execute: (sitekey: string, options: { action: string }) => Promise<string>;
    render: (
      element: string | HTMLElement,
      parameters: Record<string, unknown>,
    ) => number;
  };
}

declare const window: RecaptchaWindow;

export const useRecaptcha = ({
  sitekey,
  onVerify,
  action = "submit",
}: UseRecaptchaProps) => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Load reCAPTCHA script only once
    if (!scriptLoaded.current) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      scriptLoaded.current = true;
    }
  }, []);

  const executeRecaptcha = async (): Promise<void> => {
    if (!window.grecaptcha) {
      console.error("reCAPTCHA not loaded");
      return;
    }

    try {
      window.grecaptcha.ready(async () => {
        const token = await window.grecaptcha!.execute(sitekey, { action });
        onVerify(token);
      });
    } catch (error) {
      console.error("reCAPTCHA execution failed:", error);
    }
  };

  return { executeRecaptcha };
};
