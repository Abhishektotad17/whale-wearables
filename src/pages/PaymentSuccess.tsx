import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { clearCart, openCart } from '../features/cart/cartSlice';
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useNavigate } from "react-router-dom";import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
;

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      setError('No order ID found in URL');
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/orders/${orderId}/verify`,
          { withCredentials: true }
        );
        setStatus(res.data.status);
        console.log("Order status:", res.data.status);
      } catch (err) {
        setError('Failed to fetch order status. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [orderId]);

    useEffect(() => {
      if (status === "PAID") {
        dispatch(clearCart());
      }
    }, [status, dispatch]);

    const handleRetry = () => {
      navigate("/products");
      dispatch(openCart());
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen text-lg font-medium text-gray-600">
          Checking your payment status...
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold">
          {error}
        </div>
      );
    }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 border border-gray-200 shadow-xl rounded-2xl text-center"
    >
      {status === "PAID" ? (
        <>
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="w-14 h-14 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Your order <span className="font-semibold">{orderId}</span> has
            been confirmed. 🎉
          </p>
          <p className="text-gray-500">Thank you for shopping with us.</p>

          <Link
            to="/products"
            className="mt-6 inline-block w-full py-3 px-6 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Continue Shopping
          </Link>
        </>
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <XCircle className="w-14 h-14 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-4">
            Your order status is{" "}
            <span className="font-semibold">{status}</span>.
          </p>
          <p className="text-gray-500">
            If you believe this is a mistake, please contact support.
          </p>

          <button
            onClick={handleRetry}
            className="mt-6 inline-block w-full py-3 px-6 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-900 transition"
          >
            Try Again
          </button>
        </>
      )}
    </motion.div>
  </div>
  );
};

export default PaymentSuccess;
