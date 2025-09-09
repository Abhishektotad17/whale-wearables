import React, { useEffect, useState } from 'react'
import video1 from '../assets/watches_videos/video 1.mp4'
import video2 from '../assets/watches_videos/video 3.mp4'
import { getHomeContent } from '../services/HomeConstantService';
import { productDescription } from '../constants';
import { ProductGallery } from '../components/ScrollGallery';
import watch1 from '../assets/watches/watch 10.png';
import watch2 from '../assets/watches/watch 2.png';
import watch3 from '../assets/watches/watch 3.png';
import watch4 from '../assets/watches/watch 5.png';
import watch5 from '../assets/watches/watch 9.png';

export interface HomeContent {
    heading: string;
    highlightText: string;
    description: string;
    video1Url: string;
    video2Url: string;
  }
  const productImages = [
    { src: watch1, alt: "Smartwatch front view" },
    { src: watch2, alt: "Smartwatch back view" },
    { src: watch3, alt: "Smartwatch on wrist" },
    { src: watch4, alt: "Smartwatch packaging" },
    { src: watch5, alt: "Smartwatch in use" },
  ];
const HeroSection = () => {
    const [content, setContent] =  useState<HomeContent | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        getHomeContent()
          .then((res) => {
            setContent(res.data);
          })
          .catch((err) => {
            console.error('Failed to load home content:', err);
            setError('Failed to load content');
          });
      }, []);
    
      if (error) {
        return <p className="text-red-600 text-center mt-10">{error}</p>;
      }
    
      if (!content) {
        return <p className="text-center mt-10">Loading...</p>;
      }

    return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
            {content.heading}
            <span className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
                {" "}  {content.highlightText}
            </span>
        </h1>
        <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
           {content.description}
        </p>
        <div className="flex justify-center my-10">
            <a href="/products" className="bg-gradient-to-r from-orange-500 to-orange-800 py-3 px-4 mx-3 rounded-md">
                PREBOOK NOW
            </a>
        </div>
        <div className="flex mt-10 justify-center">
            <video autoPlay loop muted className="rounded-lg w-1/2 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4">
                <source src={video1} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <video autoPlay loop muted className="rounded-lg w-1/2 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4">
                <source src={video2} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
      </div>
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

export default HeroSection
