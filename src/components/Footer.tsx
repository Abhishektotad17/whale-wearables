import React from 'react'
import { communityLinks, platformLinks, resourcesLinks } from '../constants'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <footer className="justify-between items-center text-center mt-20 border-t py-10 border-neutral-700">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 items-start">
        <div className="pl-10 pr-6 lg:pl-16 lg:pr-8 text-center">
          <img src={logo} alt="Whale Wearables" className="h-20 mx-auto mb-4" />
          <p className="text-neutral-400 text-sm leading-relaxed">
            At <span className="text-white font-semibold">Whale Wearables</span>, 
            where innovation meets empowerment.
            We are a groundbreaking company featured on Shark Tank,
            dedicated to creating wearable products that prioritize women’s safety.
          </p>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-4">HELPFUL LINKS</h3>
          <ul className="space-y-2">
            {resourcesLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-neutral-300 hover:text-white"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-4">CUSTOMER CARE</h3>
          <ul className="space-y-2">
            {platformLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-neutral-300 hover:text-white"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-4">ABOUT US</h3>
          <ul className="space-y-2">
            {communityLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-neutral-300 hover:text-white"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-700 mt-8 pt-4">
        <p className="text-center text-neutral-400 text-sm">
          © 2025 Whale Wearables. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
