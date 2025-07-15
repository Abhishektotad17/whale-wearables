import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AnimatedRoutes from "./routes/AnimatedRoutes";

function App() {
  return(
    <Router>
      <ScrollToTop/>
      <Navbar />
        <div className="max-w-7xl mx-auto pt-20 px6">
          <AnimatedRoutes />
          <Footer/>
        </div>
    </Router>
    
  );
  // return <Camera color="red" size={48} />;
}

export default App
