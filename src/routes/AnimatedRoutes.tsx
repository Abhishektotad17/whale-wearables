import React, { ReactNode } from "react";
import { Routes, Route, useLocation, Navigate} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "../pages/Home";
import Product from "../pages/Product";
import Testimonials from "../pages/Testimonials";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
import { CartDrawer } from "../components/CartDrawer";
import PaymentSuccess from "../pages/PaymentSuccess";
import OrderSummary from "../pages/OrderSummary";
import Contact from "../pages/Contact";
import Team from "../pages/Team";

import ProtectedRoute from "../features/auth/ProtectedRoute";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SellerDashboard from "../pages/seller/SellerDashboard";
import { useRole } from "../hooks/useRole";

// Define Type for Props
interface PageWrapperProps {
  children: ReactNode;
}

// Animation Variants
const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 1 } },
};

// Page Wrapper Component with TypeScript Props
const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};
// ✅ NEW — redirects to correct dashboard after login based on role
const RoleBasedRedirect: React.FC = () => {
  const { isAdmin, isSeller } = useRole();
  if (isAdmin)  return <Navigate to="/admin/dashboard" replace />;

  if (isSeller) return <Navigate to="/seller/dashboard" replace />;

  return <Navigate to="/" replace />;
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/products" element={<PageWrapper><Product /></PageWrapper>} />
          <Route path="/testimonials" element={<PageWrapper><Testimonials /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/team" element={<PageWrapper><Team /></PageWrapper>} />
          <Route path="/careers" element={<PageWrapper><div className="text-center text-2xl mt-20">Careers Page - Coming Soon!</div></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/payment-success" element={<PageWrapper><PaymentSuccess /></PageWrapper>} />
          <Route path="/order-summary" element={<PageWrapper><OrderSummary/></PageWrapper>}/>

          {/* ✅ NEW — role-based redirect after login */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />

          {/* ✅ NEW — unauthorized page */}
          <Route path="/unauthorized" element={<PageWrapper><UnauthorizedPage /></PageWrapper>} />

          {/* ✅ NEW — seller + admin protected */}
          <Route element={<ProtectedRoute allowedRoles={['SELLER', 'ADMIN']} />}>
            <Route path="/seller/dashboard" element={<PageWrapper><SellerDashboard /></PageWrapper>} />
          </Route>

          {/* ✅ NEW — admin only protected */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
            <Route path="/admin/users"     element={<PageWrapper><AdminDashboard /></PageWrapper>} />
          </Route>

        </Routes>
      </AnimatePresence>
      <CartDrawer />
    </>
  );
};

export default AnimatedRoutes;
