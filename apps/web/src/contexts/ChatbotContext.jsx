/**
 * saferide/web/src/contexts/ChatbotContext.jsx
 *
 * FIX #9 — replaces the DOM query hack in ParentDashboard with a proper
 * context-based open trigger. ChatbotWidget reads this context to expose
 * its open() function; ParentDashboard calls openChatbot() cleanly.
 *
 * USAGE:
 *  1. Wrap <App> (or just the relevant tree) in <ChatbotProvider>.
 *  2. In ChatbotWidget: call setChatbotOpener(setIsOpen) on mount.
 *  3. In ParentDashboard: call openChatbot() instead of the DOM querySelector.
 */

import React, { createContext, useContext, useRef } from 'react';

const ChatbotContext = createContext(null);

export const useChatbot = () => useContext(ChatbotContext);

export const ChatbotProvider = ({ children }) => {
  // Stores a reference to ChatbotWidget's setIsOpen function
  const openerRef = useRef(null);

  const setChatbotOpener = (fn) => { openerRef.current = fn; };
  const openChatbot      = ()   => { if (openerRef.current) openerRef.current(true); };

  return (
    <ChatbotContext.Provider value={{ setChatbotOpener, openChatbot }}>
      {children}
    </ChatbotContext.Provider>
  );
};