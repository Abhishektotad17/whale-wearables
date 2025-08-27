import React, { ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "../pages/Home";
import Product from "../pages/Product";
import Testimonials from "../pages/Testimonials";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
import { CartDrawer } from "../components/CartDrawer";
import PaymentSuccess from "../pages/PaymentSuccess";

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

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/products" element={<PageWrapper><Product /></PageWrapper>} />
          <Route path="/testimonials" element={<PageWrapper><Testimonials /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/payment-success" element={<PageWrapper><PaymentSuccess /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      <CartDrawer />
    </>
  );
};

export default AnimatedRoutes;
