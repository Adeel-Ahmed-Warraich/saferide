import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Phone, Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { useToast } from '@/hooks/use-toast.js';

const ContactPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pb.collection('contact_messages').create(formData, { $autoCancel: false });
      toast({
        title: 'Message Sent Successfully!',
        description: 'We will get back to you within 24 hours.',
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — SafeRide School Transport, Lake City Lahore</title>
        <meta name="description" content="Contact SafeRide School Transport in Lake City, Lahore. Call, WhatsApp, or email us. We're here to answer your questions about school van service." />
      </Helmet>

      <div className="min-h-screen flex flex-col">

        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#2563eb] text-white py-12 px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            We're here to answer your questions and help you get started with SafeRide.
          </p>
        </section>

        <section className="py-12 bg-gray-50 flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

              {/* Left — Contact Info + Map */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                  <div className="space-y-5">

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Phone</h3>
                        <a href="tel:+923001234567" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                          +92 300 XXXXXXX
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Email</h3>
                        <a href="mailto:info@saferide.com.pk" className="text-gray-600 text-sm hover:text-blue-600 transition-colors">
                          info@saferide.com.pk
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Location</h3>
                        <p className="text-gray-600 text-sm">Lake City, Raiwind Road</p>
                        <p className="text-gray-500 text-xs">Lahore, Punjab, Pakistan</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-0.5">Working Hours</h3>
                        <p className="text-gray-600 text-sm">Monday – Saturday</p>
                        <p className="text-gray-500 text-xs">7:00 AM – 5:00 PM</p>
                      </div>
                    </div>

                    <a
                      href="https://wa.me/923001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block pt-1"
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base font-semibold shadow-sm hover:shadow-md transition-all">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Chat on WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Map — Lake City, Lahore real coordinates */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-800">Lake City, Lahore</span>
                    <a
                      href="https://maps.google.com/?q=Lake+City+Lahore+Pakistan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-xs text-blue-600 hover:underline"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13621.562!2d74.3244!3d31.3775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391900027f6b8b3f%3A0x8adeef69286e3ff6!2sLake%20City%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    width="100%"
                    height="300"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SafeRide Location — Lake City, Lahore"
                  />
                </div>
              </div>

              {/* Right — Contact Form */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-500 text-sm mb-6">We typically respond within 24 hours on business days.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Ahmed Ali"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. ahmed@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g. 0300 1234567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Your Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="mt-1.5"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-6 text-base font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    By submitting, you agree that SafeRide may contact you regarding your inquiry.
                  </p>
                </form>
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;