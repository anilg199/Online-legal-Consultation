// components/Footer.tsx
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-10 pb-6 px-4 md:px-20">
      <div className="grid md:grid-cols-4 gap-10 text-sm">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">⚖️ Law & Justice</h2>
          <p className="text-gray-400">
            Providing trusted legal solutions tailored to your needs. We stand for justice, integrity, and client-first advocacy.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/services" className="hover:text-white">Services</a></li>
            <li><a href="/lawyers" className="hover:text-white">Our Lawyers</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Legal Areas */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Practice Areas</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Family Law</li>
            <li>Corporate Law</li>
            <li>Criminal Defense</li>
            <li>Real Estate Law</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 123 Justice Avenue, New Delhi</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@lawjustice.com</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-6"></div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
        <p>&copy; {new Date().getFullYear()} Law & Justice. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
          <a href="/terms" className="hover:text-white">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
