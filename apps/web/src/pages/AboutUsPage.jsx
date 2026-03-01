
import React from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Eye, Heart, Users, Star } from 'lucide-react';

const AboutUsPage = () => {
  const suzukiYellow1 = 'https://horizons-cdn.hostinger.com/d8f47466-a099-49c5-abf3-3dbc56b09153/fe08b6c5a97435f5709308f3c15873ff.jpg';
  const suzukiYellow2 = 'https://horizons-cdn.hostinger.com/d8f47466-a099-49c5-abf3-3dbc56b09153/409dd103546d3f8131829eafeab2c463.jpg';
  const changanWhite = 'https://horizons-cdn.hostinger.com/d8f47466-a099-49c5-abf3-3dbc56b09153/8c16c985500a5fe2d242333e2c1e0e48.jpg';

  const safetyFeatures = [
    {
      icon: Eye,
      title: 'Real-time GPS Monitoring',
      description: 'Every journey is tracked with advanced GPS technology, allowing parents to monitor their child\'s location in real-time and receive instant notifications.',
    },
    {
      icon: Shield,
      title: 'Professional Trained Driver',
      description: 'Our drivers undergo rigorous background checks, police verification, and specialized training in child safety and defensive driving techniques.',
    },
    {
      icon: Heart,
      title: 'Cleanliness & Hygiene Policy',
      description: 'We maintain the highest standards of vehicle cleanliness with daily sanitization, regular deep cleaning, and strict hygiene protocols.',
    },
    {
      icon: Users,
      title: 'Transparent Communication',
      description: 'Direct communication channels with parents ensure you\'re always informed about your child\'s journey, any delays, or important updates.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - SafeRide School Transport</title>
        <meta
          name="description"
          content="Learn about SafeRide's mission to provide the safest, most reliable school transport service in Lake City, Lahore. Our commitment to your child's safety comes first."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">

        {/* Hero Section */}
        <section className="relative py-24 md:py-32 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${changanWhite})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/80"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              About SafeRide
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
              Building trust through safety, reliability, and care in our local community
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <div className="space-y-4 text-base md:text-lg text-gray-700 leading-relaxed">
                  <p>
                    At SafeRide, we understand that your child's safety is your top priority – and it's ours too. We're not just a transport service; we're a community of parents, caregivers, and professionals dedicated to ensuring every child reaches school and home safely, comfortably, and on time.
                  </p>
                  <p>
                    Founded with a simple yet powerful vision: to give parents peace of mind while their children are on the road. We believe that every parent deserves to know their child is in safe hands, traveling in a clean, well-maintained vehicle with a trusted, professional driver.
                  </p>
                  <p>
                    Our safety-first approach means we never compromise on quality. From GPS tracking to police-verified drivers, from limited seating to transparent communication – every decision we make is guided by one question: "Is this the safest option for the children in our care?"
                  </p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl relative group h-64 md:h-96 lg:h-auto">
                <img
                  src={suzukiYellow1}
                  alt="SafeRide Suzuki Every school transport vehicle"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:p-8">
                  <p className="text-white font-medium text-base md:text-lg">Professional, clean, and secure interiors for every journey.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Community Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Pakistani Families
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                We take pride in being a reliable partner for parents in our community.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-2/5 h-56 sm:h-auto">
                  <img 
                    src={suzukiYellow2} 
                    alt="SafeRide Suzuki Every Van" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-8 sm:w-3/5 flex flex-col justify-center">
                  <div className="flex text-accent mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-gray-700 italic mb-4 text-sm md:text-base">
                    "SafeRide has completely changed our mornings. I no longer worry about how my kids will get to school. The drivers are polite and the vans are always clean."
                  </p>
                  <p className="font-semibold text-gray-900">- Ayesha M., Lake City</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-2/5 h-56 sm:h-auto">
                  <img 
                    src={changanWhite} 
                    alt="SafeRide Changan Karavan" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-8 sm:w-3/5 flex flex-col justify-center">
                  <div className="flex text-accent mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <p className="text-gray-700 italic mb-4 text-sm md:text-base">
                    "The GPS tracking feature is a lifesaver. I can see exactly when they are dropped off. Highly recommend their service to any parent."
                  </p>
                  <p className="font-semibold text-gray-900">- Usman R., Lahore</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Features */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Safety Commitment
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Every aspect of our service is designed with your child's safety and well-being in mind.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {safetyFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-gray-100"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Your Trust is Our Greatest Responsibility
            </h2>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              We know that choosing a school transport service means placing your trust in us with your most precious treasure. That's a responsibility we take seriously every single day. Thank you for considering SafeRide – we're honored to be part of your child's daily journey.
            </p>
          </div>
        </section>

      </div>
    </>
  );
};

export default AboutUsPage;
