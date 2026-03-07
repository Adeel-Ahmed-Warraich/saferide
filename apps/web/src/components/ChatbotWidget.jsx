/**
 * ChatbotWidget.jsx — SafeRide FAQ Chatbot
 *
 * Zero API calls. Pure keyword-matching against the existing FAQ data.
 * Drop-in replacement for the Anthropic-powered ChatbotWidget.
 * Uses the same useChatbot() context so existing opener buttons still work.
 *
 * Replace: web/src/components/ChatbotWidget.jsx
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useChatbot } from '@/contexts/ChatbotContext.jsx';
import { X, MessageCircle, Send, ChevronDown, Bot, User, Phone } from 'lucide-react';

// ─── Full FAQ knowledge base (mirrors FAQPage.jsx) ────────────────────────────
const KB = [
  // General
  { keywords: ['what is saferide', 'about saferide', 'who are you', 'what do you do', 'tell me about'],
    answer: "SafeRide is a professional school transport service based in Lake City, Lahore 🚐. We provide safe, GPS-tracked van service for school children with police-verified drivers and a dedicated parent portal." },

  { keywords: ['area', 'areas', 'location', 'serve', 'coverage', 'nearby', 'where', 'zone'],
    answer: "We currently serve Lake City and nearby schools within approximately 4 km of the area. Not sure if you're covered? Contact us at +92 300 XXXXXXX and we'll confirm!" },

  { keywords: ['hours', 'time', 'shift', 'morning', 'afternoon', 'timing', 'schedule', 'when'],
    answer: "We run two shifts:\n• 🌅 Morning: 7:00 AM – 8:30 AM (school drop-off)\n• 🌆 Afternoon: 2:00 PM – 4:00 PM (school pick-up)\nYou can choose one or both shifts." },

  { keywords: ['vehicle', 'van', 'car', 'suzuki', 'changan', 'transport', 'bus'],
    answer: "We operate Suzuki Every vans and Changan Karavan vehicles 🚐. Each is GPS-tracked, regularly cleaned, and limited to 7–8 students for comfort and safety." },

  { keywords: ['contact', 'phone', 'call', 'whatsapp', 'email', 'reach', 'support', 'help'],
    answer: "You can reach us:\n📞 Phone / WhatsApp: +92 300 XXXXXXX\n📧 Email: support@saferide.com.pk\n🌐 saferide.com.pk/contact\n\nWe respond within 24 hours on business days." },

  // Enrollment
  { keywords: ['enroll', 'register', 'sign up', 'apply', 'join', 'book', 'start', 'how to'],
    answer: "Enrollment is easy! 🎉\n1. Visit saferide.com.pk/book\n2. Fill in your child's details, shift, school & address\n3. Submit — we'll review within 1–2 business days\n4. You'll get a welcome email with your parent portal login." },

  { keywords: ['registration fee', 'security deposit', 'joining fee', 'one time'],
    answer: "There may be a one-time registration or security deposit at enrollment. Our team will inform you of all charges when confirming your application." },

  { keywords: ['approval', 'how long', 'wait', 'process', 'review'],
    answer: "We typically approve enrollment applications within 1–2 business days ⏱️. You'll receive a welcome email with login credentials once approved." },

  { keywords: ['two children', 'multiple children', 'siblings', 'sibling', 'more than one', 'second child', 'two kids', 'both children'],
    answer: "Yes! You can enroll multiple children 👨‍👩‍👧‍👦. Submit a separate enrollment form for each child, or contact us and we'll help register siblings together. Each child gets their own fee and van assignment." },

  { keywords: ['waitlist', 'wait list', 'not covered', 'not available', 'expand'],
    answer: "If your area isn't covered yet, we'll add you to our waitlist. As we expand routes, we'll notify you as soon as service reaches your area." },

  // Payments
  { keywords: ['cost', 'fee', 'price', 'charge', 'how much', 'monthly', 'rate', 'amount'],
    answer: "Monthly fees vary by distance and shift 💳. After enrollment approval, your exact fee will be visible in your parent portal dashboard. Contact us for an estimate based on your address." },

  { keywords: ['pay', 'payment', 'easypaisa', 'jazzcash', 'bank', 'transfer', 'deposit', 'how to pay'],
    answer: "You can pay through your parent portal at saferide.com.pk/payments 💳. We accept:\n• Easypaisa\n• JazzCash\n• Bank Deposit\n\nSimply log in, select your method, and follow the instructions." },

  { keywords: ['due date', 'when to pay', 'deadline', 'first', 'days of'],
    answer: "Monthly fees are due within the first 5 days of each month 📅. You'll receive a reminder notification in the parent portal and via WhatsApp before the due date." },

  { keywords: ['late', 'penalty', 'fine', 'overdue', 'late payment'],
    answer: "A late payment fine may apply if the fee isn't paid by the due date. If you're having difficulty, please contact us — we'll do our best to accommodate you 🤝." },

  { keywords: ['receipt', 'invoice', 'voucher', 'proof', 'history'],
    answer: "Yes! Every confirmed payment generates a receipt 🧾. View and download it from your parent portal under Payment History at saferide.com.pk/payment-history." },

  { keywords: ['pending', 'still pending', 'not confirmed', 'not approved', 'payment pending', 'stuck'],
    answer: "Payments are reviewed within a few hours on business days ⏳. If your payment is pending for more than 24 hours, contact us with your transaction ID and we'll resolve it promptly." },

  // GPS / Tracking
  { keywords: ['track', 'gps', 'location', 'live', 'map', 'where is the van', 'real time'],
    answer: "Log in to your parent portal and go to Van Tracking 📍. You'll see the real-time location of your child's van, driver info, and estimated arrival time." },

  { keywords: ['tracking available', '24/7', 'always on', 'outside hours'],
    answer: "Van tracking is active during service hours:\n🌅 Morning: 7:00 AM – 8:30 AM\n🌆 Afternoon: 2:00 PM – 4:00 PM\nOutside these times the van is off duty." },

  { keywords: ['late', 'delay', 'van late', 'not arrived', 'running late'],
    answer: "You'll receive a notification for significant delays 🔔. Check the live map in your parent portal for the current location. For urgent matters, WhatsApp us at +92 300 XXXXXXX." },

  { keywords: ['nearby', 'approaching', 'notification', 'alert', 'coming'],
    answer: "Yes! The system sends a notification when your child's van is approaching your stop 🔔. Make sure notifications are enabled in your parent portal settings." },

  { keywords: ['missed', 'miss the van', 'missed the van', 'left behind'],
    answer: "If your child misses the van, contact the driver or call us immediately at +92 300 XXXXXXX 📞. Don't let your child wait alone — our team will advise on the best course of action." },

  // Safety
  { keywords: ['driver', 'drivers', 'police', 'verified', 'background', 'trained', 'safe', 'vetting'],
    answer: "All SafeRide drivers undergo:\n✅ Police verification\n✅ Identity background checks\n✅ Defensive driving training\n\nWe take your children's safety with the utmost seriousness." },

  { keywords: ['capacity', 'how many', 'students', 'seats', 'overcrowd'],
    answer: "Each van carries a maximum of 7–8 students 🪑. We never overload our vehicles — this ensures comfort, visibility, and safety for every child." },

  { keywords: ['insured', 'insurance', 'accident', 'covered'],
    answer: "Yes, all SafeRide vehicles are comprehensively insured 🛡️. In the unlikely event of an incident, parents are notified immediately and all necessary steps are taken." },

  { keywords: ['clean', 'hygiene', 'sanitize', 'sanitized', 'cleanliness'],
    answer: "Our vehicles are cleaned and sanitized daily before each shift 🧹. We conduct regular deep cleaning to maintain a healthy environment for all students." },

  { keywords: ['emergency', 'incident', 'accident', 'crisis', 'problem'],
    answer: "In any emergency:\n1. The driver contacts our operations team immediately\n2. Parents are notified without delay\n3. Emergency services are called if required 🚨\n\nSafety is always our first priority." },

  { keywords: ['speak to driver', 'driver number', 'driver contact', 'call driver'],
    answer: "Driver contact details are in your parent portal under Van Tracking 📱. Please avoid calling the driver while the van is moving. For routine matters, use the portal or contact our support team." },

  // Portal / Login
  { keywords: ['login', 'portal', 'dashboard', 'account', 'log in', 'password', 'forgot', 'reset'],
    answer: "Your parent portal is at saferide.com.pk/login 🔐. Use the email and password from your welcome email. To reset your password, click 'Forgot Password' on the login page." },

  { keywords: ['notification', 'notifications', 'alert', 'reminder', 'bell'],
    answer: "Notifications appear in your parent portal under the Notifications section 🔔. We send fee reminders, payment confirmations, van delays, and broadcast messages from admin." },
];

// ─── Suggested quick questions ────────────────────────────────────────────────
const SUGGESTIONS = [
  "How do I enroll my child?",
  "How do I pay the fee?",
  "How do I track the van?",
  "What shifts are available?",
  "Are drivers verified?",
  "What if the van is late?",
];

// ─── Greeting messages ────────────────────────────────────────────────────────
const GREETINGS = [
  "hi", "hello", "hey", "salam", "assalam", "aoa", "good morning", "good afternoon",
];

const THANKS = ["thank", "thanks", "shukriya", "شکریہ", "jazakallah", "great", "ok", "okay", "got it"];

// ─── Matching engine ──────────────────────────────────────────────────────────
function findAnswer(input) {
  const q = input.toLowerCase().trim();

  if (GREETINGS.some(g => q.includes(g))) {
    return "Hello! 👋 I'm the SafeRide support assistant. I can answer questions about enrollment, fees, van tracking, safety, and more. What would you like to know?";
  }
  if (THANKS.some(t => q.includes(t))) {
    return "You're welcome! 😊 Is there anything else I can help you with? You can also reach our team at +92 300 XXXXXXX or support@saferide.com.pk.";
  }

  // Score each KB entry
  let best = null;
  let bestScore = 0;

  for (const entry of KB) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) {
        score += kw.split(' ').length; // longer phrase match = higher score
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore > 0) return best.answer;

  return "I'm not sure about that 🤔. For this question, please contact our team directly:\n📞 WhatsApp: +92 300 XXXXXXX\n📧 support@saferide.com.pk\n\nOr browse our full FAQ at saferide.com.pk/faq";
}

// ─── Message bubble ───────────────────────────────────────────────────────────
const Bubble = ({ msg }) => {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex items-end gap-2 mb-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${isBot ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-600'}`}>
        {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
      </div>
      {/* Bubble */}
      <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${
        isBot
          ? 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
          : 'bg-blue-800 text-white rounded-br-sm'
      }`}>
        {msg.text}
      </div>
    </div>
  );
};

// ─── Typing indicator ─────────────────────────────────────────────────────────
const Typing = () => (
  <div className="flex items-end gap-2 mb-3">
    <div className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center flex-shrink-0">
      <Bot className="w-3.5 h-3.5 text-white" />
    </div>
    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  </div>
);

// ─── Main Widget ──────────────────────────────────────────────────────────────
const ChatbotWidget = () => {
  const { setChatbotOpener } = useChatbot();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: "👋 Hi! I'm SafeRide's support assistant.\n\nI can help with enrollment, fees, van tracking, safety, and more — instantly, no waiting.\n\nWhat can I help you with today?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Register opener with context
  useEffect(() => {
    if (setChatbotOpener) setChatbotOpener(() => () => setIsOpen(true));
  }, [setChatbotOpener, setIsOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = useCallback((text) => {
    const userText = (text || input).trim();
    if (!userText) return;

    setInput('');
    setShowSuggestions(false);
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }]);
    setTyping(true);

    // Simulate brief thinking delay for naturalness
    setTimeout(() => {
      const answer = findAnswer(userText);
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: answer }]);
    }, 600 + Math.random() * 400);
  }, [input]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-800 hover:bg-blue-900 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
        aria-label="Open support chat"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" title="Online" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
      style={{ height: '520px' }}>

      {/* Header */}
      <div className="bg-blue-800 text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-tight">SafeRide Assistant</p>
          <p className="text-xs text-blue-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
            Always available · Instant answers
          </p>
        </div>
        <button onClick={() => setIsOpen(false)}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
          aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-3 py-4">
        {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
        {typing && <Typing />}

        {/* Suggestion chips — shown only initially */}
        {showSuggestions && !typing && (
          <div className="mt-2 mb-1">
            <p className="text-xs text-gray-400 mb-2 px-1">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-full hover:bg-blue-50 hover:border-blue-400 transition-colors shadow-sm font-medium">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp shortcut */}
      <div className="bg-white border-t border-gray-100 px-3 py-2 flex-shrink-0">
        <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-green-600 transition-colors w-fit">
          <Phone className="w-3 h-3" />
          Speak to a human on WhatsApp
        </a>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-3 py-3 flex items-center gap-2 flex-shrink-0">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your question…"
          className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:border-blue-400 focus:bg-white transition-colors"
          disabled={typing}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || typing}
          className="w-9 h-9 bg-blue-800 hover:bg-blue-900 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Send">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatbotWidget;