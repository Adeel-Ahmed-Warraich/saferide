
import React from 'react';
import { Helmet } from 'react-helmet';
import { Clock, MapPin, Users, DollarSign, Calendar, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const suzukiYellow1 = 'https://horizons-cdn.hostinger.com/d8f47466-a099-49c5-abf3-3dbc56b09153/fe08b6c5a97435f5709308f3c15873ff.jpg';
  const suzukiYellow2 = 'https://horizons-cdn.hostinger.com/d8f47466-a099-49c5-abf3-3dbc56b09153/409dd103546d3f8131829eafeab2c463.jpg';
  const changanWhite = 'https://horizons-cdn.hostinger.com/d8f47466-a099-49c5-abf3-3dbc56b09153/8c16c985500a5fe2d242333e2c1e0e48.jpg';
  const gpsTrackingImg = 'https://horizons-cdn.hostinger.com/d8f47466-a099-49c5-abf3-3dbc56b09153/d8f47466-a099-49c5-abf3-3dbc56b09153/b79913b805417d9f61abd79016889246.png';

  const mainServices = [
    {
      title: 'Morning Pick & Drop Service',
      description: 'We utilize well-maintained, comfortable vehicles like the Suzuki Every to ensure a smooth morning ride. Our limited seating policy guarantees that every child has a secure seat without overcrowding.',
      image: suzukiYellow1,
      features: ['Comfortable Seating', 'Daily Sanitization', 'Strict Maintenance Schedule'],
    },
    {
      title: 'Afternoon Return Service',
      description: 'Reliable afternoon pickups to bring your children safely back home. Our fleet is operated by highly trained professionals who undergo rigorous background checks and police verification.',
      image: suzukiYellow2,
      features: ['Police Verified Drivers', 'Defensive Driving Trained', 'Child-Friendly Approach'],
    },
    {
      title: 'Spacious Fleet Options',
      description: 'For larger groups or specific routes, we offer spacious Changan Karavan vans. These vehicles provide extra room while maintaining our strict safety and comfort standards.',
      image: changanWhite,
      features: ['Spacious Interiors', 'Air Conditioned', 'Regular Safety Audits'],
    },
    {
      title: 'Real-Time GPS Tracking',
      description: 'Peace of mind is paramount. Our vehicles are equipped with advanced GPS systems, allowing you to monitor the journey in real-time and receive instant notifications upon arrival.',
      image: gpsTrackingImg,
      features: ['Live Location Updates', 'Arrival Notifications', 'Route Optimization'],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Our Services - SafeRide School Transport</title>
        <meta
          name="description"
          content="Explore SafeRide's school transport services: safe vehicles, professional drivers, real-time tracking, and affordable monthly packages in Lake City, Lahore."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary to-primary-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Services
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive school transport solutions designed for your child's safety and your peace of mind
            </p>
          </div>
        </section>

        {/* Detailed Services Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
            {mainServices.map((service, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl relative group">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-64 md:h-80 lg:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 space-y-6">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                    {service.title}
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3 pt-4">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-gray-700 font-medium">
                        <CheckCircle2 className="w-6 h-6 text-accent mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Features Grid */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Service Highlights</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Flexible Shifts</h3>
                <p className="text-gray-500 mt-2">Morning & Afternoon</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Door-to-Door</h3>
                <p className="text-gray-500 mt-2">Convenient Pickups</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Limited Seats</h3>
                <p className="text-gray-500 mt-2">Max 7-8 Students</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Monthly Plans</h3>
                <p className="text-gray-500 mt-2">Hassle-free Billing</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
              Book your child's seat today and experience the SafeRide difference.
            </p>
            <Link to="/booking">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-dark text-white font-bold px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Book Now
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </>
  );
};

export default ServicesPage;
