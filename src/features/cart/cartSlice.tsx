import { createSlice, PayloadAction, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "../../services/CartApi";

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  cartId: number | null;
  items: CartItem[];
  isOpen: boolean; // controls drawer visibility
  loading: boolean;
}

const saveGuestCart = (items: CartItem[]) => {
  localStorage.setItem("guestCart", JSON.stringify(items));
};

const loadGuestCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem("guestCart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};


const initialState: CartState = {
  cartId: null,
  items: loadGuestCart(),
  isOpen: false,
  loading: false,
};

const normalizeItems = (items: any[]): CartItem[] =>
  items.map((i) => ({
    ...i,
    id: String(i.productId),
    productId: i.productId,
  }));


// 🔹 Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId: number) => {
    console.log("Fetching cart... for user:", userId);
    const res = await cartApi.getCart(userId);
    console.log("Cart fetched:", res.data);
    return res.data;
  }
);

export const syncAddItem = createAsyncThunk(
  "cart/syncAddItem",
  async ({ userId, productId, quantity }: { userId: number; productId: number; quantity: number }) => {
    const res = await cartApi.addItem(userId, productId, quantity);
    return res.data;
  }
);

export const syncUpdateQuantity = createAsyncThunk(
  "cart/syncUpdateQuantity",
  async ({ cartId, productId, quantity }: { cartId: number; productId: number; quantity: number }) => {
    console.log("Updating item quantity...", { cartId, productId, quantity });
    const res = await cartApi.updateItem(cartId, productId, quantity);
    console.log("Item quantity updated:", res.data);
    return res.data;
  }
);

export const syncRemoveItem = createAsyncThunk(
  "cart/syncRemoveItem",
  async ({ cartId, productId }: { cartId: number; productId: number }) => {
    console.log("Removing item...", { cartId, productId });
    await cartApi.removeItem(cartId, productId);
    console.log("Item removed:", productId);
    return productId;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    
    setCart: (state, action: PayloadAction<{ cartId?: number | null; items: CartItem[] }>) => {
      state.cartId = action.payload.cartId ?? null;
      state.items = normalizeItems(action.payload.items);
      if (state.cartId) {
        // logged-in → no local save
        localStorage.removeItem("guestCart");
      } else {
        // guest → persist
        saveGuestCart(state.items);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.cartId = null;
      localStorage.removeItem("guestCart");
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartId = action.payload.cartId;
        state.items = action.payload.items.map((i: any) => ({
          ...i,
          id: String(i.productId),   // 🔹 React key
          productId: i.productId,    // 🔹 keep real productId
        }));
      })
      .addCase(syncAddItem.fulfilled, (state, action) => {
        state.items = action.payload.items.map((i: any) => ({
          ...i,
          id: String(i.productId),
          productId: i.productId,
        }));
      })
      .addCase(syncUpdateQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items.map((i: any) => ({
          ...i,
          id: String(i.productId),
          productId: i.productId,
        }));
      })
      .addCase(syncRemoveItem.fulfilled, (state, action) => {
        // Here payload is productId
        state.items = state.items.filter(i => i.productId !== action.payload);
      });
  }
  
});

export const {
  openCart, closeCart, toggleCart, clearCart, setCart 
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
export const selectCartId = createSelector(selectCart, c => c.cartId);
