import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const ConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [enrollment, setEnrollment] = useState(location.state?.enrollment || null);
  const [loading, setLoading] = useState(!enrollment);

  useEffect(() => {
    if (!enrollment && id) {
      pb.collection('enrollments')
        .getOne(id, { $autoCancel: false })
        .then(setEnrollment)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, enrollment]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Enrollment not found</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Enrollment Confirmed - SafeRide School Transport</title>
      </Helmet>

      <section className="py-16 bg-gray-50 flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Enrollment Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for choosing SafeRide. We have received your enrollment request.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Enrollment Details</h2>
              <div className="space-y-3 text-gray-700">
                {[
                  ['Parent Name', enrollment.parentName],
                  ['Contact', enrollment.contactNumber],
                  ['Email', enrollment.email],
                  ['Child Name', enrollment.childName],
                  ['Class', enrollment.childClass],
                  ['School', enrollment.schoolName],
                  ['Preferred Shift', enrollment.preferredShift],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b pb-2">
                    <span className="font-medium">{label}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <p className="text-gray-700 leading-relaxed">
                <strong>What's Next?</strong><br />
                Our team will review your enrollment and contact you within 24–48 hours. You will also receive a confirmation email at <strong>{enrollment.email}</strong>.
              </p>
            </div>

            <Link to="/">
              <Button size="lg" className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-6 text-lg rounded-xl">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConfirmationPage;
