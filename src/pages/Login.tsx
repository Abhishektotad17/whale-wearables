import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import  api  from '../services/LoginApi';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchCurrentUser } from '../features/auth/authSlice';

interface FormData {
  email: string;
  password: string;
}

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  // Google login
  const handleGoogleSuccess = async (credentialResponse: any) => {
    await api.post('/api/auth/google', { token: credentialResponse.credential });
    await dispatch(fetchCurrentUser());
    navigate('/');
  };

  const handleGoogleError = () => {
    console.log('Google login failed');
  };

  // email/password login
    const onSubmit = async (data: FormData) => {
      await api.post('/api/auth/login', data);
      await dispatch(fetchCurrentUser());
    navigate('/');
  };
  return (
    <div className="flex h-screen w-full rounded-xl border-2 border-gray-100">
      {/* Left: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
        <div className='w-full max-w-[500px] px-10 py-5'>
          <h1 className='text-5xl font-semibold'>Welcome Back</h1>
          <p className='font-medium text-lg text-gray-500 mt-4'>
            Welcome back! Please enter your details.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className='flex flex-col text-start mt-4'>
            <label className="text-lg font-medium">Email</label>
              <input
                className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your email"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div className='flex flex-col mt-4 text-start'>
              <label className="text-lg font-medium">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your password"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div className='mt-8 flex justify-between items-center'>
              <div>
                <input type='checkbox' id='remember' />
                <label className='ml-2 font-medium text-base' htmlFor='remember'>
                  Remember for 30 days
                </label>
              </div>
              <button className='font-medium text-base text-violet-500'>
                Forgot password
              </button>
            </div>
            <div className='mt-8 flex flex-col gap-y-4'>
              <button
                type="submit"
                className='active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-violet-500 rounded-xl text-white font-bold text-lg'
              >
                Sign in
              </button>
              <div className='flex justify-center'>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
              </div>
            </div>
            <div className='mt-8 flex justify-center items-center'>
              <p className='font-medium text-base'>Don't have an account?</p>
              <button
                onClick={() => navigate("/signup")}
                className='ml-2 font-medium text-base text-violet-500'
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
  
      {/* Right: Animated Design */}
      <div className='hidden lg:flex relative h-full w-1/2 items-center justify-center'>
        <div className='w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce'/>
        <div className='w-full h-1/2 absolute bottom-0 backdrop-blur-lg' />
      </div>
    </div>
  );
};

export default LoginPage;
