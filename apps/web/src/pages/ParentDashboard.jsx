import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import {
  MapPin, CreditCard, Bell, Clock, User, AlertCircle, Info,
  Briefcase, PhoneCall, ClipboardList, XCircle, CheckCircle2,
  KeyRound, Truck, TrendingUp, Calendar, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import ChangePasswordModal from '@/components/ChangePasswordModal.jsx';
import { useChatbot } from '@/contexts/ChatbotContext.jsx';

// ─── Fee Voucher Card — one per child ────────────────────────────────────────
const ChildFeeCard = ({ child, assignment, payments }) => {
  // Find the most recent pending/overdue payment for this child
  const latestPending = payments
    .filter(p => {
      const label = (p.childLabel || '').trim();
      if (child.isSecondary) return label === child.childName;
      return !label || label === child.childName;
    })
    .filter(p => ['Pending','Overdue','PendingAdminApproval'].includes(p.status))
    .sort((a, b) => new Date(b.created) - new Date(a.created))[0];

  const lastPaid = payments
    .filter(p => {
      const label = (p.childLabel || '').trim();
      if (child.isSecondary) return label === child.childName;
      return !label || label === child.childName;
    })
    .filter(p => p.status === 'Paid')
    .sort((a, b) => new Date(b.created) - new Date(a.created))[0];

  const monthlyFee = assignment?.monthlyFee || 0;
  const isOverdue  = latestPending?.status === 'Overdue' ||
    (latestPending?.dueDate && new Date(latestPending.dueDate) < new Date());

  const statusConfig = {
    PendingAdminApproval: { label: 'Under Verification', bg: 'bg-blue-100',   text: 'text-blue-800',  icon: '🔍' },
    Pending:              { label: 'Unpaid',              bg: 'bg-yellow-100', text: 'text-yellow-800',icon: '⏳' },
    Overdue:              { label: 'OVERDUE',             bg: 'bg-red-100',    text: 'text-red-800',   icon: '🚨' },
    Paid:                 { label: 'Paid',                bg: 'bg-green-100',  text: 'text-green-800', icon: '✅' },
  };

  const st = latestPending
    ? (statusConfig[latestPending.status] || statusConfig.Pending)
    : lastPaid
      ? statusConfig.Paid
      : { label: 'No Voucher', bg: 'bg-gray-100', text: 'text-gray-600', icon: '📋' };

  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${isOverdue ? 'border-red-300' : child.isSecondary ? 'border-purple-200' : 'border-blue-200'}`}>
      {/* Card header */}
      <div className={`px-5 py-3 flex items-center justify-between ${isOverdue ? 'bg-red-600' : child.isSecondary ? 'bg-purple-700' : 'bg-blue-800'} text-white`}>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 opacity-80" />
          <span className="font-bold text-sm">{child.childName}</span>
          <span className="text-xs opacity-70">({child.childClass})</span>
          {child.isSecondary && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Sibling</span>}
        </div>
        <span className="text-xs opacity-80">{child.schoolName}</span>
      </div>

      {/* Card body */}
      <div className="bg-white p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Monthly Fee</p>
            <p className="text-2xl font-black text-gray-900">
              Rs. {Number(monthlyFee || latestPending?.amount || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Payment Status</p>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${st.bg} ${st.text}`}>
              {st.icon} {st.label}
            </span>
          </div>
          {assignment && (
            <>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Van</p>
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  {assignment.vanId || 'Assigned'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Shift</p>
                <p className="font-semibold text-gray-800">{assignment.shift || '—'}</p>
              </div>
            </>
          )}
          {latestPending?.dueDate && (
            <div className="col-span-2">
              <p className="text-xs text-gray-500 mb-0.5">Due Date</p>
              <p className={`font-semibold text-sm flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                <Calendar className="w-3.5 h-3.5" />
                {new Date(latestPending.dueDate).toLocaleDateString('en-PK', { day: '2-digit', month: 'long', year: 'numeric' })}
                {isOverdue && ' ⚠️ OVERDUE'}
              </p>
            </div>
          )}
          {latestPending?.voucherNumber && (
            <div className="col-span-2">
              <p className="text-xs text-gray-500 mb-0.5">Voucher #</p>
              <p className="font-mono text-sm text-blue-700 font-semibold">{latestPending.voucherNumber}</p>
            </div>
          )}
        </div>

        {/* Fee history — collapsed summary */}
        {lastPaid && (
          <p className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg mb-3 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Last paid: Rs. {Number(lastPaid.amount).toLocaleString()} — {lastPaid.month || new Date(lastPaid.created).toLocaleDateString('en-PK')}
          </p>
        )}

        <Link to="/payments">
          <Button className={`w-full text-sm font-bold ${isOverdue ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-800 hover:bg-blue-900'} text-white`}>
            {latestPending ? (isOverdue ? '⚠️ Pay Overdue Fee Now' : '💳 Pay Fee Now') : '📋 View Payment History'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const ParentDashboard = () => {
  const { openChatbot } = useChatbot();
  const { currentUser } = useAuth();
  const [parentData,          setParentData]          = useState(null);
  const [payments,            setPayments]            = useState([]);
  const [assignments,         setAssignments]         = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [pendingEnrollments,  setPendingEnrollments]  = useState([]);
  const [showChangePassword,  setShowChangePassword]  = useState(false);
  const [loading,             setLoading]             = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      try {
        const [parent, paymentsRes, assignRes, enrollRes] = await Promise.all([
          pb.collection('parents').getOne(currentUser.id, { $autoCancel: false }).catch(() => null),
          pb.collection('payments').getList(1, 200, {
            filter: `parentId = "${currentUser.id}"`, sort: '-created', $autoCancel: false,
          }).catch(() => ({ items: [] })),
          pb.collection('assignments').getList(1, 20, {
            filter: `parentId = "${currentUser.id}" && status = "Active"`, $autoCancel: false,
          }).catch(() => ({ items: [] })),
          pb.collection('enrollments').getList(1, 20, {
            filter: `email = "${currentUser.email}"`, sort: '-created', $autoCancel: false,
          }).catch(() => ({ items: [] })),
        ]);

        setParentData(parent || {
          id: currentUser.id, fullName: currentUser.name || 'Parent',
          email: currentUser.email, childName: 'Your Child',
          childClass: '', schoolName: '', enrollmentStatus: 'Active',
        });
        setPayments(paymentsRes.items);
        setAssignments(assignRes.items);
        setApprovedEnrollments(enrollRes.items.filter(e => e.status === 'approved'));
        setPendingEnrollments(enrollRes.items.filter(e => e.status !== 'approved' && e.status !== 'rejected'));
      } catch (err) {
        console.error('[SR] ParentDashboard fetchData:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800" />
    </div>
  );

  if (!parentData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border max-w-sm">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="font-bold text-gray-900 mb-2">Profile Not Found</h2>
        <p className="text-gray-500 text-sm">Please contact SafeRide admin to complete your account setup.</p>
      </div>
    </div>
  );

  // Build list of all children to show fee cards for
  const primaryAssignment = assignments.find(a => !a.childLabel || a.childLabel === parentData.childName);
  const allChildren = [
    {
      childName: parentData.childName,
      childClass: parentData.childClass,
      schoolName: parentData.schoolName,
      isSecondary: false,
      assignment: primaryAssignment,
    },
    // Sibling assignments
    ...assignments
      .filter(a => a.childLabel && a.childLabel !== parentData.childName)
      .map(a => {
        const enroll = approvedEnrollments.find(e => e.childName === a.childLabel);
        return {
          childName:   a.childLabel,
          childClass:  enroll?.childClass  || '',
          schoolName:  enroll?.schoolName  || '',
          isSecondary: true,
          assignment:  a,
        };
      }),
  ];

  // Overdue banner
  const hasOverdue = payments.some(p => p.status === 'Overdue' ||
    (p.dueDate && new Date(p.dueDate) < new Date() && ['Pending','PendingAdminApproval'].includes(p.status)));
  const hasPendingApproval = payments.some(p => p.status === 'PendingAdminApproval');

  return (
    <>
      <Helmet><title>Dashboard - SafeRide</title></Helmet>
      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-2xl font-black text-blue-900">
                Welcome, {(parentData.fullName || '').split(' ')[0]}! 👋
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                {allChildren.length === 1
                  ? `Managing ${parentData.childName}'s transport`
                  : `Managing ${allChildren.length} children's transport`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${parentData.enrollmentStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {parentData.enrollmentStatus === 'Active' ? '✓ Active' : parentData.enrollmentStatus}
              </span>
              <button onClick={() => setShowChangePassword(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700 transition-colors">
                <KeyRound className="w-3.5 h-3.5" /> Change Password
              </button>
            </div>
          </div>

          {/* Alert banners */}
          {hasOverdue && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-bold text-sm">Fee Overdue</h3>
                <p className="text-red-700 text-xs mt-0.5">One or more fee payments are overdue. Please pay immediately to avoid service suspension.</p>
              </div>
            </div>
          )}
          {hasPendingApproval && !hasOverdue && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-blue-800 font-bold text-sm">Payment Under Verification</h3>
                <p className="text-blue-700 text-xs mt-0.5">Your payment receipt has been submitted and is being verified by SafeRide admin.</p>
              </div>
            </div>
          )}
          {parentData.enrollmentStatus === 'Suspended' && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-bold text-sm">Account Suspended</h3>
                <p className="text-red-700 text-xs mt-0.5">Your transport service has been suspended. Please contact SafeRide to resolve.</p>
                <a href="https://wa.me/9203014202944" target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold text-red-700 hover:text-red-900 underline mt-1 inline-block">
                  WhatsApp us →
                </a>
              </div>
            </div>
          )}

          {/* Per-child fee cards */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Fee Overview
              <span className="text-sm font-normal text-gray-400">({allChildren.length} {allChildren.length === 1 ? 'child' : 'children'})</span>
            </h2>
            <div className={`grid gap-4 ${allChildren.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-md'}`}>
              {allChildren.map((child, idx) => (
                <ChildFeeCard key={idx} child={child} assignment={child.assignment} payments={payments} />
              ))}
            </div>
          </div>

          {/* Child / Transport Details */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Child Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary child */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{parentData.childName}</p>
                    <p className="text-xs text-gray-500">{parentData.childClass}</p>
                  </div>
                  <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Primary</span>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div><p className="text-xs text-gray-400">School</p><p className="font-medium text-gray-800">{parentData.schoolName}</p></div>
                  <div><p className="text-xs text-gray-400">Shift</p><p className="font-medium text-gray-800">{parentData.preferredShift || '—'}</p></div>
                  <div className="col-span-2"><p className="text-xs text-gray-400">Address</p><p className="font-medium text-gray-800 text-xs">{parentData.homeAddress || '—'}</p></div>
                </div>
              </div>

              {/* Sibling cards from approved enrollments */}
              {approvedEnrollments.map(enroll => (
                <div key={enroll.id} className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{enroll.childName}</p>
                      <p className="text-xs text-gray-500">{enroll.childClass}</p>
                    </div>
                    <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Sibling</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div><p className="text-xs text-gray-400">School</p><p className="font-medium text-gray-800">{enroll.schoolName}</p></div>
                    <div><p className="text-xs text-gray-400">Shift</p><p className="font-medium text-gray-800">{enroll.preferredShift}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending enrollments */}
          {pendingEnrollments.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <h3 className="font-bold text-yellow-800 text-sm flex items-center gap-2 mb-2">
                <ClipboardList className="w-4 h-4" />
                Applications Under Review ({pendingEnrollments.length})
              </h3>
              {pendingEnrollments.map(e => (
                <div key={e.id} className="text-sm text-yellow-700">
                  {e.childName} ({e.childClass}) — submitted {new Date(e.created).toLocaleDateString('en-PK')}
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { to: '/van-tracking',    icon: MapPin,     label: 'Track Van',       color: 'text-blue-700',   bg: 'bg-blue-50'   },
                { to: '/payment-history', icon: CreditCard,  label: 'Pay History',     color: 'text-green-700',  bg: 'bg-green-50'  },
                { to: '/notifications',   icon: Bell,        label: 'Notifications',   color: 'text-yellow-700', bg: 'bg-yellow-50' },
                { to: null,               icon: AlertCircle, label: 'Support',         color: 'text-purple-700', bg: 'bg-purple-50', onClick: openChatbot },
              ].map((item, i) => {
                const content = (
                  <div className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group cursor-pointer`}>
                    <div className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="font-medium text-gray-800 text-sm">{item.label}</span>
                  </div>
                );
                return item.to
                  ? <Link key={i} to={item.to}>{content}</Link>
                  : <button key={i} onClick={item.onClick} className="text-left">{content}</button>;
              })}
            </div>
          </div>

          {/* Learn More */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { to: '/about',   icon: Info,      label: 'About Us',    desc: 'Our mission & values' },
              { to: '/services',icon: Briefcase, label: 'Services',    desc: 'Transport options' },
              { to: '/contact', icon: PhoneCall, label: 'Contact Us',  desc: 'Get support' },
            ].map((item, i) => (
              <Link key={i} to={item.to} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all flex items-center gap-3 group">
                <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center text-white group-hover:bg-yellow-500 group-hover:text-blue-900 transition-colors flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-blue-900 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default ParentDashboard;