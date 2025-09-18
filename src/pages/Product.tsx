import React, { useEffect, useState } from 'react'
import { features } from '../constants'
import { motion } from 'framer-motion';
import { initializeCashfree } from '../services/Cashfree';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { openCart, selectCart, syncAddItem, fetchCart, setCart } from '../features/cart/cartSlice';
import { useAppSelector } from '../hooks/useAppSelector';
import api from '../services/GlobalApi';

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

const Product = () => {

  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const { cartId, items: cartItems } = useAppSelector(selectCart); 
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<Product[]>('/products'); 
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
    if (user && user.id) {
      dispatch(fetchCart(Number(user.id)));  
    }
  }, []);

  const addToCart = (p: Product) => {
    if (user) {
      // logged-in: sync with backend
      dispatch(syncAddItem({
        userId: Number(user.id),
        productId: Number(p.productId),
        quantity: 1
      }));
      dispatch(openCart());
    } else {
      // guest: local Redux + localStorage
      dispatch(setCart({
        items: [
          ...cartItems,
          {
            id: String(p.productId),
            productId: Number(p.productId),
            name: p.name,
            price: p.price,
            image: p.imageUrl,
            quantity: 1
          }
        ]
      }));
      dispatch(openCart());
    }
  };

  const navigate = useNavigate();

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
                {p.stockQuantity === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">Out of Stock</span>
                  </div>
                )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold line-clamp-2">{p.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xl font-bold text-orange-700">₹{p.price.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => addToCart(p)} disabled={p.stockQuantity === 0}
                   className={`px-4 py-2 rounded-lg transition ${
                    p.stockQuantity === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}>
                   {p.stockQuantity === 0 ? "Unavailable" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          ))}
        </div>
    </div>
  )
}

export default Product
