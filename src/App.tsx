import { Camera } from "lucide-react";
import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Product from "./components/Product";
import Testimonials from "./components/Testimonials";

function App() {
  return(
    <>
      <Navbar />
        <div className="max-w-7xl mx-auto pt-20 px6">
          <HeroSection/>
          <Product/>
          <Testimonials/>
        </div>
    </>
    
  );
  // return <Camera color="red" size={48} />;
}

export default App
