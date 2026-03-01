import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MinusCircle, Bot, Loader2 } from 'lucide-react';

const SYSTEM_PROMPT = `You are SafeRide Assistant, a helpful and friendly customer service chatbot for SafeRide — a school transport service in Lake City, Lahore, Pakistan.

Key information about SafeRide:
- Service: School pick & drop for children in Lake City area and nearby schools within ~4 km
- Morning shift: 7:00 AM – 8:30 AM | Afternoon shift: 2:00 PM – 4:00 PM
- Vehicles: Suzuki Every vans and Changan Karavan; limited seats (7-8 students max)
- Drivers: Police-verified, background-checked, defensively trained
- Features: GPS real-time tracking, parent dashboard, push notifications
- Payments: Easypaisa, JazzCash, Bank Deposit via the parent dashboard
- Monthly fees vary by distance; parents can check their dashboard
- Contact: +92 300 1234567 | info@saferide.com.pk | WhatsApp: wa.me/923001234567
- To enroll: Visit /book or click "Book Now" on the website
- Parent login: /login | Password reset: /password-reset

Guidelines:
- Be warm, concise, and professional
- Answer only what's relevant to SafeRide services
- For emergencies, always provide the phone number: +92 300 1234567
- If you can't answer, suggest calling or WhatsApp
- Keep replies short (2-4 sentences max)
- Respond in English; if user writes in Urdu, respond in Urdu`;

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm the SafeRide AI Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isMinimized]);

  const callClaudeAPI = async (conversationHistory) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: conversationHistory,
      }),
    });

    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    return data.content[0]?.text || "I'm sorry, I couldn't process that. Please call us at +92 300 1234567.";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setIsLoading(true);

    try {
      // Build conversation history for Claude (skip the initial greeting)
      const history = messages
        .slice(1) // skip welcome message
        .map(m => ({ role: m.isBot ? 'assistant' : 'user', content: m.text }));
      history.push({ role: 'user', content: userMsg });

      const reply = await callClaudeAPI(history);
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        text: "I'm having trouble connecting right now. Please call us at +92 300 1234567 or WhatsApp us for immediate help.",
        isBot: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (text) => {
    // Convert WhatsApp links
    const waRegex = /(wa\.me\/\d+|https?:\/\/wa\.me\/\d+)/g;
    const phoneRegex = /(\+92\s?\d{3}\s?\d{7})/g;

    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/(wa\.me\/\d+|https?:\/\/wa\.me\/\d+|\+92\s?\d{3}\s?\d{7})/g).map((part, j) => {
          if (waRegex.test(part) || part.startsWith('wa.me')) {
            return <a key={j} href={`https://wa.me/923001234567`} target="_blank" rel="noopener noreferrer" className="underline font-bold text-yellow-400">WhatsApp us</a>;
          }
          if (phoneRegex.test(part)) {
            return <a key={j} href={`tel:${part.replace(/\s/g, '')}`} className="underline font-bold text-yellow-400">{part}</a>;
          }
          return part;
        })}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-800 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-900 transition-transform hover:scale-110 z-50 group"
        title="Chat with SafeRide AI"
      >
        <MessageCircle className="w-7 h-7 group-hover:hidden" />
        <Bot className="w-7 h-7 hidden group-hover:block" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className={`fixed right-6 z-50 transition-all duration-300 ease-in-out ${isMinimized ? 'bottom-6 h-14 w-72' : 'bottom-6 h-[500px] w-80 sm:w-96'} bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-4 flex justify-between items-center cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-blue-800"></span>
          </div>
          <div>
            <span className="font-semibold text-sm">SafeRide AI Assistant</span>
            <p className="text-xs text-blue-300">Powered by Claude</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="hover:text-gray-300 transition-colors p-1">
            <MinusCircle className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:text-gray-300 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <>
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} items-end gap-2`}>
                {msg.isBot && (
                  <div className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center flex-shrink-0 mb-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.isBot
                    ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                    : 'bg-blue-800 text-white rounded-tr-none'
                }`}>
                  {msg.isBot ? renderMessage(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 bg-gray-50 flex gap-2 overflow-x-auto scrollbar-hide">
              {['Service hours?', 'How to enroll?', 'Payment methods?', 'GPS tracking?'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="flex-shrink-0 text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-full px-3 py-1.5 transition-colors font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about SafeRide..."
                disabled={isLoading}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotWidget;
