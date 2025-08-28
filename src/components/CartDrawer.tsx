import React, { useEffect } from "react";
import { X, Minus, Plus, ShoppingBag, CreditCard, Trash2 } from "lucide-react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  selectIsOpen, selectItems, selectTotalItems, selectTotalPrice,
  closeCart, updateQuantity, removeItem
} from "../features/cart/cartSlice";
import axios from "axios";
import { initializeCashfree } from '../services/Cashfree';
import { useNavigate } from "react-router-dom";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsOpen);
  const items = useAppSelector(selectItems);
  const totalItems = useAppSelector(selectTotalItems);
  const totalPrice = useAppSelector(selectTotalPrice);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  // const handleCheckout = async () => {
  //   try {
  //     // create order with total price
  //     const orderRes = await axios.post(
  //       "http://localhost:8080/api/orders",
  //       { amount: Math.round(totalPrice), phone: "9876543210" },
  //       { withCredentials: true }
  //     );
  //     const order = orderRes.data;
  //     const tokenRes = await axios.get(
  //       `http://localhost:8080/api/orders/${order.orderId}/token`,
  //       { withCredentials: true }
  //     );
  //     const { cftoken } = tokenRes.data;
  //     const cashfree = await initializeCashfree();

  //     cashfree.checkout({
  //       paymentSessionId: cftoken,
  //       redirect: true,
  //       onSuccess: async () => {
  //           console.log("Checkout success");
  //           navigate(`/payment-success?orderId=${order.orderId}`);
  //         },
  //         onClose: () => {
  //           console.log("Checkout closed by user");
  //         },
  //     });
  //   } catch (e) {
  //     console.error("Checkout error", e);
  //     alert("Something went wrong during checkout.");
  //   }
  // };

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate("/order-summary");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => dispatch(closeCart())}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 shadow-xl z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200/50 dark:border-neutral-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Shopping Cart</h2>
              <p className="text-sm text-neutral-500">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full grid place-items-center text-neutral-500">
              Your cart is empty
            </div>
          ) : items.map((it) => (
            <div key={it.id} className="flex gap-4 p-3 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60">
              <img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{it.name}</h3>
                  <button
                    onClick={() => dispatch(removeItem(it.id))}
                    className="text-neutral-500 hover:text-red-600"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-neutral-500">₹{it.price.toFixed(2)} each</p>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center"
                      onClick={() => dispatch(updateQuantity({ id: it.id, quantity: it.quantity - 1 }))}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{it.quantity}</span>
                    <button
                      className="w-8 h-8 rounded-md border hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center"
                      onClick={() => dispatch(updateQuantity({ id: it.id, quantity: it.quantity + 1 }))}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-semibold">₹{(it.price * it.quantity).toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-neutral-200/50 dark:border-neutral-800/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">₹{totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95"
          >
            <CreditCard className="w-5 h-5" />
            Proceed to Checkout
          </button>
          <p className="text-xs text-neutral-500 text-center">You’ll enter shipping & payment details on the next step</p>
        </div>
      </div>
    </>
  );
}
