import React, { useEffect, useState } from 'react'
import { features } from '../constants'
import { motion } from 'framer-motion';
import user1 from '../assets/profile-pictures/user1.jpg';
import user2 from '../assets/profile-pictures/user2.jpg';
import user3 from '../assets/profile-pictures/user3.jpg';
import user4 from '../assets/profile-pictures/user4.jpg';
import user5 from '../assets/profile-pictures/user5.jpg';
import { productDescription } from '../constants';
import { ProductGallery } from '../components/ScrollGallery';
import { initializeCashfree } from '../services/Cashfree';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addItem, openCart } from '../features/cart/cartSlice';

interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const imageVariants = {
  offscreen: {
    y: 200,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const productImages = [
  { src: user1, alt: "Smartwatch front view" },
  { src: user2, alt: "Smartwatch back view" },
  { src: user3, alt: "Smartwatch on wrist" },
  { src: user4, alt: "Smartwatch packaging" },
  { src: user5, alt: "Smartwatch in use" },
];

const Product = () => {

  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products...");
        const res = await axios.get<Product[]>('http://localhost:8080/api/products'); 
        setProducts(res.data);
        console.log("Products fetched:", res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (p: Product) => {
    dispatch(addItem({ id: p.productId, name: p.name, price: p.price, image: p.imageUrl, qty: 1 }));
    dispatch(openCart());
  };

  const navigate = useNavigate();

  // const handleBuyNow = async () => {
  //   try {
  //     // 1️⃣ Create order in backend
  //     const orderRes = await axios.post<Order>(
  //       "http://localhost:8080/api/orders",
  //       {
  //         amount: 1000, // hardcoded for now
  //         phone: "9876543210",
  //       },
  //       { withCredentials: true }
  //     );
  
  //     const order = orderRes.data;
  
  //     // 2️⃣ Get Cashfree token
  //     const tokenRes = await axios.get<TokenResponse>(
  //       `http://localhost:8080/api/orders/${order.orderId}/token`,
  //       { withCredentials: true }
  //     );
  
  //     const { cftoken } = tokenRes.data;
  
  //     // 3️⃣ Load Cashfree SDK
  //     const cashfree = await initializeCashfree();
  
  //     // 4️⃣ Open checkout
  //     cashfree.checkout({
  //       paymentSessionId: cftoken,
  //       redirect: false,
  //       onSuccess: async () => {
  //         console.log("Cashfree onSuccess triggered");
  //         navigate(`/payment-success?orderId=${order.orderId}`);
  //       },
  //       onFailure: () => {
  //         alert("❌ Payment Failed!");
  //       },
  //       onClose: () => {
  //         console.log("Checkout closed by user.");
  //       }
  //     });
  //   } catch (err) {
  //     console.error("Payment Error:", err);
  //     alert("Something went wrong during checkout.");
  //   }
  // };
  

  return (
    <div className="relative mt-20 min-h-[800px]">
      <div className="text-center">
        {/* <span className="bg-neutral-900 text-orange-500 rounded-full h-6 text-sm font-medium px-2 py-1 uppercase">
          Feature
        </span> */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide">
            Wear confidence, not fear!
        </h2>
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text mt-20">
            First of its kind, patented, self defense wearables for women!
          </span>
      </div>

      <div className="flex flex-wrap mt-10 lg:mt-20">
        {features.map((feature, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3">
            <div className="flex">
              <div className="flex mx-6 h-10 w-10 p-2 bg-neutral-900 text-orange-700 justify-center items-center rounded-full">
                {feature.icon}
              </div>
              <div>
                <h5 className="mt-1 mb-6 text-xl">{feature.text}</h5>
                <p className="text-md p-2 mb-20 text-neutral-500">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
       {/* Framer Motion Animated Images */}
        <div className="flex flex-row flex-wrap justify-center items-center gap-8 mt-16">
          {products.map((p) => (

            <motion.div
            key={p.productId}
            className="w-[90%] sm:w-[280px] md:w-[350px] lg:w-[350px] rounded-xl shadow-lg overflow-hidden flex flex-col group relative"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
            variants={imageVariants}
          >
            <div className="relative h-[250px] sm:h-[320px] md:h-[400px] lg:h-[350px]">
              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />    
            </div>

            <div className="p-4">
              <h3 className="font-semibold line-clamp-2">{p.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xl font-bold text-orange-700">₹{p.price.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => addToCart(p)} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          ))}
        </div>

         {/* Product Description Section */}
      <div className="mt-20 px-6 sm:px-12 md:px-20 lg:px-32 text-center">
        <h3 className="text-2xl sm:text-4xl font-semibold text-orange-600 mb-6">
          {productDescription.heading}
        </h3>
        <p className="text-neutral-400 text-md sm:text-lg leading-relaxed mb-10">
          {productDescription.paragraph}
        </p>
      </div>

      <ProductGallery images={productImages} />


    </div>
  )
}

export default Product
