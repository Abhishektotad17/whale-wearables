import { Menu, X } from "lucide-react";
import React, { useState, useEffect, useContext } from 'react'
import logo from "../assets/logo.png";
import { navItems } from '../constants';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";


const Navbar = () => {

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();


    const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

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
            {user ? (
              <div className="flex items-center gap-4">
                <img src={user.picture} alt="profile" className="w-8 h-8 rounded-full" />
                <span>{user.name}</span>
                <button onClick={handleLogout} className="py-2 px-3 bg-red-500 text-white rounded">Logout</button>
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="py-2 px-3 border rounded-md">Sign In</button>
                <a href="#" className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md">
                  Create an account
                </a>
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
                  <img src={user.picture} alt="profile" className="w-8 h-8 rounded-full" />
                  <span className="text-white">{user.name}</span>
                  <button onClick={handleLogout} className="py-2 px-3 bg-red-500 text-white rounded">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="py-2 px-3 border rounded-md">Sign In</button>
                  <a href="#" className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800">
                    Create an account
                  </a>
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
