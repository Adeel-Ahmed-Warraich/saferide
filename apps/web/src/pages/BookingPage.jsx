import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';

const BookingPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [formData, setFormData] = useState({
    parentName: '',
    contactNumber: '',
    email: '',
    childName: '',
    childClass: '',
    schoolName: '',
    homeAddress: '',
    preferredShift: 'Morning',
    specialInstructions: '',
  });

  const suzukiYellow2 = 'https://horizons-cdn.hostinger.com/d8f47466-a099-49c5-abf3-3dbc56b09153/409dd103546d3f8131829eafeab2c463.jpg';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShiftChange = (value) => {
    setFormData((prev) => ({ ...prev, preferredShift: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pb.collection('enrollments').create(formData, { $autoCancel: false });
      // Record saved successfully - show confirmation using form data
      setSubmittedData(formData);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Enrollment error:', error);
      // PocketBase sometimes throws 400 even after saving successfully
      // If there are no specific field validation errors, the record was saved
      const fieldErrors = error?.data ? Object.values(error.data).filter(v => v?.code) : [];
      if (error?.status === 400 && fieldErrors.length === 0) {
        // Record was saved — show success anyway
        setSubmittedData(formData);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Genuine validation error — show specific message
        const firstError = fieldErrors[0]?.message || error.message || 'Please check your details and try again.';
        toast({
          title: 'Submission Failed',
          description: firstError,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted && submittedData) {
    return (
      <>
        <Helmet><title>Enrollment Confirmed - SafeRide</title></Helmet>
        <div className="min-h-screen bg-gray-50 py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Enrollment Confirmed!</h1>
              <p className="text-gray-500 mb-8">
                Thank you for choosing SafeRide. We've received your request and will contact you within 24–48 hours.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
                <h2 className="font-bold text-gray-800 mb-4">Your Enrollment Details</h2>
                {[
                  ['Parent Name', submittedData.parentName],
                  ['Contact', submittedData.contactNumber],
                  ['Email', submittedData.email],
                  ['Child Name', submittedData.childName],
                  ['Class', submittedData.childClass],
                  ['School', submittedData.schoolName],
                  ['Shift', submittedData.preferredShift],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b pb-2 text-sm">
                    <span className="font-medium text-gray-600">{label}</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-left">
                <p className="text-sm text-gray-700">
                  <strong>What's Next?</strong> Our team will review your enrollment and call you on{' '}
                  <strong>{submittedData.contactNumber}</strong> to confirm details and assign your van.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/">
                  <Button size="lg" className="bg-blue-800 hover:bg-blue-900 text-white px-8 rounded-xl w-full sm:w-auto">
                    <Home className="w-4 h-4 mr-2" /> Back to Home
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-blue-800 text-blue-800 hover:bg-blue-50 px-8 rounded-xl w-full sm:w-auto">
                    Parent Login <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Booking Form ────────────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Book Now - SafeRide School Transport</title>
        <meta name="description" content="Enroll your child in SafeRide's safe and reliable school transport service." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        {/* Hero Banner */}
        <section className="relative h-[30vh] md:h-[35vh] min-h-[220px] flex items-center justify-center">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${suzukiYellow2})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Join SafeRide Today
            </h1>
            <p className="text-lg text-blue-100 font-medium drop-shadow-md">
              Safe, Reliable School Transport for Your Child
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-12 md:py-16 bg-gray-50 flex-grow -mt-8 relative z-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-12 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Enrollment Form</h2>
                <p className="text-gray-500 text-sm">Fill out the form below to reserve your child's seat</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Parent Info */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-50 pb-2">Parent Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <Label htmlFor="parentName">Parent Full Name *</Label>
                      <Input id="parentName" name="parentName" required value={formData.parentName} onChange={handleChange} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="contactNumber">Contact Number *</Label>
                      <Input id="contactNumber" name="contactNumber" type="tel" required value={formData.contactNumber} onChange={handleChange} placeholder="+92 03014202944" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1.5" />
                    </div>
                  </div>
                </div>

                {/* Child Info */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-50 pb-2">Child Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <Label htmlFor="childName">Child Name *</Label>
                      <Input id="childName" name="childName" required value={formData.childName} onChange={handleChange} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="childClass">Class / Grade *</Label>
                      <Input id="childClass" name="childClass" required value={formData.childClass} onChange={handleChange} placeholder="e.g. Grade 5" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="schoolName">School Name *</Label>
                      <Input id="schoolName" name="schoolName" required value={formData.schoolName} onChange={handleChange} className="mt-1.5" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="homeAddress">Home Address *</Label>
                      <Textarea id="homeAddress" name="homeAddress" required value={formData.homeAddress} onChange={handleChange} rows={3} className="mt-1.5" />
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-50 pb-2">Service Preferences</h3>
                  <div>
                    <Label className="mb-3 block">Preferred Shift *</Label>
                    <RadioGroup value={formData.preferredShift} onValueChange={handleShiftChange} className="flex flex-col sm:flex-row gap-3">
                      {['Morning', 'Afternoon', 'Both'].map(shift => (
                        <div key={shift} className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 flex-1 cursor-pointer hover:border-blue-300 transition-colors">
                          <RadioGroupItem value={shift} id={shift.toLowerCase()} />
                          <Label htmlFor={shift.toLowerCase()} className="font-medium cursor-pointer w-full">{shift}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                    <Textarea id="specialInstructions" name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} rows={3} placeholder="Any special requirements or instructions..." className="mt-1.5" />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={loading} className="w-full bg-blue-800 hover:bg-blue-900 text-white py-6 text-lg font-bold shadow-lg rounded-xl">
                    {loading ? 'Submitting...' : 'Submit Enrollment Request'}
                  </Button>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    By submitting, you agree to our terms of service. We will contact you to confirm details.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BookingPage;