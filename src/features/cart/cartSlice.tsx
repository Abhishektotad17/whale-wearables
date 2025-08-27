import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean; // controls drawer visibility
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{ id: string; name: string; price: number; image: string; qty?: number }>
    ) => {
      const { id, name, price, image, qty = 1 } = action.payload;
      const existing = state.items.find(i => i.id === id);
      if (existing) {
        existing.quantity += qty;
      } else {
        state.items.push({ id, name, price, image, quantity: qty });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
  },
});

export const {
  addItem, removeItem, updateQuantity, clearCart,
  openCart, closeCart, toggleCart
} = cartSlice.actions;

export default cartSlice.reducer;

// selectors
export const selectCart = (state: any) => state.cart as CartState;
export const selectItems = createSelector(selectCart, c => c.items);
export const selectIsOpen = createSelector(selectCart, c => c.isOpen);
export const selectTotalItems = createSelector(selectItems, items =>
  items.reduce((acc, i) => acc + i.quantity, 0)
);
export const selectTotalPrice = createSelector(selectItems, items =>
  items.reduce((acc, i) => acc + i.price * i.quantity, 0)
);
