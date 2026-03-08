import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

// WhatsApp SVG icon (not in lucide-react)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
              <a href="https://www.facebook.com/saferidetransportpk/" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FBBF24] hover:text-[#1E40AF] transition-all">
                <Facebook  className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/saferidetransportpk/" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FBBF24] hover:text-[#1E40AF] transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://wa.me/923014202944?text=Assalamu%20Alaikum%2C%20I%20am%20interested%20in%20SafeRide%20school%20transport." target="_blank" rel="noopener noreferrer"
                title="WhatsApp"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all">
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FBBF24]">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/"        className={linkClass('/')}>Home</Link></li>
              <li><Link to="/about"   className={linkClass('/about')}>About Us</Link></li>
              <li><Link to="/services" className={linkClass('/services')}>Services</Link></li>
              <li><Link to="/faq"     className={linkClass('/faq')}>FAQs</Link></li>
              <li><Link to="/contact" className={linkClass('/contact')}>Contact</Link></li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FBBF24]">Account</h3>
            <ul className="space-y-3">
              <li><Link to="/book"        className={linkClass('/book')}>Book Now</Link></li>
              <li><Link to="/login"       className={linkClass('/login')}>Parent Login</Link></li>
              <li><Link to="/admin-login" className={linkClass('/admin-login')}>Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#FBBF24]">Contact Us</h3>
            <div className="space-y-4">
              <a href="tel:+9203014202944" className="flex items-start gap-3 text-blue-200 hover:text-white transition-colors group">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#FBBF24]" />
                <span className="text-sm">+92 0301 4202944</span>
              </a>
              <a href="mailto:info@saferide.com.pk" className="flex items-start gap-3 text-blue-200 hover:text-white transition-colors group">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#FBBF24]" />
                <span className="text-sm">info@saferide.com.pk</span>
              </a>
              <div className="flex items-start gap-3 text-blue-200">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#FBBF24]" />
                <span className="text-sm">Lake City, Lahore, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-blue-300 text-sm">
          <p>&copy; {new Date().getFullYear()} SafeRide School Transport. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;