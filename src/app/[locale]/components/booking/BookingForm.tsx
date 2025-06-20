"use client";

import {
  BookingFormState,
  submitBooking,
} from "@/lib/submit/submitBookingForm";
import { TourSchedule } from "@/lib/validation/tourScheduleData";
import { formatDate } from "date-fns";
import { useActionState, useEffect, useRef, useState } from "react";
import FormSuccess from "../rules/FormSuccess";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

export default function BookingForm(tour: TourSchedule) {
  const t = useTranslations("contact");
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  const status: string = tour.status.toLowerCase();
  useEffect(() => {
    setIsAvailable(status !== "available");
  }, [status]);

  const onClose = () => setDisplayForm(false);

  useEffect(() => {
    if (displayForm) {
      dialogRef.current?.showModal();
      dialogRef.current?.focus();
    }
  }, [displayForm]);

  //Form logic start
  const initData = {
    name: "",
    email: "",
    start: tour.start,
  };
  const initialState: BookingFormState = {
    data: initData,
    errors: null,
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    submitBooking,
    initialState,
  );

  if (tour.slug) {
    return (
      <a
        href={tour.slug}
        rel="no-opener"
        target="_blank"
        className="btn btn-primary"
      >
        {t("website")}
      </a>
    );
  } else {
    return (
      <>
        <button
          className="btn btn-primary"
          onClick={() => setDisplayForm(!displayForm)}
          disabled={isAvailable}
        >
          {displayForm ? t("close") : t("book")}
        </button>
        <dialog
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          ref={dialogRef}
          className="modal"
          onClose={onClose}
        >
          <form
            action={formAction}
            key={state.success ? "success" : "form"}
            className="modal-box "
          >
            <div className="container w-3/4 mx-auto">
              <h3 id="dialog-title" className="text-xl font-bold">
                {t("bookingForm.title")}{" "}
                <span className="first-letter:capitalize">{tour.type}</span>
              </h3>
              <p>
                {t("dates")} {formatDate(tour.start, tour.end)}
              </p>
              <p className="font-extralight">{t("bookingForm.subtitle")}</p>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">{t("contact")}</legend>
                <label htmlFor="booking-name" className="fieldset-label">
                  {t("name.label")}
                </label>
                <input
                  type="text"
                  name="name"
                  id="booking-name"
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
                <label htmlFor="booking-email" className="fieldset-label">
                  {t("email.label")}
                </label>
                <input
                  type="email"
                  id="booking-email"
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
                  <p id="email-error" aria-live="polite" className="text-error">
                    {state.errors.email}
                  </p>
                )}
                <input type="hidden" name="start" value={tour.start} />
              </fieldset>
              {state?.success && (
                <FormSuccess
                  formStatus={state.success}
                  message={t("success")}
                />
              )}
            </div>
            <div className="btn-container w-full flex justify-center">
              <button type="submit" className="btn btn-primary m-2">
                {isPending ? t("process") : t("submit")}
              </button>
            </div>
            <button
              type="button"
              className="exit-container absolute top-1 right-1 rounded-full btn btn-ghost"
              onClick={() => dialogRef.current?.close()}
              aria-label={t("close")}
            >
              <X />
            </button>
          </form>
        </dialog>
      </>
    );
  }
}
