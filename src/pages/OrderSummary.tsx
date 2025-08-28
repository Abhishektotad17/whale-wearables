import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { initializeCashfree } from '../services/Cashfree';
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ⛳️ Assumptions
// - You already store cart items in Redux using your cartSlice (id, name, price, image, quantity)
// - You have an auth slice with user info OR cookies-based session. If not, wire the guard later.
// - This page creates the Order (PENDING) only after the user submits billing/shipping details.
// - After successful order creation, it navigates to /checkout/:orderId where you start Cashfree.

// 👉 Replace these imports with your actual hooks
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { openCart, selectItems, selectTotalPrice } from "../features/cart/cartSlice";

// --------- Optional: simple login guard (redirect to /login if no user) ---------
function useRequireAuth() {
  const navigate = useNavigate();
  // Change selector to your real auth selector
  const user = useAppSelector((s: any) => s.auth?.user || null);
  React.useEffect(() => {
    if (!user) {
      const intended = encodeURIComponent("/order-summary");
      navigate(`/login?redirect=${intended}`, { replace: true });
    }
  }, [user, navigate]);
  return user;
}

// --------- Types aligned to your backend models ---------
interface OrderItemPayload {
  productId: number; // FK → Product
  quantity: number;
  price: number; // single unit price at time of order
}

interface OrderBillingPayload {
  fullName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  email: string;
}

// What we POST to create an order draft (PENDING)
interface CreateOrderRequest {
  amount: number; // BigDecimal-compatible total
  phone: string; // stored in orders.phone (you can mirror billing.phoneNumber)
  items: OrderItemPayload[]; // will be persisted to order_items
  billing: OrderBillingPayload; // will be persisted to order_billing
}

interface CreateOrderResponse {
  orderId: string;
  status: string;
  amount: number;
  createdAt?: string;
}

// --------- Component ---------
export default function OrderSummary() {
  const navigate = useNavigate();
  const user = useRequireAuth();
  const dispatch = useAppDispatch(); // Ensure you import useAppDispatch from your hooks

  const items = useAppSelector(selectItems);
  const cartTotal = useAppSelector(selectTotalPrice);

  // Derived amounts (adjust logic as you like)
  const shipping = useMemo(() => (cartTotal > 9999 ? 0 : 99), [cartTotal]);
  const tax = useMemo(() => Number((cartTotal * 0.18).toFixed(2)), [cartTotal]);
  const grandTotal = useMemo(() => Number((cartTotal + shipping + tax).toFixed(2)), [cartTotal, shipping, tax]);

  // Billing form state (prefill from user profile if available)
 
  const billingSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    addressLine1: Yup.string().required("Address line 1 is required"),
    addressLine2: Yup.string().nullable().notRequired(),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postalCode: Yup.string().required("Postal code is required"),
    country: Yup.string().required("Country is required"),
  });

  const { register,handleSubmit,setValue,formState: { errors },} = useForm<OrderBillingPayload>({
    resolver: yupResolver(billingSchema) as any,
    mode: "onTouched",       // ✅ only validate on submit
    defaultValues: {
      fullName: user?.name || "",
      phoneNumber: user?.phone || "",
      email: user?.email || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
  });

   // ✅ Autofill from user after mount
   useEffect(() => {
    if (user) {
      if (user.name) setValue("fullName", user.name);
      if (user.email) setValue("email", user.email);
      if (user.phone) setValue("phoneNumber", user.phone);
    }
  }, [user, setValue]);

  const [loading, setLoading] = useState(false);

    const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & {
        label: string;
        error?: string;
    }
    >(({ label, error, ...rest }, ref) => {
    return (
        <label className="block">
        <span className="text-sm font-medium">{label}</span>
        <input
            ref={ref} // ✅ RHF ref
            {...rest} // ✅ this MUST include onChange, onBlur, name, value
            className={`mt-1 w-full rounded-xl border bg-white dark:bg-neutral-900 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-600/40 ${
            error ? "border-red-500" : "border-neutral-300 dark:border-neutral-800"
            }`}
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
        </label>
    );
    });
    Input.displayName = "Input";



const handlePlaceOrder =  handleSubmit (async (billingData) => {

    try {
        setLoading(true);
    
      // 2. Create order in backend
      const orderRes = await axios.post(
        "http://localhost:8080/api/orders",
        {
          phone: billingData.phoneNumber,
          items: items.map(it => ({
            productId: it.id,
            quantity: it.quantity,
            price: it.price
          })),
          billing: billingData,
          amount: grandTotal,
        },
        { withCredentials: true }
      );
  
      const order = orderRes.data;
  
      // 3. Request Cashfree token
      const tokenRes = await axios.get(
        `http://localhost:8080/api/orders/${order.orderId}/token`,
        { withCredentials: true }
      );
  
      const { cftoken } = tokenRes.data;
  
      // 4. Init Cashfree checkout
      const cashfree = await initializeCashfree();
  
      cashfree.checkout({
        paymentSessionId: cftoken,
        redirect: true,
        onSuccess: () => {
          navigate(`/payment-success?orderId=${order.orderId}`);
        },
        onClose: () => {
          console.log("Checkout closed by user");
        },
      });
    } catch (err) {
      console.error("Order placement error:", err);
      alert("Something went wrong during checkout.");
    }
  });

    const handleGoBackToCart = () => {
        navigate("/products");
        dispatch(openCart());
    };
  return (
    <div className="min-h-screen bg-neutral-50/40 dark:bg-neutral-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Order Summary</h1>
          <div className="text-sm text-neutral-500">Review your items & enter shipping</div>
        </div>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left column: Items + Address */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <section className="rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="p-5 border-b border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Items</h2>
              <span className="text-sm text-neutral-500">{items.length} item{items.length!==1?'s':''}</span>
            </div>
            <ul className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
              {items.map((it) => (
                <li key={it.id} className="p-5 flex items-center gap-4">
                  <img src={it.image} alt={it.name} className="w-20 h-20 rounded-xl object-cover border border-neutral-200/60 dark:border-neutral-800/60" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium line-clamp-1">{it.name}</p>
                      <p className="font-semibold">₹{(it.price * it.quantity).toFixed(2)}</p>
                    </div>
                    <div className="text-sm text-neutral-500">Qty: {it.quantity} · ₹{it.price.toFixed(2)} each</div>
                  </div>
                </li>
              ))}
              {items.length === 0 && (
                <li className="p-5 text-neutral-500">Your cart is empty.</li>
              )}
            </ul>
          </section>

          {/* Shipping & Billing Card */}
          <section className="rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200/60 dark:border-neutral-800/60">
            <div className="p-5 border-b border-neutral-200/60 dark:border-neutral-800/60">
                <h2 className="text-lg font-semibold">Shipping & Billing</h2>
                <p className="text-sm text-neutral-500 mt-1">We’ll use this to ship your order and send updates.</p>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" {...register("fullName")} error={errors.fullName?.message} />
                <Input label="Phone Number" {...register("phoneNumber")} error={errors.phoneNumber?.message} />
                <Input label="Email" {...register("email")} error={errors.email?.message} />
                <div />
                <Input label="Address Line 1" {...register("addressLine1")} error={errors.addressLine1?.message} />
                <Input label="Address Line 2" {...register("addressLine2")} />
                <Input label="City" {...register("city")} error={errors.city?.message} />
                <Input label="State" {...register("state")} error={errors.state?.message} />
                <Input label="Postal Code" {...register("postalCode")} error={errors.postalCode?.message} />
                <Input label="Country" {...register("country")} error={errors.country?.message} />
            </div>
        </section>
        </div>

        {/* Right column: Totals + CTA */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <section className="rounded-2xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200/60 dark:border-neutral-800/60 p-5">
              <h3 className="text-lg font-semibold mb-4">Price Details</h3>
              <Row label="Items Subtotal" value={`₹${cartTotal.toFixed(2)}`} />
              <Row label={`Shipping${shipping === 0 ? " (Free)" : ""}`} value={`₹${shipping.toFixed(2)}`} />
              <Row label="Tax (18%)" value={`₹${tax.toFixed(2)}`} />
              <div className="h-px bg-neutral-200/60 dark:bg-neutral-800/60 my-3" />
              <Row label={<span className="font-semibold">Total</span>} value={<span className="font-bold">₹{grandTotal.toFixed(2)}</span>} />
              <button
                onClick={handlePlaceOrder}
                disabled={items.length === 0 || loading}
                className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:opacity-95 disabled:opacity-60"
              >
                {loading ? "Creating Order..." : "Place Order & Continue"}
              </button>
              <p className="text-xs text-neutral-500 mt-2">You’ll complete payment on the next step.</p>
            </section>

            <button
            //   onClick={() => navigate(-1)}
            onClick={handleGoBackToCart}
              className="w-full py-2.5 rounded-xl border border-neutral-300/70 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Back to Cart
            </button>
          </div>
        </aside>
      </motion.main>
    </div>
  );
}

// ------- Small UI helpers -------
function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5">
      <div className="text-neutral-600 dark:text-neutral-400">{label}</div>
      <div>{value}</div>
    </div>
  );
}

