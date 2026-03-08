
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { MapPin, Shield, Clock, CreditCard, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>SafeRide - School Transport in Lake City, Lahore</title>
        <meta name="description" content="Safe, Reliable School Transport in Lake City, Lahore. GPS Tracking, Verified Drivers, Affordable Pricing." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-white">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/parent_holding_a_smartphone_showing_live_GPS_track-0.jpg" 
              alt="School Transport Van" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80 mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/50 backdrop-blur-sm">
              <span className="text-yellow-300 font-semibold tracking-wide text-sm uppercase">Now Enrolling for {new Date().getFullYear()}</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
              Safe, Reliable <br className="hidden md:block" />
              <span className="text-yellow-400">School Transport</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto font-light drop-shadow-md">
              Serving Lake City, Lahore with GPS-tracked vans, verified drivers, and real-time updates for your peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book">
                <Button size="lg" className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-8 py-6 text-lg shadow-xl hover:scale-105 transition-transform rounded-xl">
                  Book Now
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg backdrop-blur-md shadow-xl hover:scale-105 transition-transform rounded-xl">
                  Parent Login
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Why Choose SafeRide?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">We prioritize your child's safety above all else, providing a service you can trust every single day.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: MapPin, title: 'GPS Tracking', desc: 'Real-time location tracking via your parent dashboard.' },
                { icon: Shield, title: 'Verified Drivers', desc: 'Strict background checks and police verification for all staff.' },
                { icon: Clock, title: 'Real-time Updates', desc: 'Instant notifications for pickups, drop-offs, and delays.' },
                { icon: CreditCard, title: 'Affordable Pricing', desc: 'Transparent monthly fees with easy online payment options.' },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center group">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                    <feature.icon className="w-8 h-8 text-blue-800" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-blue-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-10 md:p-16 text-white flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-400">Service Details</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-400" /> Service Hours
                      </h3>
                      <p className="text-blue-100 ml-7">Morning: 7:00 AM - 8:30 AM</p>
                      <p className="text-blue-100 ml-7">Afternoon: 2:00 PM - 4:00 PM</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-yellow-400" /> Coverage Area
                      </h3>
                      <p className="text-blue-100 ml-7">Lake City and nearby schools within a 4 km radius.</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-yellow-400" /> Contact Us
                      </h3>
                      <p className="text-blue-100 ml-7">+92 03014202944</p>
                      <p className="text-blue-100 ml-7 flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" /> info@saferide.com.pk
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-900 p-10 md:p-16 flex items-center justify-center">
                   <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-4">Ready to secure a seat?</h3>
                      <p className="text-blue-200 mb-8">Spaces are limited to ensure comfort and safety.</p>
                      <Link to="/book">
                        <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-10 py-6 text-lg rounded-xl w-full sm:w-auto">
                          Start Enrollment
                        </Button>
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
