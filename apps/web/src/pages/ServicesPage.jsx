
import React from 'react';
import { Helmet } from 'react-helmet';
import { Clock, MapPin, Users, Shield, CheckCircle2, Sun, Moon, Star, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Link } from 'react-router-dom';


  
  const suzukiYellow1 = '/Japanese_mini_van_similar_t-0.jpg';
  const suzukiYellow2 = '/Suzuki_Every_school_van_in_Pakistan-0.jpg';
  const changanWhite = '/white_compact_Japanese_mini_va-0.jpg';
  const gpsTrackingImg = '/parent_holding_a_smartphone_showing_live_GPS_track-0.jpg';

  // ── Service Cards Data ────────────────────────────────────────────────────────
const services = [
  {
    tag:         'School Transport',
    tagColor:    'bg-blue-100 text-blue-700',
    icon:        Sun,
    iconBg:      'bg-blue-50',
    iconColor:   'text-blue-600',
    accentColor: 'border-blue-500',
    title:       'Morning School Pick & Drop',
    subtitle:    'Safe, on-time school transport — every morning',
    description: `Our flagship service is designed specifically for school-going children in Lake City and nearby areas. 
                  We pick up your child from your doorstep each morning and drop them safely at their school gate — 
                  on time, every day. In the afternoon, we bring them back home safely after school ends.`,
    image:       suzukiYellow1,
    timing: [
      { label: 'Morning Pickup',  value: '7:00 AM – 7:45 AM' },
      { label: 'School Drop-off', value: 'By 8:00 AM – 8:30 AM' },
      { label: 'Afternoon Return', value: '2:00 PM – 4:00 PM' },
      { label: 'Service Days',    value: 'Monday – Saturday' },
    ],
    features: [
      'Door-to-door pickup from your home',
      'Drop-off at school main gate',
      'Afternoon return from school',
      'GPS tracking throughout the journey',
      'Police-verified, trained driver',
      'Maximum 7–8 students per van',
    ],
    schools: 'Beacon House, The City School, Lahore Grammar School, Punjab Group, and other nearby schools within 4 km of Lake City.',
    cta: 'Enroll for School Service',
  },
  {
    tag:         'Academy Transport',
    tagColor:    'bg-amber-100 text-amber-700',
    icon:        Moon,
    iconBg:      'bg-amber-50',
    iconColor:   'text-amber-600',
    accentColor: 'border-amber-500',
    title:       'Evening Academy Pick & Drop',
    subtitle:    'Reliable evening transport for tuition & academies',
    description: `After school hours, many children attend tuition centres, coaching academies, or extra-curricular 
                  classes. Our dedicated evening service ensures your child reaches their academy on time and 
                  returns home safely — without you having to worry about arranging separate transport.`,
    image:       suzukiYellow2,
    timing: [
      { label: 'Evening Pickup',   value: '4:00 PM – 5:00 PM' },
      { label: 'Academy Drop-off', value: 'By 5:30 PM' },
      { label: 'Return from Academy', value: '7:00 PM – 8:30 PM' },
      { label: 'Service Days',     value: 'Monday – Saturday' },
    ],
    features: [
      'Pickup after school or from home',
      'Drop-off at tuition / academy gate',
      'Evening return to home',
      'Live GPS tracking for parents',
      'Safe, well-lit van interior',
      'Combined with school service (discounted)',
    ],
    schools: 'Allied School academies, Educators tuition centres, Skans, Kips, and other coaching academies in the Lake City area.',
    cta: 'Enroll for Academy Service',
  },
];

// ── Fleet Cards ───────────────────────────────────────────────────────────────
const fleet = [
  {
    name:        'Suzuki Every',
    description: 'Our primary school van — compact, comfortable, and easy for children to board. Ideal for narrow streets and residential areas.',
    image:       suzukiYellow1,
    seats:       '7–8 Students',
    features:    ['Daily sanitized', 'Seatbelts fitted', 'Child-safe doors'],
  },
  {
    name:        'Changan Karavan',
    description: 'Spacious and air-conditioned for longer routes or larger groups, without compromising on safety or comfort.',
    image:       changanWhite,
    seats:       '7–8 Students',
    features:    ['Air conditioned', 'Extra legroom', 'Regular safety audit'],
  },
];

// ── Why Choose Us ─────────────────────────────────────────────────────────────
const highlights = [
  { icon: Shield, label: 'Verified Drivers',    desc: 'Police verification + defensive driving training' },
  { icon: MapPin, label: 'GPS Tracked',         desc: 'Live location on your parent portal 24/7' },
  { icon: Users,  label: 'Limited Seats',       desc: 'Max 7–8 children — never overcrowded' },
  { icon: Clock,  label: 'Always On Time',      desc: 'Strict schedule — morning & evening' },
  { icon: Star,   label: 'Clean Vehicles',      desc: 'Daily sanitized before every shift' },
  { icon: Phone,  label: 'Always Reachable',    desc: 'Call or WhatsApp anytime for updates' },
];

// ── Component ─────────────────────────────────────────────────────────────────
const ServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>Our Services — SafeRide School & Academy Transport, Lake City Lahore</title>
        <meta
          name="description"
          content="SafeRide provides morning school pick & drop and evening academy transport services in Lake City, Lahore. GPS-tracked, police-verified drivers, limited seats."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">

        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] py-16 md:py-20 text-white text-center px-4">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
              🚌 Lake City, Lahore
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              School & Academy<br />Transport Services
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
              Morning transport for schools. Evening transport for academies. Safe, GPS-tracked, and always on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/book">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3 text-base shadow-lg">
                  Book Now — It's Free to Enroll
                </Button>
              </Link>
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3 text-base shadow-lg">
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* ── Two Main Services ── */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
            {services.map((svc, index) => {
              const Icon = svc.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 lg:gap-16 items-start`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="rounded-2xl overflow-hidden shadow-xl relative group">
                      <img
                        src={svc.image}
                        alt={svc.title}
                        className="w-full h-64 md:h-80 lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Timing Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
                        <div className="grid grid-cols-2 gap-2">
                          {svc.timing.map((t, i) => (
                            <div key={i} className="text-white">
                              <p className="text-xs text-white/60">{t.label}</p>
                              <p className="text-sm font-semibold">{t.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${svc.iconBg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${svc.iconColor}`} />
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${svc.tagColor}`}>
                        {svc.tag}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{svc.title}</h2>
                      <p className="text-base text-gray-500 font-medium">{svc.subtitle}</p>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">{svc.description}</p>

                    {/* Features */}
                    <div className={`border-l-4 ${svc.accentColor} pl-4 space-y-2`}>
                      {svc.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${svc.iconColor}`} />
                          {f}
                        </div>
                      ))}
                    </div>

                    {/* Schools served */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Schools / Academies Served</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{svc.schools}</p>
                    </div>

                    <Link to="/book">
                      <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-7 py-5 shadow-md hover:shadow-lg transition-all mt-2">
                        {svc.cta} →
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Combined Service Banner ── */}
        <section className="py-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              🎉 Special Offer
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Enroll for Both School & Academy Service
            </h2>
            <p className="text-blue-100 text-base mb-6 max-w-xl mx-auto">
              Parents who enroll their child for both the morning school and evening academy service receive a discounted monthly rate. Contact us to find out your combined fee.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/book">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3">
                  Enroll Now
                </Button>
              </Link>
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3">
                  Ask About Combined Rate
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* ── Our Fleet ── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Fleet</h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto">
                Well-maintained, GPS-equipped vans — cleaned and inspected before every shift.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {fleet.map((van, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="h-52 overflow-hidden">
                    <img src={van.image} alt={van.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{van.name}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
                        {van.seats}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{van.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {van.features.map((f, fi) => (
                        <span key={fi} className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Service Highlights Grid ── */}
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Parents Choose SafeRide</h2>
              <p className="text-gray-500 text-base max-w-lg mx-auto">Every feature is designed with your child's safety and your peace of mind in mind.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow flex items-start gap-4">
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{h.label}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 bg-[#FBBF24]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Enroll Your Child?
            </h2>
            <p className="text-gray-800 text-lg mb-8 max-w-xl mx-auto">
              Enrollment is free. Fill in the form and our team will confirm your seat within 1–2 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book">
                <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                  Book a Seat Now
                </Button>
              </Link>
              <Link to="/faq">
                <Button variant="outline" className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-10 py-6 text-lg transition-all">
                  Read FAQ First
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default ServicesPage;