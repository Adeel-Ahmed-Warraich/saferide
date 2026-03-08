import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNotifications } from '@/contexts/NotificationContext.jsx';
import { Button } from '@/components/ui/button.jsx';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isParent, logout, currentUser } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const publicLinks = [
    { name: 'Home',     path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact',  path: '/contact' },
  ];

  const parentDashLinks = [
    { name: 'Dashboard',      path: '/dashboard' },
    { name: 'Track Van',      path: '/van-tracking' },
    { name: 'Payments',       path: '/payments' },
    { name: 'Notifications',  path: '/notifications', badge: unreadCount },
  ];

  const linkClass = (path) =>
    `relative font-medium transition-colors text-sm ${
      isActive(path) ? 'text-[#1E40AF]' : 'text-gray-600 hover:text-[#1E40AF]'
    }`;

  const mobileLinkClass = (path) =>
    `block py-3 px-3 rounded-lg font-medium text-sm transition-colors ${
      isActive(path)
        ? 'bg-blue-50 text-[#1E40AF] font-semibold'
        : 'text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <header className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="SafeRide School Transport"
              className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform group-hover:scale-105"
            />
            <div className="ml-2 hidden sm:block">
              <div className="text-lg font-extrabold text-[#1E40AF] leading-tight tracking-tight">
                Safe<span className="text-[#FBBF24]">Ride</span>
              </div>
              <div className="text-xs text-gray-500 font-medium -mt-0.5">School Transport</div>
              <div className="text-xs text-gray-500 font-medium -mt-0.5 italic">Your Child's Safety, Our Priority</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {publicLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`${linkClass(link.path)} px-3 py-2 rounded-lg hover:bg-gray-50`}>
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-[#1E40AF] rounded-full" />
                )}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200">
                <Link to="/book">
                  <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-4 shadow-sm">
                    Book Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="sm" variant="outline" className="border-[#1E40AF] text-[#1E40AF] hover:bg-blue-50 font-medium px-4">
                    Parent Login
                  </Button>
                </Link>
                <Link to="/admin-login" className="text-xs text-gray-400 hover:text-gray-600 ml-1">
                  Admin
                </Link>
              </div>
            )}

            {isAuthenticated && isParent && (
              <div className="flex items-center gap-1 ml-3 pl-3 border-l border-gray-200">
                {parentDashLinks.map(l => (
                  <Link key={l.path} to={l.path} className={`${linkClass(l.path)} px-3 py-2 rounded-lg hover:bg-gray-50 relative`}>
                    {l.name}
                    {l.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                        {l.badge > 9 ? '9+' : l.badge}
                      </span>
                    )}
                  </Link>
                ))}
                <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-1">
                  <LogOut className="w-4 h-4 mr-1.5" /> Logout
                </Button>
              </div>
            )}

            {isAuthenticated && isAdmin && (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200">
                <Link to="/admin">
                  <Button size="sm" className="bg-blue-800 hover:bg-blue-900 text-white px-4">
                    Admin Panel
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-1.5" /> Logout
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-3 border-t border-gray-100 bg-white absolute w-full left-0 px-4 shadow-xl">
            <div className="flex flex-col space-y-1 pb-4">
              {publicLinks.map((link) => (
                <Link key={link.path} to={link.path} className={mobileLinkClass(link.path)}>
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-gray-100 pt-2 mt-2">
                {!isAuthenticated && (
                  <>
                    <Link to="/book" className={`${mobileLinkClass('/book')} bg-yellow-50 text-blue-900 font-bold`}>
                      📋 Book Now
                    </Link>
                    <Link to="/login" className={mobileLinkClass('/login')}>Parent Login</Link>
                    <Link to="/admin-login" className={mobileLinkClass('/admin-login')}>Admin Login</Link>
                  </>
                )}

                {isAuthenticated && isParent && (
                  <>
                    {parentDashLinks.map(l => (
                      <Link key={l.path} to={l.path} className={`${mobileLinkClass(l.path)} relative`}>
                        {l.name}
                        {l.badge > 0 && (
                          <span className="absolute top-2 right-3 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {l.badge > 9 ? '9+' : l.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                    <button onClick={handleLogout} className="flex items-center py-3 px-3 text-red-600 font-medium w-full text-left hover:bg-red-50 rounded-lg text-sm">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </>
                )}

                {isAuthenticated && isAdmin && (
                  <>
                    <Link to="/admin" className={mobileLinkClass('/admin')}>Admin Panel</Link>
                    <button onClick={handleLogout} className="flex items-center py-3 px-3 text-red-600 font-medium w-full text-left hover:bg-red-50 rounded-lg text-sm">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;