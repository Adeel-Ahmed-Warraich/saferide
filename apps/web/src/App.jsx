import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { NotificationProvider } from '@/contexts/NotificationContext.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ChatbotWidget from '@/components/ChatbotWidget.jsx';
import { Toaster } from '@/components/ui/toaster.jsx';

// Pages
import HomePage from '@/pages/HomePage.jsx';
import AboutUsPage from '@/pages/AboutUsPage.jsx';
import ServicesPage from '@/pages/ServicesPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import BookingPage from '@/pages/BookingPage.jsx';
import ConfirmationPage from '@/pages/ConfirmationPage.jsx';
import ParentLoginPage from '@/pages/ParentLoginPage.jsx';
import AdminLoginPage from '@/pages/AdminLoginPage.jsx';
import PasswordConfirmPage from '@/pages/PasswordConfirmPage.jsx';
import PasswordResetPage from '@/pages/PasswordResetPage.jsx';
import ParentDashboard from '@/pages/ParentDashboard.jsx';
import PaymentPage from '@/pages/PaymentPage.jsx';
import PaymentHistoryPage from '@/pages/PaymentHistoryPage.jsx';
import NotificationsPage from '@/pages/NotificationsPage.jsx';
import VanTrackingPage from '@/pages/VanTrackingPage.jsx';
import AccountingPage from '@/pages/AccountingPage.jsx';
import AdminDashboard from '@/pages/AdminDashboard.jsx';
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage.jsx";
import TermsOfServicePage from "@/pages/TermsofServicePage.jsx";
import FAQPage from "@/pages/FAQPage";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/book" element={<BookingPage />} />
              {/* Fix: also support /booking route used in ServicesPage CTA */}
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/confirmation/:id" element={<ConfirmationPage />} />
              <Route path="/login" element={<ParentLoginPage />} />
              {/* Fix: /parent-login alias used in HomePage */}
              <Route path="/parent-login" element={<ParentLoginPage />} />
              {/* Fix: /parent-signup alias used in HomePage & LoginPage */}
              <Route path="/parent-signup" element={<BookingPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/password-reset" element={<PasswordResetPage />} />
              <Route path="/password-confirm" element={<PasswordConfirmPage />} />
               <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route
                path="/terms-of-service"
                element={<TermsOfServicePage />}
              />
              <Route path="/faq" element={<FAQPage />} />

              {/* Protected Parent Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
              {/* Fix: /parent-dashboard alias used in LoginPage redirect */}
              <Route path="/parent-dashboard" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/payment-history" element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/van-tracking" element={<ProtectedRoute><VanTrackingPage /></ProtectedRoute>} />

              {/* Protected Admin Route */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/accounting" element={<ProtectedRoute requireAdmin={true}><AccountingPage /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ChatbotWidget />
        <Toaster />
      </Router>
    </NotificationProvider>
    </AuthProvider>
  );
}

export default App;