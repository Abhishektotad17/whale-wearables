import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { Provider } from 'react-redux';
import { store } from './app/store';

const CLIENT_ID = "829277785533-b6moncq6ikqke5okefkve9uj0734n51g.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
