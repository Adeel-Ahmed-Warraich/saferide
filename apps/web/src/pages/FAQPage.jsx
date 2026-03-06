import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ChevronDown, Search, BookOpen, CreditCard, MapPin, Shield, HelpCircle, MessageCircle, Phone } from 'lucide-react';



const faqs = [
  {
    category: 'General / About SafeRide',
    icon: HelpCircle,
    color: 'blue',
    questions: [
      {
        q: `What is SafeRide?`,
        a: `SafeRide is a professional school transport service based in Lake City, Lahore. We provide safe, reliable, and GPS-tracked van service for school children, with police-verified drivers and a dedicated parent portal to track every journey.`
      },
      {
        q: `Which areas do you serve?`,
        a: `We currently serve Lake City and nearby schools within approximately 4 km of the area. If you are unsure whether your location is covered, please contact us and we will confirm your eligibility.`
      },
      {
        q: `What are your service hours?`,
        a: `We operate two shifts: Morning shift from 7:00 AM to 8:30 AM (school drop-off), and Afternoon shift from 2:00 PM to 4:00 PM (school pick-up). Both shifts are available depending on your school's timings.`
      },
      {
        q: `What types of vehicles do you use?`,
        a: `We operate Suzuki Every vans and Changan Karavan vehicles. Each van is well-maintained, clean, and fitted with GPS tracking. Seating is limited to 7–8 students per van to ensure comfort and safety.`
      },
      {
        q: `How do I contact SafeRide?`,
        a: `You can reach us via phone or WhatsApp at +92 300 XXXXXXX, by email at support@saferide.com.pk, or through the contact form on our website at saferide.com.pk/contact. We typically respond within 24 hours on business days.`
      },
    ]
  },
  {
    category: 'Enrollment & Registration',
    icon: BookOpen,
    color: 'indigo',
    questions: [
      {
        q: `How do I enroll my child?`,
        a: `Enrollment is simple. Visit saferide.com.pk/book, fill in the enrollment form with your child's details, preferred shift, school name, and home address, then submit. Our team will review your application within 1–2 business days and contact you to confirm.`
      },
      {
        q: `Is there a registration fee?`,
        a: `There may be a one-time registration or security deposit applicable at the time of enrollment. Our team will inform you of all applicable charges when confirming your application.`
      },
      {
        q: `How long does the approval process take?`,
        a: `We typically review and approve enrollment applications within 1–2 business days. Once approved, you will receive a welcome email with your parent portal login credentials.`
      },
      {
        q: `Can I enroll more than one child?`,
        a: `Yes, you can enroll multiple children. Please submit a separate enrollment form for each child, or contact us directly and we will assist you in registering siblings together.`
      },
      {
        q: `Can I choose Morning or Afternoon shift only?`,
        a: `Yes, you can select either Morning shift only, Afternoon shift only, or both. Simply indicate your preference in the enrollment form. You can also request to change your shift later by contacting our team.`
      },
      {
        q: `What happens if my area is not currently covered?`,
        a: `If your area is not currently served, we will add you to our waitlist. As we expand our routes, we will notify you as soon as service becomes available in your area.`
      },
    ]
  },
  {
    category: 'Payments & Fees',
    icon: CreditCard,
    color: 'emerald',
    questions: [
      {
        q: `How much does the service cost?`,
        a: `Monthly fees vary based on your distance from the school and the shift selected. After your enrollment is approved, your assigned fee will be visible in your parent portal dashboard.`
      },
      {
        q: `How do I pay the monthly fee?`,
        a: `You can pay through your parent portal at saferide.com.pk/payments. We accept Easypaisa, JazzCash, and bank deposit. Simply log in, select your payment method, and follow the instructions.`
      },
      {
        q: `When is the fee due each month?`,
        a: `Monthly fees are due within the first 5 days of each month. You will receive a reminder notification through the parent portal and via WhatsApp before the due date.`
      },
      {
        q: `Is there a late payment penalty?`,
        a: `A late payment fine may apply if the fee is not paid by the due date. Please contact us if you are facing any difficulty making a timely payment and we will do our best to accommodate you.`
      },
      {
        q: `Can I get a receipt for my payment?`,
        a: `Yes. Every confirmed payment generates a receipt which you can view and download from your parent portal under Payment History (saferide.com.pk/payment-history).`
      },
      {
        q: `What if I paid but my payment is still showing as pending?`,
        a: `Payments are reviewed by our team before being confirmed, typically within a few hours on business days. If your payment remains pending for more than 24 hours, please contact us with your transaction ID and we will resolve it promptly.`
      },
    ]
  },
  {
    category: 'Van & GPS Tracking',
    icon: MapPin,
    color: 'amber',
    questions: [
      {
        q: `How do I track my child's van?`,
        a: `Log in to your parent portal at saferide.com.pk/login and go to Van Tracking. You will see the real-time location of your child's van on the map, along with driver information and estimated arrival time.`
      },
      {
        q: `Is the tracking available 24/7?`,
        a: `Van tracking is active during service hours — during the Morning shift (7:00 AM – 8:30 AM) and Afternoon shift (2:00 PM – 4:00 PM). Outside of these times the van is not in operation.`
      },
      {
        q: `What if the van is running late?`,
        a: `You will receive a notification through the parent portal if there is a significant delay. You can also check the live map to see the current van location. For urgent matters, contact our team directly on WhatsApp.`
      },
      {
        q: `Will I be notified when the van is nearby?`,
        a: `Yes, the system sends a notification when your child's van is approaching your stop. Make sure notifications are enabled in your parent portal settings to receive these alerts.`
      },
      {
        q: `What do I do if my child misses the van?`,
        a: `Contact the driver or call our team immediately at +92 300 XXXXXXX. Do not let your child wait alone. Our team will advise on the best course of action depending on the situation.`
      },
    ]
  },
  {
    category: 'Safety & Drivers',
    icon: Shield,
    color: 'rose',
    questions: [
      {
        q: `How are your drivers vetted?`,
        a: `All SafeRide drivers undergo thorough police verification, identity background checks, and defensive driving training before being assigned to any route. We take the safety of your children with the utmost seriousness.`
      },
      {
        q: `How many children are allowed per van?`,
        a: `Each van carries a maximum of 7 to 8 students to ensure comfort, visibility, and safety. We do not overload our vehicles under any circumstances.`
      },
      {
        q: `Are the vehicles insured?`,
        a: `Yes, all SafeRide vehicles are comprehensively insured. In the unlikely event of an accident or incident, you will be notified immediately and all necessary steps will be taken to ensure your child's safety.`
      },
      {
        q: `What hygiene standards do you follow?`,
        a: `Our vehicles are cleaned and sanitized daily before each shift. We follow a strict cleanliness policy and conduct regular deep cleaning to maintain a healthy environment for all students.`
      },
      {
        q: `What happens in case of an emergency?`,
        a: `Our drivers are trained to handle emergencies calmly. In case of any incident, the driver contacts our operations team immediately, parents are notified without delay, and emergency services are called if required. Safety is always our first priority.`
      },
      {
        q: `Can I speak with the driver directly?`,
        a: `Driver contact details are available in your parent portal under Van Tracking. However, please avoid calling the driver while the van is in motion. For routine communication, please use the parent portal or contact our support team.`
      },
    ]
  },
];

const colorMap = {
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',   icon: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500'   },
  indigo:  { bg: 'bg-indigo-50',  border: 'border-indigo-200', icon: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200',icon: 'text-emerald-600',badge: 'bg-emerald-100 text-emerald-700',dot: 'bg-emerald-500'},
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',  icon: 'text-amber-600',  badge: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500'  },
  rose:    { bg: 'bg-rose-50',    border: 'border-rose-200',   icon: 'text-rose-600',   badge: 'bg-rose-100 text-rose-700',    dot: 'bg-rose-500'   },
};

const AccordionItem = ({ question, answer, isOpen, onToggle, color }) => {
  const c = colorMap[color];
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? `${c.border} shadow-sm` : 'border-gray-100 hover:border-gray-200'}`}>
      <button
        onClick={onToggle}
        className={`w-full text-left px-5 py-4 flex items-start justify-between gap-4 transition-colors duration-200 ${isOpen ? c.bg : 'bg-white hover:bg-gray-50'}`}
      >
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 mt-2 ${isOpen ? c.dot : 'bg-gray-300'}`} />
          <span className={`text-sm font-semibold leading-relaxed ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
            {question}
          </span>
        </div>
        <ChevronDown className={`flex-shrink-0 w-4 h-4 mt-0.5 transition-transform duration-300 ${isOpen ? `rotate-180 ${c.icon}` : 'text-gray-400'}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-5 pb-5 pt-1 bg-white">
          <div className="pl-5 border-l-2 border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const [openItem, setOpenItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const totalQuestions = faqs.reduce((sum, cat) => sum + cat.questions.length, 0);

  const filtered = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(item =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat =>
    (activeCategory === 'all' || cat.category === activeCategory) &&
    cat.questions.length > 0
  );

  const handleToggle = (key) => setOpenItem(openItem === key ? null : key);

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions — SafeRide School Transport</title>
        <meta name="description" content="Find answers to common questions about SafeRide school transport service — enrollment, payments, GPS tracking, safety, and more." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Centre
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Frequently Asked<br />
            <span className="text-blue-200">Questions</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
            Everything you need to know about SafeRide School Transport. Can&apos;t find your answer? We&apos;re here to help.
          </p>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 max-w-lg mx-auto shadow-lg shadow-blue-900/20">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setActiveCategory('all'); }}
              className="flex-1 text-gray-800 text-sm outline-none placeholder-gray-400 bg-transparent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
            )}
          </div>
          <p className="text-blue-200 text-xs mt-3">{totalQuestions} questions across {faqs.length} categories</p>
        </div>
      </section>

      {/* Category Pills */}
      {!searchQuery && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                All Categories
              </button>
              {faqs.map(cat => {
                const c = colorMap[cat.color];
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.category}
                    onClick={() => setActiveCategory(cat.category)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat.category ? `${c.badge} shadow-sm` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.category.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-500 text-sm">Try different keywords or browse all categories.</p>
            <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-600 text-sm font-medium hover:underline">Clear search</button>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map((cat) => {
              const Icon = cat.icon;
              const c = colorMap[cat.color];
              return (
                <div key={cat.category}>
                  {/* Category Header */}
                  <div className={`flex items-center gap-3 mb-4 pb-3 border-b ${c.border}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.bg} ${c.border} border`}>
                      <Icon className={`w-4.5 h-4.5 ${c.icon}`} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">{cat.category}</h2>
                      <p className="text-xs text-gray-400">{cat.questions.length} {cat.questions.length !== 1 ? 'questions' : 'question'}</p>
                    </div>
                    <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>
                      {cat.questions.length}
                    </span>
                  </div>

                  {/* Questions */}
                  <div className="space-y-2">
                    {cat.questions.map((item, idx) => {
                      const key = `${cat.category}-${idx}`;
                      return (
                        <AccordionItem
                          key={key}
                          question={item.q}
                          answer={item.a}
                          isOpen={openItem === key}
                          onToggle={() => handleToggle(key)}
                          color={cat.color}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Still Need Help */}
        <div className="mt-16 bg-gradient-to-br from-gray-50 to-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Our team is available Monday to Saturday. We typically respond within a few hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Send a Message
            </a>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-4 h-4 text-green-600" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;