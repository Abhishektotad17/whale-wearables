import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"
import { BrowserRouter as Router, useLocation } from "react-router-dom"
import AnimatedRoutes from "./routes/AnimatedRoutes";

function App() {
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

      {!isAuthPage ? (
        <>
          <Navbar />
          <div className="max-w-7xl mx-auto pt-20 px-6">
            <AnimatedRoutes />
            <Footer />
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto justify-between items-center text-center">
          <header className="py-4 text-2xl font-bold">
          Whale Wearables - {location.pathname === '/login' ? 'Login' : 'Sign Up'}
          </header>

          <main className="flex-grow w-full mx-auto mt-10">
            <AnimatedRoutes />
          </main>

          <footer className="py-4 text-sm text-gray-500">
          © Whale Wearables Pvt. Ltd. All rights reserved.
          </footer>
        </div>
      )}
    </>
  );
};

export default App
