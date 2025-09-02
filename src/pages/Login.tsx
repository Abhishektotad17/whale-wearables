import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import  api  from '../services/LoginApi';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchCurrentUser, handleLoginSuccess, setUser } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import { clearCart, fetchCart, syncAddItem } from '../features/cart/cartSlice';
import { useAppSelector } from "../hooks/useAppSelector";

interface FormData {
  identifier: string;
  password: string;
}

const loginSchema = Yup.object().shape({
  identifier: Yup.string()
    .required('Username or email is required')
    .test('is-valid', 'Invalid email or username', function (value) {
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9_]{3,}$/; // basic username check
      return emailRegex.test(value) || usernameRegex.test(value);
    }),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const guestItems = useAppSelector((state) => state.cart.items);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  // Google login
  // const handleGoogleSuccess = async (credentialResponse: any) => {
  //   await api.post('/api/auth/google', { token: credentialResponse.credential });
  //   await dispatch(fetchCurrentUser());
  //   navigate('/');
  // };

  // const handleGoogleError = () => {
  //   console.log('Google login failed');
  // };

  // email/password login
    const onSubmit = async (data: FormData) => {
      try {
        await api.post("/api/auth/login", data);

        // 1. Get user
        const user = await dispatch(fetchCurrentUser()).unwrap();

       // 2. Run login success flow (merge or fetch cart)
        await dispatch(handleLoginSuccess(user));

        // await dispatch(fetchCurrentUser());
        toast.success("Login successful!");
        navigate("/");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Invalid email or password");
      }
  };
  const googleLogin = useGoogleLogin({
    flow: 'auth-code', // <-- Authorization Code flow
    onSuccess: async (codeResponse) => {
      try {
        // Send the authorization code to backend
        const res = await api.post(
          '/api/auth/google',
          { code: codeResponse.code },
          { withCredentials: true }
        );
        const user = res.data.user;
        dispatch(setUser(user));
        
        await dispatch(handleLoginSuccess(user));
        // dispatch(setUser(res.data.user));
        toast.success("Login successful!");
        navigate('/');
      } catch (err : any) {
        console.error('Google login failed:', err);
      }
    },
    onError: (err) => {
      console.error('Google login error:', err);
    },
  });

  return (
    <div className="w-full max-w-md mx-auto relative mt-20">
     

      {/* Card content */}
      <div className="card">
        {/* Icon circle */}
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-muted-foreground mb-8 text-base">
          Welcome back! Please enter your details.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1 text-start">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Username or email
            </label>
            <input
              id="identifier"
              type="text"
              // placeholder="Enter your email"
              {...register('identifier')}
              className={`h-12 w-full rounded-md border border-white/10 bg-muted/50 backdrop-blur-sm px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                errors.identifier ? 'border-destructive' : ''
              }`}
            />
            {errors.identifier && (
              <p className="text-sm text-destructive mt-1">{errors.identifier.message}</p>
            )}
          </div>

          <div className="space-y-1 text-start">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              // placeholder="Enter your password"
              {...register('password')}
              className={`h-12 w-full rounded-md border border-white/10 bg-muted/50 backdrop-blur-sm px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${
                errors.password ? 'border-destructive' : ''
              }`}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm cursor-pointer">
              <input type="checkbox" className="rounded border-white/10 bg-muted/50 focus:ring-2 focus:ring-primary/50" />
              <span className="text-foreground">Remember for 30 days</span>
            </label>
            {/* <button
              type="button"
              className="text-sm font-medium text-primary hover:text-primary-glow transition-colors"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </button> */}
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-gradient-primary hover:shadow-glow rounded-md font-semibold text-lg text-primary-foreground transition-all duration-300"
          >
            Sign In
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

        {/* Google Login button */}
        <button
        onClick={() => googleLogin()}
        className="w-full h-12 flex items-center justify-center gap-3 border border-white/10 rounded-md bg-white/5 hover:bg-white/10 text-foreground transition-all duration-200"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign in with Google
      </button>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="font-semibold text-primary hover:text-primary-glow transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
