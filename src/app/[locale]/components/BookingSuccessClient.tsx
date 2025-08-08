"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface BookingDetails {
  sessionId: string;
  customerEmail: string;
  amountPaid: number;
  tourStart: string;
  participantCount: number;
}

export default function BookingSuccessClient() {
  const t = useTranslations("booking");
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // In a production app, you'd fetch booking details from your API
      // For now, we'll just show the session ID
      setBookingDetails({
        sessionId,
        customerEmail: '',
        amountPaid: 0,
        tourStart: '',
        participantCount: 0,
      });
    }
    
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!bookingDetails?.sessionId) {
    return (
      <div className="alert alert-warning mt-4">
        <div>
          <h4 className="font-semibold">{t("success.noSession.title")}</h4>
          <p>{t("success.noSession.message")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="alert alert-info">
        <div>
          <h4 className="font-semibold">{t("success.reference.title")}</h4>
          <p className="text-xs font-mono break-all">{bookingDetails.sessionId}</p>
          <p className="text-sm mt-1">{t("success.reference.save")}</p>
        </div>
      </div>
    </div>
  );
}