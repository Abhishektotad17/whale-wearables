import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('No order ID found in URL');
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await axios.get<{ status: string }>(
          `http://localhost:8080/api/orders/${orderId}/status`,
          { withCredentials: true }
        );
        setStatus(res.data.status);
      } catch (err) {
        setError('Failed to fetch order status. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [orderId]);

  if (loading) return <div>Loading payment status...</div>;

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 border rounded shadow text-center">
      {status === 'PAID' ? (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p>Your order <strong>{orderId}</strong> has been confirmed.</p>
          <p>Thank you for your purchase!</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Not Confirmed</h1>
          <p>Your order status is <strong>{status}</strong>.</p>
          <p>If you believe this is a mistake, please contact support.</p>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
