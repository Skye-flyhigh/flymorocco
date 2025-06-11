"use client";

import { BookingFormState, submitBooking } from "@/lib/submit/submitBookingForm";
import { TourSchedule } from "@/lib/validation/tourScheduleData";
import { formatDate } from "date-fns";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import FormSuccess from "../rules/FormSuccess";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

export default function BookingForm(tour: TourSchedule) {
  const t = useTranslations('booking');
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
    }
  }, [displayForm]);

  //Form logic start
  const initData = {
    name: '',
    email: '',
    start: tour.start
  }
  const initialState: BookingFormState = {
    data: initData,
    errors: null,
    success: false
  }

  const [state, formAction, isPending] = useActionState(submitBooking, initialState)

  if (tour.slug) {
    return (
      <Link
        href={tour.slug}
        rel="no-opener"
        target="_blank"
        className="btn btn-primary"
      >
        Visit website
      </Link>
    );
  } else {
    return (
      <>
        <button
          className="btn btn-primary"
          onClick={() => setDisplayForm(!displayForm)}
          disabled={isAvailable}
        >
          {displayForm ? "Close form" : "Book now"}
        </button>
        <dialog ref={dialogRef} className="modal" onClose={onClose}>
          <form action={formAction} key={state.success ? "success": "form"} className="modal-box ">
            <div className="container w-3/4 mx-auto">
              <h3 className="text-xl font-bold">
                Booking form for {tour.type} tour
              </h3>
              <p>Tour dates: {formatDate(tour.start, tour.end)}</p>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Contact details</legend>
                <label htmlFor="name" className="fieldset-label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="booking-name"
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
                <label htmlFor="email" className="fieldset-label">
                  Email address
                </label>
                <input type="email" id="email" 
                              className={`input ${state?.errors?.email ? "input-error" : ""}`}
              defaultValue={state?.data?.email ?? ""}
              aria-invalid={!!state?.errors?.email}
              aria-describedby="email-error"
              disabled={isPending}

                required />
                            {state?.errors?.name && (
              <p aria-live="polite" className="text-error">
                {state.errors.name}
              </p>
            )}
  </fieldset>
          {state?.success && (
            <FormSuccess formStatus={state.success} message={t("success")} />
          )}
  
            </div>
            <div className="btn-container w-full flex justify-center">

              <button type="submit" className="btn btn-primary m-2">{isPending ? 'Processing...' : 'Submit'}</button>
            </div>
            <div className="exit-container absolute top-1 right-1 rounded-full btn btn-ghost" onClick={() => dialogRef.current?.close()}>
              <X />
            </div>
          </form>
        </dialog>
      </>
    );
  }
}
