import React from 'react'
import { features } from '../constants'
import { motion } from 'framer-motion';
import watchImage1 from '../assets/watch_image1.jpg';
import watchImage2 from '../assets/watch_image2.jpg';
import watchImage3 from '../assets/watch_image3.jpg';
import user1 from '../assets/profile-pictures/user1.jpg';
import user2 from '../assets/profile-pictures/user2.jpg';
import user3 from '../assets/profile-pictures/user3.jpg';
import user4 from '../assets/profile-pictures/user4.jpg';
import user5 from '../assets/profile-pictures/user5.jpg';
import { productDescription } from '../constants';
import { ProductGallery } from '../components/ScrollGallery';

const imageVariants = {
  offscreen: {
    y: 200,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    rotate: -5,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const imageCards = [
  { src: watchImage1, alt: 'Product 1' },
  { src: watchImage2, alt: 'Product 2' },
  { src: watchImage3, alt: 'Product 3' },
];

const productImages = [
  { src: user1, alt: "Smartwatch front view" },
  { src: user2, alt: "Smartwatch back view" },
  { src: user3, alt: "Smartwatch on wrist" },
  { src: user4, alt: "Smartwatch packaging" },
  { src: user5, alt: "Smartwatch in use" },
];

const Product = () => {
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
       <div className="flex flex-col justify-center mt-16 gap-8">
        {imageCards.map((img, i) => (
          <motion.div
            key={i}
            className="w-full sm:w-[250px] h-[350px] mx-auto overflow-hidden rounded-xl shadow-lg"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.8 }}
            variants={imageVariants}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
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
