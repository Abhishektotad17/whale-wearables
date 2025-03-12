import { Camera } from "lucide-react";
import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Product from "./components/Product";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AnimatedRoutes from "./components/AnimatedRoutes";

function App() {
  return(
    <Router>
      <Navbar />
        <div className="max-w-7xl mx-auto pt-20 px6">
          {/* <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/products" element={<Product />} />
            <Route path="/testimonials" element={<Testimonials />} />
          </Routes> */}
          <AnimatedRoutes />
          <Footer/>
        </div>
    </Router>
    
  );
  // return <Camera color="red" size={48} />;
}

export default App
