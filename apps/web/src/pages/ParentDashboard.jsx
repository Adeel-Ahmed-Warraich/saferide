import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { MapPin, CreditCard, Bell, Clock, User, AlertCircle, Info, Briefcase, PhoneCall, ClipboardList, XCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import ChangePasswordModal from '@/components/ChangePasswordModal.jsx';

const ParentDashboard = () => {
  const { currentUser } = useAuth();
  const [parentData, setParentData] = useState(null);
  const [latestPayment, setLatestPayment] = useState(null);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch parent profile
      try {
        const parent = await pb.collection('parents').getOne(currentUser.id, { $autoCancel: false });
        setParentData(parent);
      } catch (error) {
        console.error("Error fetching parent profile:", error?.status, error?.message);
        // Use auth data as fallback so dashboard still loads
        setParentData({
          id: currentUser.id,
          fullName: currentUser.name || currentUser.email || 'Parent',
          email: currentUser.email,
          childName: currentUser.childName || 'Your Child',
          childClass: currentUser.childClass || 'N/A',
          schoolName: currentUser.schoolName || 'N/A',
          homeAddress: currentUser.homeAddress || 'N/A',
          preferredShift: currentUser.preferredShift || 'Morning',
          enrollmentStatus: currentUser.enrollmentStatus || 'Active',
          phoneNumber: currentUser.phoneNumber || 'N/A',
        });
      }

      // Fetch latest payment
      try {
        const payments = await pb.collection('payments').getList(1, 1, {
          filter: `parentId="${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        if (payments.items.length > 0) setLatestPayment(payments.items[0]);
      } catch (error) {
        console.error("Error fetching payments:", error?.status, error?.message);
      }

      // Fetch other pending enrollments by email (siblings not yet approved)
      // Requires enrollments listRule to allow parents to read their own records
      try {
        const enrollRes = await pb.collection('enrollments').getList(1, 20, {
          filter: `email="${currentUser.email}"`,
          sort: '-created',
          $autoCancel: false
        });
        setPendingEnrollments(enrollRes.items);
      } catch (error) {
        // Rule may not be updated yet — fail silently
        console.warn("Could not fetch pending enrollments:", error?.message);
      }

      setLoading(false);
    };

    if (currentUser) fetchData();
  }, [currentUser]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E40AF]"></div></div>;
  if (!parentData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm">
        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-yellow-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-gray-500 text-sm mb-4">Your parent profile hasn't been set up yet. Please contact SafeRide admin to complete your account setup.</p>
        <a href="tel:+923001234567" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-800 text-white rounded-xl font-medium hover:bg-blue-900 transition-colors text-sm">
          Call Admin: +92 300 1234567
        </a>
      </div>
    </div>
  );

  const isOverdue = latestPayment?.status === 'Overdue';
  const feeAmount = latestPayment ? latestPayment.amount : 5000; // Dummy default if no payment record
  const dueDate = latestPayment ? new Date(latestPayment.dueDate).toLocaleDateString() : 'N/A';

  return (
    <>
      <Helmet><title>Dashboard - SafeRide</title></Helmet>
      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-3xl font-bold text-[#1E40AF]">Welcome, {parentData.fullName.split(' ')[0]}!</h1>
              <p className="text-gray-600 mt-1">Manage {parentData.childName}'s transport details</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`px-4 py-2 rounded-full font-semibold text-sm ${parentData.enrollmentStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                Status: {parentData.enrollmentStatus}
              </div>
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" /> Change Password
              </button>
            </div>
          </div>

          {isOverdue && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-bold">Payment Overdue</h3>
                <p className="text-red-700 text-sm">Your monthly fee is overdue. Please make a payment to avoid service interruption.</p>
              </div>
            </div>
          )}

          {/* Enrollment Status Banner — shown when not Active */}
          {parentData.enrollmentStatus === 'Pending' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl flex items-start gap-3">
              <ClipboardList className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm text-yellow-800">Enrollment Under Review</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-yellow-100 text-yellow-700">Pending</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Your enrollment for <strong>{parentData.childName}</strong> is being reviewed by the SafeRide team.
                  We will contact you on <strong>{parentData.phoneNumber}</strong> within 1–2 business days to confirm your seat.
                </p>
              </div>
            </div>
          )}

          {parentData.enrollmentStatus === 'Suspended' && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm text-red-800">Account Suspended</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700">Suspended</span>
                </div>
                <p className="text-sm text-red-700">
                  Your transport service has been suspended. This may be due to an outstanding payment or another issue.
                  Please contact SafeRide to resolve this.
                </p>
                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-red-700 hover:text-red-900 underline">
                  Contact us on WhatsApp →
                </a>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Child Details Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
              <h2 className="text-xl font-bold text-[#1E40AF] mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FBBF24]"/>
                Child Details
                <span className="ml-auto text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">✓ Active</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div><p className="text-sm text-gray-500">Name</p><p className="font-medium text-gray-900">{parentData.childName}</p></div>
                <div><p className="text-sm text-gray-500">Class</p><p className="font-medium text-gray-900">{parentData.childClass}</p></div>
                <div><p className="text-sm text-gray-500">School</p><p className="font-medium text-gray-900">{parentData.schoolName}</p></div>
                <div><p className="text-sm text-gray-500">Shift</p><p className="font-medium text-gray-900">{parentData.preferredShift}</p></div>
                <div className="sm:col-span-2"><p className="text-sm text-gray-500">Home Address</p><p className="font-medium text-gray-900">{parentData.homeAddress}</p></div>
              </div>
            </div>

            {/* Fee Status Card */}
            <div className="bg-[#1E40AF] text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-700 rounded-full opacity-50"></div>
              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-blue-100 mb-1">Current Month Fee</h2>
                <div className="text-4xl font-bold text-[#FBBF24] mb-2">Rs. {feeAmount}</div>
                <p className="text-sm text-blue-200 mb-4">Due Date: {dueDate}</p>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm mb-6">
                  Status: {latestPayment?.status || 'Pending'}
                </div>
              </div>
              <Link to="/payments" className="relative z-10">
                <Button className="w-full bg-[#FBBF24] hover:bg-yellow-500 text-[#1E40AF] font-bold">Pay Now</Button>
              </Link>
            </div>
          </div>

          {/* Approved Sibling Children */}
          {pendingEnrollments.filter(e => e.status === 'approved').length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Additional Children
                <span className="text-sm font-normal text-gray-500">({pendingEnrollments.filter(e => e.status === 'approved').length} active)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingEnrollments.filter(e => e.status === 'approved').map(enroll => (
                  <div key={enroll.id} className="bg-white border border-green-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-green-700" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{enroll.childName}</p>
                          <p className="text-xs text-gray-500">{enroll.childClass}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-green-100 text-green-700 flex-shrink-0">
                        ✓ Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400">School</p>
                        <p className="font-medium text-gray-800 text-xs">{enroll.schoolName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Shift</p>
                        <p className="font-medium text-gray-800 text-xs">{enroll.preferredShift}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Address</p>
                        <p className="font-medium text-gray-800 text-xs">{enroll.homeAddress}</p>
                      </div>
                    </div>
                    {enroll.specialInstructions && (
                      <div className="mt-3 bg-green-50 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Special Instructions</p>
                        <p className="text-xs text-gray-700 italic">{enroll.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending / Under Review Children */}
          {pendingEnrollments.filter(e => e.status !== 'approved').length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-yellow-500" />
                Other Registered Children
                <span className="text-sm font-normal text-gray-500">({pendingEnrollments.filter(e => e.status !== 'approved').length} pending review)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingEnrollments.filter(e => e.status !== 'approved').map(enroll => (
                  <div key={enroll.id} className="bg-white border border-yellow-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-yellow-700" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{enroll.childName}</p>
                          <p className="text-xs text-gray-500">{enroll.childClass}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-yellow-100 text-yellow-700 flex-shrink-0">
                        ⏳ Under Review
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400">School</p>
                        <p className="font-medium text-gray-800 text-xs">{enroll.schoolName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Shift</p>
                        <p className="font-medium text-gray-800 text-xs">{enroll.preferredShift}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Address</p>
                        <p className="font-medium text-gray-800 text-xs">{enroll.homeAddress}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Submitted</p>
                        <p className="font-medium text-gray-800 text-xs">{new Date(enroll.created).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {enroll.specialInstructions && (
                      <div className="mt-3 bg-yellow-50 rounded-lg p-2">
                        <p className="text-xs text-gray-400">Special Instructions</p>
                        <p className="text-xs text-gray-700 italic">{enroll.specialInstructions}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-3 border-t pt-2">
                      Our team will contact you at <strong>{enroll.contactNumber}</strong> once this enrollment is reviewed.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/van-tracking" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#1E40AF] hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100"><MapPin className="w-6 h-6 text-[#1E40AF]" /></div>
              <span className="font-medium text-gray-800">Track Van</span>
            </Link>
            <Link to="/payment-history" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#1E40AF] hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100"><CreditCard className="w-6 h-6 text-[#1E40AF]" /></div>
              <span className="font-medium text-gray-800">Payment History</span>
            </Link>
            <Link to="/notifications" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#1E40AF] hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100"><Bell className="w-6 h-6 text-[#1E40AF]" /></div>
              <span className="font-medium text-gray-800">Notifications</span>
            </Link>
            <button onClick={() => document.querySelector('.fixed.bottom-6.right-6')?.click()} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-[#1E40AF] hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100"><AlertCircle className="w-6 h-6 text-[#1E40AF]" /></div>
              <span className="font-medium text-gray-800">Support</span>
            </button>
          </div>

          {/* Learn More / Quick Links */}
          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">Learn More</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/about" className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-xl shadow-sm border border-blue-100 hover:shadow-md hover:-translate-y-1 transition-all flex items-center gap-4 group">
              <div className="w-10 h-10 bg-[#1E40AF] rounded-lg flex items-center justify-center text-white group-hover:bg-[#FBBF24] group-hover:text-[#1E40AF] transition-colors">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#1E40AF]">About Us</h3>
                <p className="text-xs text-gray-500 mt-1">Learn about our mission</p>
              </div>
            </Link>
            <Link to="/services" className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-xl shadow-sm border border-blue-100 hover:shadow-md hover:-translate-y-1 transition-all flex items-center gap-4 group">
              <div className="w-10 h-10 bg-[#1E40AF] rounded-lg flex items-center justify-center text-white group-hover:bg-[#FBBF24] group-hover:text-[#1E40AF] transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#1E40AF]">Our Services</h3>
                <p className="text-xs text-gray-500 mt-1">Explore transport options</p>
              </div>
            </Link>
            <Link to="/contact" className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-xl shadow-sm border border-blue-100 hover:shadow-md hover:-translate-y-1 transition-all flex items-center gap-4 group">
              <div className="w-10 h-10 bg-[#1E40AF] rounded-lg flex items-center justify-center text-white group-hover:bg-[#FBBF24] group-hover:text-[#1E40AF] transition-colors">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#1E40AF]">Contact Us</h3>
                <p className="text-xs text-gray-500 mt-1">Get in touch with support</p>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default ParentDashboard;