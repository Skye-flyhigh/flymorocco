'use client'
import { useState } from 'react';
import { testPaymentAction } from './testPaymentAction';

export default function TestPaymentPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTestPayment = async () => {
    setIsLoading(true);
    
    try {
      const result = await testPaymentAction();
      
      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        alert('Test payment failed: ' + result.error);
      }
    } catch (error) {
      console.error('Test payment error:', error);
      alert('Test payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Payment System Test</h1>
        <p className="mb-4 text-gray-600">
          Test the webhook and email system with a £1 payment
        </p>
        
        <div className="bg-yellow-100 p-4 rounded mb-4">
          <p className="text-sm">
            <strong>Test Details:</strong><br/>
            Customer: Test Customer<br/>
            Email: test@flymorocco.info<br/>
            Amount: £1.00<br/>
            Tour: Coastal (Test)
          </p>
        </div>

        <button
          onClick={handleTestPayment}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating test payment...' : 'Test £1 Payment'}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          This will create a real £1 payment - refund immediately after testing
        </p>
      </div>
    </div>
  );
}