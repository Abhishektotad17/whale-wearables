import { configureStore } from '@reduxjs/toolkit';
import  counterReducer  from '../features/counter/counterSlice';
import  authReducer  from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import chatReducer from '../features/chat/chatSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    cart: cartReducer,
    chat: chatReducer
  },
});

// Infer types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
