import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const LoginPage = () => {

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  
  return (
    <GoogleLogin 
    onSuccess={(credentialResponse: any) => {
      const userData: any = jwtDecode(credentialResponse.credential);

      // storing the user data in local storage
      localStorage.setItem('user', JSON.stringify(userData));

      //Global state
      setUser(userData);

      navigate('/');
    }}
    onError={() => { console.log("Login failed"); }}
    auto_select = {true}
    />
  )
}

export default LoginPage
