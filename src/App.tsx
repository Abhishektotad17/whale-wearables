import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"
import { BrowserRouter as Router, useLocation } from "react-router-dom"
import AnimatedRoutes from "./routes/AnimatedRoutes";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useEffect } from "react";
import { fetchCurrentUser } from "./features/auth/authSlice";
import { Toaster } from "react-hot-toast";
import { fetchCart } from "./features/cart/cartSlice";

function App() {

  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchCurrentUser()).unwrap().then((user) => {
      if (user?.id) {
        dispatch(fetchCart(Number(user.id)));
      }
    });
  }, [dispatch]);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      <ScrollToTop />

       {/* Toast container */}
       <Toaster position="top-center" reverseOrder={false} />

      {isAuthPage && (
        <div className="fixed inset-0 z-[-10] glow-background"></div>  
      )}

      {!isAuthPage ? (
        <>
          <Navbar />
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedRoutes />
          </div>
          <Footer />
        </>
      ) : (
        <div className="max-w-7xl mx-auto justify-between items-center text-center">

          <main className="flex-grow w-full mx-auto mt-10">
            <AnimatedRoutes />
          </main>

          <footer className="py-4 text-sm text-gray-500">
          © NextGear Wearables Pvt. Ltd. All rights reserved.
          </footer>
        </div>
      )}
    </>
  );
};

export default App
