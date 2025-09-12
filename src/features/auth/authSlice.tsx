import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {authService} from "../../services/AuthServices";
import { AppDispatch, RootState } from '../../app/store';
import { setCart } from '../cart/cartSlice';
import api from '../../services/GlobalApi';

interface User {
  id: number;
  email: string;
  name?: string;
  picture?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
};

// Async thunk to fetch current user from /api/auth/me
export const fetchCurrentUser = createAsyncThunk<User>(
    'auth/fetchCurrentUser',
    async (_, thunkAPI) => {
      try {
        const response = await authService.getCurrentUser();
        // ✅ Return only the user object, not the wrapper
        return response.data.user;
  
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
      }
    }
  );

  export const handleLoginSuccess =
  (user: User) => async (dispatch: AppDispatch, getState: () => RootState) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

    if (guestCart.length > 0) {
      // merge guest cart → backend
      const res = await api.post(`/cart/merge?userId=${user.id}`, guestCart);
      dispatch(setCart(res.data)); // backend returns merged cart
      localStorage.removeItem("guestCart");
    } else {
      // fetch user cart fresh
      const res = await api.get(`/cart/${user.id}`);
      dispatch(setCart(res.data));
    }
  };

  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      logout(state) {
        state.user = null;
      },
      setUser(state, action: PayloadAction<User>) {
        state.user = action.payload;
        state.status = 'succeeded';
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCurrentUser.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
          state.status = 'succeeded';
          state.user = action.payload;
        })
        .addCase(fetchCurrentUser.rejected, (state) => {
          state.status = 'failed';
          state.user = null;
        });
    },
  });
  
  export const { logout, setUser } = authSlice.actions;
  export default authSlice.reducer;
