import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from "../services/LoginApi";
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchCurrentUser } from '../features/auth/authSlice';

interface FormData {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post('/api/auth/register', {
        name: 'User',
        email: data.email,
        password: data.password,
      });

      await axios.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      await dispatch(fetchCurrentUser());
      navigate('/');
    } catch (err) {
      console.error('Signup failed', err);
    }
  };
  

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await axios.post('/api/auth/google', { token: credentialResponse.credential });
      await dispatch(fetchCurrentUser());
      navigate('/');
    } catch (err) {
      console.error('Google sign-up failed', err);
    }
  };
  

  const handleGoogleError = () => {
    console.log('Google Sign Up failed');
  };

  return (
    <div className="flex h-screen w-full rounded-xl border-2 border-gray-100">
      {/* Left: Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
        <div className="w-full max-w-[500px] px-10 py-5">
          <h1 className="text-5xl font-semibold">Create Account</h1>
          <p className="font-medium text-lg text-gray-500 mt-4">
            Let’s get you started!
          </p>

          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col text-start">
              <label className="text-lg font-medium">Email</label>
              <input
                {...register('email')}
                className="w-full border border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-4 text-start">
              <label className="text-lg font-medium">Password</label>
              <input
                {...register('password')}
                className="w-full border border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Create a password"
                type="password"
              />
              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-y-4">
              <button
                type="submit"
                className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-violet-500 rounded-xl text-white font-bold text-lg"
              >
                Sign up
              </button>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
            </div>
          </form>

          <div className="mt-8 flex justify-center items-center">
            <p className="font-medium text-base">Already have an account?</p>
            <button
              onClick={() => navigate('/login')}
              className="ml-2 font-medium text-base text-violet-500"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>

      {/* Right: Design */}
      <div className="hidden lg:flex relative h-full w-1/2 items-center justify-center">
        <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce" />
        <div className="w-full h-1/2 absolute bottom-0 backdrop-blur-lg" />
      </div>
    </div>
  );
};

export default Signup;
