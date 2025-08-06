import { configureStore } from '@reduxjs/toolkit';
import  counterReducer  from '../features/counter/counterSlice';
import  authReducer  from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer
  },
});

// Infer types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
