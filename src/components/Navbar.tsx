import { Menu, X } from "lucide-react";
import React, { useState, useEffect, useContext } from 'react'
import logo from "../assets/logo.png";
import { navItems } from '../constants';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import axios from "../services/LoginApi";
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from "../hooks/useAppSelector";
import { logout } from '../features/auth/authSlice';
import avatar from '../assets/avatar_icon.jpg';
import { ShoppingCart } from "lucide-react";
import { toggleCart } from "../features/cart/cartSlice"; 
import { clearCart } from "../features/cart/cartSlice";

const Navbar = () => {

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

    const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout"); // Clear backend cookie
      googleLogout(); // Logout Google user if applicable
      document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
      dispatch(logout()); // Clear Redux state
      dispatch(clearCart())
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const cartItems = useAppSelector((state) => state.cart.items);
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);


  return (
    <nav className='sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80'>
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight">Whale wearables</span>
          </div>

          {/* Nav Items */}
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}> {item.label} </a>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex justify-center space-x-6 items-center">

          <button onClick={() => dispatch(toggleCart())} className="relative">
            <ShoppingCart className="w-6 h-6 text-orange-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
              </span>
            )}
          </button>
          {user ? (
              <div className="flex items-center gap-4">
                  <img src={user?.picture || avatar} alt="profile" className="w-8 h-8 rounded-full" />

                <span>{user.name}</span>
                <button onClick={handleLogout} className="py-2 px-3 bg-red-500 text-white rounded">Logout</button>
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="py-2 px-3 border rounded-md">Sign up</button>
                <button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md">Log in</button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
             <button onClick={() => dispatch(toggleCart())} className="relative mb-6">
              <ShoppingCart className="w-7 h-7 text-orange-500" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6 mt-6">
              {user ? (
                  <>
                      <img   src={user?.picture || avatar}  alt="profile" className="w-8 h-8 rounded-full" />
                    <span className="text-white">{user.name}</span>
                    <button onClick={handleLogout} className="py-2 px-3 bg-red-500 text-white rounded">Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigate('/login')} className="py-2 px-3 border rounded-md">Sign up</button>
                    <button onClick={() => navigate('/signup')} className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800">Log in</button>
                  </>
                )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar
