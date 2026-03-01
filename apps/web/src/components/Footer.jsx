
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => 
    `text-sm transition-colors ${isActive(path) ? 'text-[#FBBF24] font-semibold' : 'text-blue-200 hover:text-white'}`;

  return (
    <footer className="bg-[#1E40AF] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-extrabold mb-4 tracking-tight">
              Safe<span className="text-[#FBBF24]">Ride</span>
            </div>
            <p className="text-blue-200 text-sm mb-6 leading-relaxed">
              Safe, Reliable School Transport in Lake City, Lahore. Your child's safety is our top priority.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FBBF24] hover:text-[#1E40AF] transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FBBF24] hover:text-[#1E40AF] transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FBBF24]">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/" className={linkClass('/')}>Home</Link></li>
              <li><Link to="/about" className={linkClass('/about')}>About Us</Link></li>
              <li><Link to="/services" className={linkClass('/services')}>Services</Link></li>
              <li><Link to="/contact" className={linkClass('/contact')}>Contact</Link></li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FBBF24]">Account</h3>
            <ul className="space-y-3">
              <li><Link to="/book" className={linkClass('/book')}>Book Now</Link></li>
              <li><Link to="/login" className={linkClass('/login')}>Parent Login</Link></li>
              <li><Link to="/admin-login" className={linkClass('/admin-login')}>Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FBBF24]">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-blue-200">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#FBBF24]" />
                <span className="text-sm">+92 300 1234567</span>
              </div>
              <div className="flex items-start gap-3 text-blue-200">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#FBBF24]" />
                <span className="text-sm">info@saferide.com.pk</span>
              </div>
              <div className="flex items-start gap-3 text-blue-200">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#FBBF24]" />
                <span className="text-sm">Lake City, Lahore, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-blue-300 text-sm">
          <p>&copy; {new Date().getFullYear()} SafeRide School Transport. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
