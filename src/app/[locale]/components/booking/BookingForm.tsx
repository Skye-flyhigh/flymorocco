"use client";

import {
  BookingFormState,
  submitBooking,
} from "@/lib/submit/submitBookingForm";
import { TourSchedule } from "@/lib/validation/tourScheduleData";
import { ParticipantData } from "@/lib/validation/BookFormData";
import { formatDate } from "date-fns";
import React, { useActionState, useEffect, useRef, useState } from "react";
import FormSuccess from "../rules/FormSuccess";
import { useTranslations } from "next-intl";
import { X, Plus, Minus } from "lucide-react";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { createRecaptchaConfig } from "@/lib/utils/recaptchaHelpers";
import {
  getTourPricing,
  getCurrencyInfo,
  getAvailableCurrencies,
  calculateBookingTotal,
  type Currency,
} from "@/lib/utils/pricing";
import { TourSlug } from "@/lib/types/tour";

export default function BookingForm(tour: TourSchedule) {
  const t = useTranslations("contact");
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  // Participant management state
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [participants, setParticipants] = useState<ParticipantData[]>([
    { name: "", isPilot: false, soloOccupancy: false },
  ]);

  // Main booker state for pricing calculation
  const [mainBookerSolo, setMainBookerSolo] = useState<boolean>(false);

  // Currency selection state
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("EUR");

  // Calculate total pricing using centralized pricing data
  const calculateTotal = () => {
    const totalPeople = participantCount + 1; // +1 for the main contact
    const soloCount =
      participants.filter((p) => p.soloOccupancy).length +
      (mainBookerSolo ? 1 : 0);

    const booking = calculateBookingTotal(
      tour.type as TourSlug,
      selectedCurrency,
      totalPeople,
      soloCount,
    );

    return {
      ...booking,
      soloCount,
      symbol: booking.currencyInfo.symbol,
    };
  };

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

  // Handle participant count changes
  const updateParticipantCount = (newCount: number) => {
    if (newCount < 0 || newCount > 20) return;

    setParticipantCount(newCount);

    // Adjust participants array
    const newParticipants = [...participants];
    if (newCount > participants.length) {
      // Add new empty participants
      for (let i = participants.length; i < newCount; i++) {
        newParticipants.push({
          name: "",
          isPilot: false,
          soloOccupancy: false,
        });
      }
    } else if (newCount < participants.length) {
      // Remove excess participants
      newParticipants.splice(newCount);
    }

    setParticipants(newParticipants);
  };

  // Update specific participant
  const updateParticipant = (
    index: number,
    updates: Partial<ParticipantData>,
  ) => {
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], ...updates };
    setParticipants(newParticipants);
  };

  //Form logic start
  const initData = {
    name: "",
    email: "",
    isPilot: false,
    soloOccupancy: false,
    start: tour.start,
    tourType: tour.type as TourSlug,
    participantCount: 0,
    participants: [{ name: "", isPilot: false, soloOccupancy: false }],
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

  const { executeRecaptcha } = useRecaptcha(
    createRecaptchaConfig("booking_form", formRef),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    // Check if reCAPTCHA token already exists to prevent infinite loop
    const form = e.target as HTMLFormElement;
    const existingToken = form.querySelector('input[name="recaptcha-token"]');
    if (existingToken) {
      // Let normal form submission proceed to server action
      return;
    }

    e.preventDefault();
    await executeRecaptcha();
  };

  // FIXME: Handle redirect to Stripe checkout when server action returns checkout URL
  React.useEffect(() => {
    if (state.checkoutUrl) {
      window.location.href = state.checkoutUrl;
    }
  }, [state.checkoutUrl]);

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
    // TODO: add a tour logic checking the availability of the tour so it can disable the button (isAvailable boolean!)
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
            ref={formRef}
            action={formAction}
            onSubmit={handleSubmit}
            key={state.success ? "success" : "form"}
            className="modal-box max-w-4xl"
          >
            <div className="container w-full mx-auto">
              <h3 id="dialog-title" className="text-xl font-bold mb-4">
                {t("bookingForm.title")}{" "}
                <span className="first-letter:capitalize">{tour.type}</span>
              </h3>
              <p className="mb-2">
                {t("dates")} {formatDate(tour.start, tour.end)}
              </p>
              <p className="font-extralight mb-6">
                {t("bookingForm.subtitle")}
              </p>

              {/* Currency Selection */}
              <div className="mb-6 p-4 bg-base-100 rounded-lg border border-base-300">
                <label className="block text-sm font-medium mb-3">
                  Choose your preferred currency:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <select
                    name="currency"
                    id="currency"
                    disabled={isPending}
                    value={selectedCurrency}
                    onChange={(e) =>
                      setSelectedCurrency(e.target.value as Currency)
                    }
                    className="bg-base-200 p-2 rounded-md transition-all hover:border-primary border-2 border-base-100"
                  >
                    {getAvailableCurrencies().map((currencyCode) => {
                      const currencyInfo = getCurrencyInfo(currencyCode);
                      return (
                        <option value={currencyCode} key={currencyCode}>
                          {currencyInfo.symbol} {currencyCode}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Quick price preview */}
                <div className="mt-3 text-sm text-base-content/70">
                  {(() => {
                    const pricing = getTourPricing(
                      tour.type as TourSlug,
                      selectedCurrency,
                    );
                    const currencyInfo = getCurrencyInfo(selectedCurrency);

                    return (
                      <span>
                        {tour.type} tour: {currencyInfo.symbol}
                        {pricing.base} per person
                        {pricing.solo > 0 &&
                          ` • Solo room: +${currencyInfo.symbol}${pricing.solo}`}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Main Contact Section */}
              <fieldset className="fieldset mb-6">
                <legend className="fieldset-legend text-lg font-semibold mb-4">
                  Main Contact
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="booking-name" className="fieldset-label">
                      {t("name.label")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="booking-name"
                      placeholder={t("name.placeholder")}
                      className={`input w-full ${state?.errors?.name ? "input-error" : ""}`}
                      defaultValue={state?.data?.name ?? ""}
                      aria-invalid={!!state?.errors?.name}
                      aria-describedby="name-error"
                      disabled={isPending}
                      required
                    />
                    {state?.errors?.name && (
                      <p
                        id="name-error"
                        aria-live="polite"
                        className="text-error text-sm mt-1"
                      >
                        {state.errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="booking-email" className="fieldset-label">
                      {t("email.label")}
                    </label>
                    <input
                      type="email"
                      id="booking-email"
                      name="email"
                      placeholder={t("email.placeholder")}
                      className={`input w-full ${state?.errors?.email ? "input-error" : ""}`}
                      defaultValue={state?.data?.email ?? ""}
                      aria-invalid={!!state?.errors?.email}
                      aria-describedby="email-error"
                      disabled={isPending}
                      required
                    />
                    {state?.errors?.email && (
                      <p
                        id="email-error"
                        aria-live="polite"
                        className="text-error text-sm mt-1"
                      >
                        {state.errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-6 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isPilot"
                      value="true"
                      className="checkbox"
                      disabled={isPending}
                    />
                    <abbr title="We need to request further information to obtain the pilot's flight authorisation.">
                      <span>Are you a pilot?</span>
                    </abbr>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="soloOccupancy"
                      value="true"
                      checked={mainBookerSolo}
                      onChange={(e) => setMainBookerSolo(e.target.checked)}
                      className="checkbox"
                      disabled={isPending}
                    />
                    <abbr title="Solo occupancy means you will have your own room.">
                      <span>
                        Solo room (+{calculateTotal().symbol}
                        {calculateTotal().soloPrice})
                      </span>
                    </abbr>
                  </label>
                </div>
              </fieldset>

              {/* Participants Section */}
              <fieldset className="fieldset mb-6">
                <legend className="fieldset-legend text-lg font-semibold mb-4">
                  Participants
                </legend>

                {/* Participant count selector */}
                <div className="flex items-center gap-4 mb-4">
                  <label className="font-medium">Number of participants:</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateParticipantCount(participantCount - 1)
                      }
                      disabled={participantCount < 1 || isPending}
                      className="btn btn-sm btn-circle btn-outline"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      name="participantCount"
                      value={participantCount}
                      onChange={(e) =>
                        updateParticipantCount(parseInt(e.target.value))
                      }
                      min="0"
                      max="20"
                      className="input input-sm w-20 text-center"
                      disabled={isPending}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateParticipantCount(participantCount + 1)
                      }
                      disabled={participantCount >= 20 || isPending}
                      className="btn btn-sm btn-circle btn-outline"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Participant forms */}
                {participantCount > 0 && (
                  <div className="space-y-4">
                    {participants.map((participant, index) => (
                      <div
                        key={index}
                        className="border border-base-300 rounded-lg p-4"
                      >
                        <h4 className="font-medium mb-3">
                          Participant {index + 1}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="fieldset-label">Name</label>
                            <input
                              type="text"
                              name={`participant_${index}_name`}
                              value={participant.name}
                              onChange={(e) =>
                                updateParticipant(index, {
                                  name: e.target.value,
                                })
                              }
                              placeholder="Participant name"
                              className="input w-full"
                              disabled={isPending}
                              required
                            />
                          </div>

                          {participant.isPilot && (
                            <div>
                              <label className="fieldset-label">
                                Pilot Email
                              </label>
                              <input
                                type="email"
                                name={`participant_${index}_email`}
                                value={participant.email || ""}
                                onChange={(e) =>
                                  updateParticipant(index, {
                                    email: e.target.value,
                                  })
                                }
                                placeholder="Pilot's email for license verification"
                                className="input w-full"
                                disabled={isPending}
                                required
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex gap-6">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name={`participant_${index}_isPilot`}
                              value="true"
                              checked={participant.isPilot}
                              onChange={(e) =>
                                updateParticipant(index, {
                                  isPilot: e.target.checked,
                                  email: e.target.checked
                                    ? participant.email
                                    : undefined,
                                })
                              }
                              className="checkbox"
                              disabled={isPending}
                            />
                            <span>Pilot</span>
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name={`participant_${index}_soloOccupancy`}
                              value="true"
                              checked={participant.soloOccupancy}
                              onChange={(e) =>
                                updateParticipant(index, {
                                  soloOccupancy: e.target.checked,
                                })
                              }
                              className="checkbox"
                              disabled={isPending}
                            />
                            <span>
                              Solo room (+{calculateTotal().symbol}
                              {calculateTotal().soloPrice})
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </fieldset>

              {/* Pricing Summary */}
              <div className="bg-base-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                {(() => {
                  const pricing = calculateTotal();
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>
                          {participantCount + 1} participant
                          {participantCount > 0 ? "s" : ""} × {pricing.symbol}
                          {pricing.basePrice}
                        </span>
                        <span>
                          {pricing.symbol}
                          {pricing.baseTotal.toLocaleString()}
                        </span>
                      </div>

                      {pricing.soloCount > 0 && (
                        <div className="flex justify-between">
                          <span>
                            {pricing.soloCount} solo room
                            {pricing.soloCount > 1 ? "s" : ""} ×{" "}
                            {pricing.symbol}
                            {pricing.soloPrice}
                          </span>
                          <span>
                            {pricing.symbol}
                            {pricing.soloTotal.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <hr className="border-base-300" />

                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>
                          {pricing.symbol}
                          {pricing.grandTotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-sm text-base-content/70 flex justify-between">
                        <span>Currency</span>
                        <span>
                          {pricing.currency} - {pricing.currencyInfo.name}
                        </span>
                      </div>

                      <p className="text-sm text-base-content/70 mt-2">
                        Price includes 1 week guided tour with
                        transportation,accommodation and meals.
                      </p>
                    </div>
                  );
                })()}
              </div>

              <input type="hidden" name="start" value={tour.start} />
              <input type="hidden" name="currency" value={selectedCurrency} />
              <input type="hidden" name="tourType" value={tour.type || ""} />

              {state?.success && (
                <FormSuccess
                  formStatus={state.success}
                  message={t("success")}
                />
              )}

              {state?.errors && Object.keys(state.errors).length > 0 && (
                <div className="alert alert-error mb-4">
                  <div>
                    <h4 className="font-semibold">
                      Please fix the following errors:
                    </h4>
                    <ul className="list-disc list-inside">
                      {Object.entries(state.errors).map(([field, errors]) => (
                        <li key={field}>
                          {Array.isArray(errors) ? errors[0] : errors}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="btn-container w-full flex justify-center mt-6">
              <button type="submit" className="btn btn-primary btn-lg">
                {isPending ? t("process") : "Book Now"}
              </button>
            </div>

            <button
              type="button"
              className="exit-container absolute top-4 right-4 rounded-full btn btn-ghost btn-sm"
              onClick={() => dialogRef.current?.close()}
              aria-label={t("close")}
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </dialog>
      </>
    );
  }
}
