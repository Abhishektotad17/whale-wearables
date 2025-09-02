import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from "../services/LoginApi";
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchCurrentUser, handleLoginSuccess, setUser } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import { clearCart, fetchCart, syncAddItem } from '../features/cart/cartSlice';
import { useAppSelector } from "../hooks/useAppSelector";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const guestItems = useAppSelector((state) => state.cart.items);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('/api/auth/register', {
        name: data.username,
        email: data.email,
        password: data.password,
      });

      await axios.post('/api/auth/login', {
        identifier: data.email,
        password: data.password,
      });

       // 1. Get user
        const user = await dispatch(fetchCurrentUser()).unwrap();

       // 2. Run login success flow (merge or fetch cart)
        await dispatch(handleLoginSuccess(user));

      // await dispatch(fetchCurrentUser());
      toast.success('Account created! You’re in');
      navigate('/');
    } catch (err : any) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data;

      if (status === 400 && typeof serverMsg === 'string' && serverMsg.toLowerCase().includes('exists')) {
        // Show both toast and inline field error
        toast.error(serverMsg);
        setError('email', { type: 'server', message: serverMsg });
      } else {
        toast.error(serverMsg || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  // const handleGoogleSuccess = async (credentialResponse: any) => {
  //   try {
  //     await axios.post('/api/auth/google', { token: credentialResponse.credential });
  //     await dispatch(fetchCurrentUser());
  //     navigate('/');
  //   } catch (err) {
  //     console.error('Google sign-up failed', err);
  //   }
  // };
  

  const handleGoogleError = () => {
    console.log('Google Sign Up failed');
  };

  const googleSignup = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        const res = await axios.post(
          '/api/auth/google',
          { code: codeResponse.code },
          { withCredentials: true }
        );
        const user = res.data.user;
        dispatch(setUser(user));
        
        // reuse thunk
        await dispatch(handleLoginSuccess(user));

        // dispatch(setUser(res.data.user));
        toast.success("Login successful!");
        navigate('/');
      } catch (err : any) {
        console.error('Google signup failed:', err);
      }
    },
    onError: (err) => {
      console.error('Google signup error:', err);
    },
  });

  return (
    <div className="w-full max-w-md mx-auto relative mt-20">
      {/* Card */}
      <div className="card">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow mb-6">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 00-8 0v4H5l7 7 7-7h-3V7z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
        <p className="text-center text-muted-foreground mb-8 text-base">
          Join us! Please enter your details.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1 text-start">
          <label htmlFor="username" className="text-sm font-medium text-foreground">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register('username')}
            className={`h-12 w-full rounded-md border border-white/10 bg-muted/50 backdrop-blur-sm px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
              errors.username ? 'border-destructive' : ''
            }`}
          />
            {errors.username && (
              <p className="text-sm text-destructive mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1 text-start">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              // placeholder="Enter your email"
              {...register('email')}
              className={`h-12 w-full rounded-md border border-white/10 bg-muted/50 backdrop-blur-sm px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                errors.email ? 'border-destructive' : ''
              }`}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1 text-start">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              // placeholder="Create a password"
              {...register('password')}
              className={`h-12 w-full rounded-md border border-white/10 bg-muted/50 backdrop-blur-sm px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                errors.password ? 'border-destructive' : ''
              }`}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-gradient-primary hover:shadow-glow rounded-md font-semibold text-lg text-primary-foreground transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-4 text-muted-foreground font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Signup button */}
        <button
          onClick={() => googleSignup()}
          className="w-full h-12 flex items-center justify-center gap-3 border border-white/10 rounded-md bg-white/5 hover:bg-white/10 text-foreground transition-all duration-200"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-semibold text-primary hover:text-primary-glow transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
