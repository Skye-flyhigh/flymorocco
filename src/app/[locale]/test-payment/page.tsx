"use client";
import { useState } from "react";
import { testBookingSaveAction } from "./testBookingSaveAction";

export default function TestPaymentPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestBookingSave = async () => {
    setIsLoading(true);

    try {
      const result = await testBookingSaveAction();

      if (result.success) {
        alert(`Success! Saved ${result.rowsAdded} rows to Google Sheets. Booking ref: ${result.bookingRef}`);
      } else {
        alert("Booking save failed: " + result.error);
      }
    } catch (error) {
      console.error("Booking save error:", error);
      alert("Booking save failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Google Sheets Test</h1>
        <p className="mb-4 text-gray-600">
          Test Google Sheets integration without payment
        </p>

        <div className="bg-green-100 p-4 rounded mb-4">
          <p className="text-sm">
            <strong>Test Details:</strong>
            <br />
            Customer: Test Customer
            <br />
            Email: test@flymorocco.info
            <br />
            Tour: Coastal (Test)
            <br />
            Participants: 2 (1 pilot, 1 passenger)
            <br />
            <strong>No payment required!</strong>
          </p>
        </div>

        <button
          onClick={handleTestBookingSave}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? "Testing Google Sheets..." : "Test Google Sheets Save"}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          This will test Google Sheets integration with mock booking data - no charges!
        </p>
      </div>
    </div>
  );
}
