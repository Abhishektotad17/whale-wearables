import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from "../../services/LoginApi";

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
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
        const response = await axios.get('/api/auth/me', {
          withCredentials: true,
        });
  
        // ✅ Return only the user object, not the wrapper
        return response.data.user;
  
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
      }
    }
  );
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
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

export const { logout } = authSlice.actions;
export default authSlice.reducer;
