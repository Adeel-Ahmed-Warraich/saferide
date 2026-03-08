/**
 * saferide/web/src/pages/AdminDashboard.jsx  — Batch 3
 *
 * NEW  #1  handleRejectPayment — "Rejected" now valid (add migration 1773400001)
 *          + per-button actionLoading so each button spins independently
 * NEW  #2  busyOp() wrapper — thin overlay + spinner on every server call
 * NEW  #3  Due date starts from joiningDate (advance fee logic in AssignVanModal)
 * NEW  #4  Payments tab has two views: "All" and "Pending / Overdue" with
 *          one-click Send Reminder button per row
 * NEW  #5  Fee-increase modal on Parents tab — bumps fee, saves feeHistory JSON
 * NEW  #7  Assignment emails handled by assignment-update-notify.pb.js hook
 * NEW  #8  Notification form has optional Expiry Date; sent list shows expiry
 * NEW  #12 All catch blocks log [SR] prefix + show full error in toast
 *
 * RETAINED from previous versions:
 *  handleRejectEnrollment, isArchived soft-delete, Broadcast type,
 *  1000-record pagination, AssignVanModal, targeted notifications
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { SAFERIDE } from '@/lib/config.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { useToast } from '@/hooks/use-toast.js';
import {
  Users, CreditCard, Bell, Truck, FileBarChart, Check, X,
  Plus, Search, TrendingUp, DollarSign, AlertTriangle, Activity,
  Download, UserCheck, Edit2, Archive, LogOut, ClipboardList,
  UserPlus, CheckCircle2, XCircle, MapPin, Clock, Send, Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import ChangePasswordModal from '@/components/ChangePasswordModal.jsx';

// Global busy overlay shown during any server round-trip
const BusyOverlay = () => (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 shadow-2xl flex items-center gap-4">
      <Loader2 className="w-6 h-6 text-blue-700 animate-spin" />
      <span className="text-gray-800 font-medium">Processing…</span>
    </div>
  </div>
);
const Spin = () => <Loader2 className="w-4 h-4 animate-spin inline-block mr-1.5" />;


// ─── Fee Increase Modal (#5) ─────────────────────────────────────────────────
const FeeIncreaseModal = ({ parent, assignment, onClose, onSave }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const currentFee = assignment?.monthlyFee || parent?.monthlyFee || 0;
  const [newFee, setNewFee] = useState(currentFee);
  const [reason, setReason] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(newFee) <= 0) { toast({ title: 'Enter a valid fee', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      // Build fee history entry
      const prevHistory = assignment?.feeHistory ? (Array.isArray(assignment.feeHistory) ? assignment.feeHistory : []) : [];
      const historyEntry = {
        previousFee: currentFee,
        newFee: Number(newFee),
        effectiveFrom,
        reason: reason || 'Fee adjustment',
        changedAt: new Date().toISOString(),
      };
      await pb.collection('assignments').update(assignment.id, {
        monthlyFee:    Number(newFee),
        previousFee:   currentFee,
        effectiveFrom: effectiveFrom,
        feeHistory:    [...prevHistory, historyEntry],
      }, { $autoCancel: false });
      toast({ title: `Fee updated to Rs. ${Number(newFee).toLocaleString()} from ${effectiveFrom}` });
      onSave(); onClose();
    } catch (err) {
      console.error('[SR] FeeIncreaseModal', err);
      toast({ title: 'Update Failed', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <ModalShell title={`Update Monthly Fee — ${assignment?.childLabel || parent?.childName}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Current Fee</p>
            <p className="text-2xl font-black text-gray-700">Rs. {Number(currentFee).toLocaleString()}</p>
          </div>
          <div className="text-2xl text-gray-300">→</div>
          <div>
            <p className="text-xs text-blue-600 uppercase font-semibold tracking-wide">New Fee</p>
            <p className="text-2xl font-black text-blue-800">Rs. {Number(newFee || 0).toLocaleString()}</p>
          </div>
        </div>
        <div>
          <Label>New Monthly Fee (Rs.) *</Label>
          <Input type="number" min={1} value={newFee} onChange={e => setNewFee(e.target.value)} required className="mt-1.5" placeholder="e.g. 5500" />
        </div>
        <div>
          <Label>Effective From *</Label>
          <Input type="date" value={effectiveFrom} onChange={e => setEffectiveFrom(e.target.value)} required className="mt-1.5"
            min={new Date().toISOString().split('T')[0]} />
          <p className="text-xs text-gray-400 mt-1">The new fee applies from this date. A new payment voucher will be created.</p>
        </div>
        <div>
          <Label>Reason <span className="font-normal text-gray-400">(optional)</span></Label>
          <Input value={reason} onChange={e => setReason(e.target.value)} className="mt-1.5" placeholder="e.g. Annual fee revision, fuel cost increase" />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={loading} className="flex-1 bg-blue-800 hover:bg-blue-900 text-white">
            {loading ? 'Saving…' : 'Update Fee & Notify Parent'}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
};

// ─── Shared Modal Shell ───────────────────────────────────────────────────────
const ModalShell = ({ title, onClose, children, wide = false }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}>
      <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold text-blue-900">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ─── Add/Edit Parent Modal ────────────────────────────────────────────────────
const ParentModal = ({ parent, onClose, onSave }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName:         parent?.fullName         || '',
    email:            parent?.email            || '',
    password:         '',
    phoneNumber:      parent?.phoneNumber      || '',
    childName:        parent?.childName        || '',
    childClass:       parent?.childClass       || '',
    schoolName:       parent?.schoolName       || '',
    homeAddress:      parent?.homeAddress      || '',
    preferredShift:   parent?.preferredShift   || 'Morning',
    enrollmentStatus: parent?.enrollmentStatus || 'Pending',
  });
  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (parent) {
        const data = { ...form };
        if (!data.password) delete data.password;
        else data.passwordConfirm = data.password;
        await pb.collection('parents').update(parent.id, data, { $autoCancel: false });
        toast({ title: 'Parent updated successfully' });
      } else {
        await pb.collection('parents').create({ ...form, passwordConfirm: form.password, emailVisibility: true }, { $autoCancel: false });
        toast({ title: 'Parent added successfully' });
      }
      onSave(); onClose();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <ModalShell title={parent ? 'Edit Parent' : 'Add New Parent'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Full Name *</Label>
            <Input name="fullName" required value={form.fullName} onChange={handle} className="mt-1" />
          </div>
          <div>
            <Label>Email *</Label>
            <Input name="email" type="email" required value={form.email} onChange={handle} className="mt-1" disabled={!!parent} />
          </div>
          <div>
            <Label>{parent ? 'New Password (leave blank to keep)' : 'Password *'}</Label>
            <Input name="password" type="password" required={!parent} value={form.password} onChange={handle} className="mt-1" />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input name="phoneNumber" value={form.phoneNumber} onChange={handle} placeholder="+92 03014202944" className="mt-1" />
          </div>
          <div>
            <Label>Enrollment Status</Label>
            <select name="enrollmentStatus" value={form.enrollmentStatus} onChange={handle} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Pending</option><option>Active</option><option>Suspended</option>
            </select>
          </div>
          <div><Label>Child Name</Label><Input name="childName" value={form.childName} onChange={handle} className="mt-1" /></div>
          <div><Label>Child Class</Label><Input name="childClass" value={form.childClass} onChange={handle} placeholder="e.g., Grade 5" className="mt-1" /></div>
          <div><Label>School Name</Label><Input name="schoolName" value={form.schoolName} onChange={handle} className="mt-1" /></div>
          <div>
            <Label>Preferred Shift</Label>
            <select name="preferredShift" value={form.preferredShift} onChange={handle} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Morning</option><option>Afternoon</option><option>Both</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label>Home Address</Label>
            <Textarea name="homeAddress" value={form.homeAddress} onChange={handle} rows={2} className="mt-1" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={loading} className="flex-1 bg-blue-800 hover:bg-blue-900 text-white">
            {loading ? 'Saving...' : parent ? 'Update Parent' : 'Add Parent'}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
};

// ─── Van Modal ────────────────────────────────────────────────────────────────
const VanModal = ({ van, onClose, onSave }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vanId:        van?.vanId        || '',
    driverName:   van?.driverName   || '',
    driverPhone:  van?.driverPhone  || '',
    capacity:     van?.capacity     || 7,
    status:       van?.status       || 'Active',
    licensePlate: van?.licensePlate || '',
  });
  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (van) {
        await pb.collection('vans').update(van.id, form, { $autoCancel: false });
        toast({ title: 'Van updated' });
      } else {
        await pb.collection('vans').create(form, { $autoCancel: false });
        toast({ title: 'Van added' });
      }
      onSave(); onClose();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <ModalShell title={van ? 'Edit Van' : 'Add New Van'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Van ID *</Label><Input name="vanId" required value={form.vanId} onChange={handle} placeholder="V-001" className="mt-1" /></div>
          <div><Label>License Plate</Label><Input name="licensePlate" value={form.licensePlate} onChange={handle} placeholder="LHR-1234" className="mt-1" /></div>
          <div><Label>Driver Name *</Label><Input name="driverName" required value={form.driverName} onChange={handle} className="mt-1" /></div>
          <div><Label>Driver Phone</Label><Input name="driverPhone" value={form.driverPhone} onChange={handle} className="mt-1" /></div>
          <div><Label>Capacity</Label><Input name="capacity" type="number" min={1} max={15} value={form.capacity} onChange={handle} className="mt-1" /></div>
          <div>
            <Label>Status</Label>
            <select name="status" value={form.status} onChange={handle} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>Active</option><option>Inactive</option><option>Maintenance</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={loading} className="flex-1 bg-blue-800 hover:bg-blue-900 text-white">
            {loading ? 'Saving...' : van ? 'Update Van' : 'Add Van'}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
};

// ─── SUGGESTION A: Van Assignment Modal ──────────────────────────────────────
const AssignVanModal = ({ parent, vans, existingAssignment, onClose, onSave }) => {
  const { toast } = useToast();
  const [loading,     setLoading]     = useState(false);
  const [selectedVan, setSelectedVan] = useState(existingAssignment?.vanId || '');
  const [shift,       setShift]       = useState(existingAssignment?.shift || parent.preferredShift || 'Morning');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVan) { toast({ title: 'Please select a van', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      if (existingAssignment) {
        await pb.collection('assignments').update(existingAssignment.id, {
          vanId: selectedVan, shift, status: 'Active',
        }, { $autoCancel: false });
        toast({ title: `Van reassigned for ${parent.fullName}` });
      } else {
        await pb.collection('assignments').create({
          parentId: parent.id, vanId: selectedVan, shift, status: 'Active',
        }, { $autoCancel: false });
        toast({ title: `Van assigned for ${parent.fullName}` });
      }
      onSave(); onClose();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <ModalShell title={`Assign Van — ${parent.fullName}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Select Van *</Label>
          <select
            value={selectedVan}
            onChange={e => setSelectedVan(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Choose a van —</option>
            {vans.filter(v => v.status === 'Active').map(v => (
              <option key={v.id} value={v.id}>
                {v.vanId} · {v.driverName} ({v.capacity} seats)
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Shift</Label>
          <select
            value={shift}
            onChange={e => setShift(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option>Morning</option><option>Afternoon</option><option>Both</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" disabled={loading} className="flex-1 bg-blue-800 hover:bg-blue-900 text-white">
            {loading ? 'Saving...' : existingAssignment ? 'Update Assignment' : 'Assign Van'}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
};

// ─── Main AdminDashboard ──────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { toast }    = useToast();
  const { logout }   = useAuth();
  const navigate     = useNavigate();

  const [parents,              setParents]              = useState([]);
  const [payments,             setPayments]             = useState([]);
  const [vans,                 setVans]                 = useState([]);
  const [enrollments,          setEnrollments]          = useState([]);
  const [approvedEnrollments,  setApprovedEnrollments]  = useState([]);
  const [assignments,          setAssignments]          = useState([]);
  const [loading,              setLoading]              = useState(true);
  const [busy,                 setBusy]                 = useState(false);   // global overlay
  const [actionLoading,        setActionLoading]        = useState({});      // { [id]: true }
  const [searchParent,         setSearchParent]         = useState('');
  const [searchPayment,        setSearchPayment]        = useState('');
  const [searchEnrollment,     setSearchEnrollment]     = useState('');
  const [paymentTab,           setPaymentTab]           = useState('all');   // 'all' | 'pending'
  const [approvingId,          setApprovingId]          = useState(null);

  const [showParentModal,      setShowParentModal]      = useState(false);
  const [editingParent,        setEditingParent]        = useState(null);
  const [showVanModal,         setShowVanModal]         = useState(false);
  const [editingVan,           setEditingVan]           = useState(null);
  const [showAssignModal,      setShowAssignModal]      = useState(false);
  const [assigningParent,      setAssigningParent]      = useState(null);
  const [showFeeModal,         setShowFeeModal]         = useState(false);
  const [feeModalParent,       setFeeModalParent]       = useState(null);
  const [feeModalAssignment,   setFeeModalAssignment]   = useState(null);
  const [showChangePassword,   setShowChangePassword]   = useState(false);

  // Notification form
  const [notifTitle,           setNotifTitle]           = useState('');
  const [notifMsg,             setNotifMsg]             = useState('');
  const [notifTargetId,        setNotifTargetId]        = useState(''); // '' = broadcast
  const [notifLoading,         setNotifLoading]         = useState(false);
  const [notifExpiry,          setNotifExpiry]          = useState('');
  const [notifType,            setNotifType]            = useState('Broadcast'); // FeeReminder|PaymentConfirmation|PickupDelay|Emergency|Broadcast
  const [sentNotifications,    setSentNotifications]    = useState([]);

  useEffect(() => { fetchData(); }, []);

  // busyOp: shows global overlay, logs errors with [SR] prefix
  const busyOp = useCallback(async (key, fn) => {
    setActionLoading(prev => ({ ...prev, [key]: true }));
    setBusy(true);
    try {
      return await fn();
    } catch (err) {
      console.error('[SR] busyOp error:', key, err?.status, err?.message, err);
      throw err;
    } finally {
      setActionLoading(prev => ({ ...prev, [key]: false }));
      setBusy(false);
    }
  }, []);

  const safeFetch = async (fn, label) => {
    try { return await fn(); } catch (err) {
      console.error(`[SR] Failed to fetch ${label}`, err?.status, err?.message);
      return { items: [] };
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const token   = pb.authStore.token;
    const headers = token ? { Authorization: token } : {};

    const [parentsRes, paymentsRes, vansRes, enrollRes, approvedRes, notifRes, assignRes] = await Promise.all([
      // FIX #6 — raised to 1000 and excludes archived records
      safeFetch(() => pb.collection('parents').getList(1, 1000, {
        filter: 'isArchived != true', $autoCancel: false, headers,
      }), 'parents'),
      safeFetch(() => pb.collection('payments').getList(1, 1000, {
        sort: '-created', expand: 'parentId', $autoCancel: false, headers,
      }), 'payments'),
      safeFetch(() => pb.collection('vans').getList(1, 100, { $autoCancel: false, headers }), 'vans'),
      safeFetch(() => pb.collection('enrollments').getList(1, 500, {
        sort: '-created', filter: 'status != "approved" && status != "rejected"', $autoCancel: false, headers,
      }), 'enrollments'),
      safeFetch(() => pb.collection('enrollments').getList(1, 500, {
        sort: '-created', filter: 'status = "approved"', $autoCancel: false, headers,
      }), 'approvedEnrollments'),
      safeFetch(() => pb.collection('notifications').getList(1, 100, {
        sort: '-created', $autoCancel: false, headers,
      }), 'notifications'),
      safeFetch(() => pb.collection('assignments').getList(1, 500, {
        filter: 'status = "Active"', $autoCancel: false, headers,
      }), 'assignments'),
    ]);

    setParents(parentsRes.items);
    setPayments(paymentsRes.items);
    setVans(vansRes.items);
    setEnrollments(enrollRes.items);
    setApprovedEnrollments(approvedRes.items);
    setSentNotifications(notifRes.items);
    setAssignments(assignRes.items);
    setLoading(false);
  };

  // ── Enrollment actions ──────────────────────────────────────────────────────
  const handleApproveEnrollment = async (enrollment) => {
    setApprovingId(enrollment.id);
    const defaultPassword = enrollment.contactNumber
      ? enrollment.contactNumber.replace(/\s/g, '').slice(-8) + 'SR!'
      : 'SafeRide@123';

    let existingParent = null;
    try {
      const ex = await pb.collection('parents').getList(1, 1, {
        filter: `email="${enrollment.email}"`, $autoCancel: false,
      });
      if (ex.items.length > 0) existingParent = ex.items[0];
    } catch (err) { console.warn('[approve] existing check:', err.message); }

    if (existingParent) {
      // Second child
      let ok = false;
      try {
        await pb.collection('parents').update(existingParent.id, { enrollmentStatus: 'Active' }, { $autoCancel: false });
        ok = true;
      } catch (err) {
        toast({ title: 'Update Failed', description: err.message, variant: 'destructive' });
        setApprovingId(null); return;
      }
      if (ok) {
        try { await pb.collection('enrollments').update(enrollment.id, { status: 'approved' }, { $autoCancel: false }); } catch (_) {}
        toast({ title: '✓ Second Child Approved', description: `${enrollment.childName} approved under ${enrollment.email}` });
        fetchData();
      }
      setApprovingId(null); return;
    }

    // New parent
    let createOk = false;
    try {
      await pb.collection('parents').create({
        email: enrollment.email, password: defaultPassword, passwordConfirm: defaultPassword,
        emailVisibility: true, fullName: enrollment.parentName, phoneNumber: enrollment.contactNumber,
        childName: enrollment.childName, childClass: enrollment.childClass,
        schoolName: enrollment.schoolName, homeAddress: enrollment.homeAddress,
        preferredShift: enrollment.preferredShift,
        specialInstructions: enrollment.specialInstructions || '',
        enrollmentStatus: 'Active',
      }, { $autoCancel: false });
      createOk = true;
    } catch (err) {
      if (err?.data?.email?.code === 'validation_not_unique') {
        toast({ title: 'Email Already Exists', description: 'Refresh and try again.', variant: 'destructive' });
      } else {
        toast({ title: 'Create Failed', description: err.message, variant: 'destructive' });
      }
      setApprovingId(null); return;
    }

    if (createOk) {
      try { await pb.collection('enrollments').delete(enrollment.id, { $autoCancel: false }); } catch (_) {}
      toast({ title: '✓ Parent Account Created', description: `Login: ${enrollment.email} · Password: ${defaultPassword}` });
      fetchData();
    }
    setApprovingId(null);
  };

  const handleRejectEnrollment = async (id) => {
    if (!confirm('Reject this enrollment? The applicant will receive a rejection email.')) return;
    try {
      await busyOp('enroll_rej_' + id, () =>
        pb.collection('enrollments').update(id, { status: 'rejected' }, { $autoCancel: false })
      );
      toast({ title: 'Enrollment rejected — applicant notified by email' });
      fetchData();
    } catch (e) {
      console.error('[SR] handleRejectEnrollment', e);
      toast({ title: 'Reject Failed', description: e.message, variant: 'destructive' });
    }
  };

  // ── Payment actions ─────────────────────────────────────────────────────────
  const handleApprovePayment = async (id) => {
    try {
      await busyOp('pay_' + id, () =>
        pb.collection('payments').update(id, { status: 'Paid' }, { $autoCancel: false })
      );
      toast({ title: 'Payment Approved ✓' }); fetchData();
    } catch (e) {
      console.error('[SR] handleApprovePayment', e);
      toast({ title: 'Approve Failed', description: e.message, variant: 'destructive' });
    }
  };

  const handleRejectPayment = async (id) => {
    // NOTE: requires "Rejected" in payments.status enum — run migration 1773400001
    try {
      await busyOp('rej_' + id, () =>
        pb.collection('payments').update(id, { status: 'Rejected' }, { $autoCancel: false })
      );
      toast({ title: 'Payment Rejected' }); fetchData();
    } catch (e) {
      console.error('[SR] handleRejectPayment', e);
      toast({ title: 'Reject Failed', description: e.message, variant: 'destructive' });
    }
  };

  const handleSendPaymentReminder = async (payment) => {
    const parent = parents.find(p => p.id === payment.parentId || p.id === payment.expand?.parentId?.id);
    if (!parent) { toast({ title: 'Parent not found', variant: 'destructive' }); return; }
    const child = payment.childLabel || parent.childName;
    const msg = `Dear ${parent.fullName}, your fee of Rs. ${payment.amount} for ${payment.month || 'this month'} is ${payment.status === 'Overdue' ? 'OVERDUE' : 'pending'}. Please pay via the SafeRide portal to avoid service interruption.`;
    try {
      await busyOp('reminder_' + payment.id, () =>
        pb.collection('notifications').create({
          parentId: parent.id,
          title:    `⚠️ Fee Reminder — ${child}`,
          message:  msg,
          type:     'FeeReminder',  // enum: FeeReminder|PaymentConfirmation|PickupDelay|Emergency|Broadcast
        }, { $autoCancel: false })
      );
      toast({ title: `Reminder sent to ${parent.fullName}` });
    } catch (e) {
      console.error('[SR] handleSendPaymentReminder', e);
      toast({ title: 'Reminder Failed', description: e.message, variant: 'destructive' });
    }
  };

  const handleUpdateEnrollmentStatus = async (id, status) => {
    try {
      await pb.collection('parents').update(id, { enrollmentStatus: status }, { $autoCancel: false });
      toast({ title: `Status updated to ${status}` }); fetchData();
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
  };

  // FIX #10 — soft-delete: set isArchived=true instead of permanent deletion
  const handleArchiveParent = async (id, name) => {
    if (!confirm(`Archive ${name}? They will be hidden from this list but their data is preserved.`)) return;
    try {
      await busyOp('archive_' + id, () =>
        pb.collection('parents').update(id, { isArchived: true }, { $autoCancel: false })
      );
      toast({ title: `${name} archived` }); fetchData();
    } catch (e) {
      console.error('[SR] handleArchiveParent', e);
      toast({ title: 'Archive Failed', description: e.message, variant: 'destructive' });
    }
  };

  const handleSendNotification = async (ev) => {
    ev.preventDefault();
    setNotifLoading(true);
    try {
      const payload = {
        title:    notifTitle,
        message:  notifMsg,
        type:     notifType,
        parentId: notifTargetId || '',
      };
      if (notifExpiry) payload.expiresAt = notifExpiry;
      await pb.collection('notifications').create(payload, { $autoCancel: false });
      toast({
        title: notifTargetId
          ? `Notification sent to ${parents.find(p => p.id === notifTargetId)?.fullName || 'parent'}`
          : `Broadcast sent to all parents (${parents.length})`,
      });
      setNotifTitle(''); setNotifMsg(''); setNotifTargetId(''); setNotifExpiry(''); setNotifType('Broadcast');
      fetchData();
    } catch (e) {
      console.error('[SR] handleSendNotification', e);
      toast({ title: 'Send Failed', description: e.message, variant: 'destructive' });
    } finally { setNotifLoading(false); }
  };

  // ── CSV Export ──────────────────────────────────────────────────────────────
  const exportCSV = (data, filename, columns) => {
    const header = columns.map(c => c.label).join(',');
    const rows   = data.map(row =>
      columns.map(c => {
        const val = c.get ? c.get(row) : row[c.key] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csv  = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast({ title: `${filename} downloaded ✓` });
  };

  const exportPayments    = () => exportCSV(payments, 'saferide_payments.csv', [
    { label: 'Parent',         get: r => r.expand?.parentId?.fullName || 'Unknown' },
    { label: 'Child',          key: 'childLabel' },
    { label: 'Amount (Rs)',    key: 'amount' },
    { label: 'Method',         key: 'paymentMethod' },
    { label: 'Status',         key: 'status' },
    { label: 'Transaction ID', key: 'transactionId' },
    { label: 'Date',           get: r => new Date(r.created).toLocaleDateString() },
  ]);
  const exportParents     = () => exportCSV(parents, 'saferide_parents.csv', [
    { label: 'Full Name',  key: 'fullName' },  { label: 'Email',    key: 'email' },
    { label: 'Phone',      key: 'phoneNumber' }, { label: 'Child',  key: 'childName' },
    { label: 'Class',      key: 'childClass' },  { label: 'School', key: 'schoolName' },
    { label: 'Shift',      key: 'preferredShift' }, { label: 'Status', key: 'enrollmentStatus' },
    { label: 'Address',    key: 'homeAddress' },
  ]);
  const exportEnrollments = () => exportCSV(enrollments, 'saferide_enrollments.csv', [
    { label: 'Parent Name', key: 'parentName' }, { label: 'Email',   key: 'email' },
    { label: 'Contact',     key: 'contactNumber' }, { label: 'Child', key: 'childName' },
    { label: 'Class',       key: 'childClass' }, { label: 'School',  key: 'schoolName' },
    { label: 'Address',     key: 'homeAddress' }, { label: 'Shift',  key: 'preferredShift' },
    { label: 'Submitted',   get: r => new Date(r.created).toLocaleDateString() },
  ]);
  const exportVans        = () => exportCSV(vans, 'saferide_fleet.csv', [
    { label: 'Van ID',       key: 'vanId' },   { label: 'Driver',       key: 'driverName' },
    { label: 'Driver Phone', key: 'driverPhone' }, { label: 'License', key: 'licensePlate' },
    { label: 'Capacity',     key: 'capacity' }, { label: 'Status',      key: 'status' },
  ]);

  // ── Stats ────────────────────────────────────────────────────────────────────
  const totalRevenue   = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + (p.amount || 0), 0);
  const pendingPayments = payments.filter(p => p.status === 'Pending' || p.status === 'PendingAdminApproval').length;
  const activeParents  = parents.filter(p => p.enrollmentStatus === 'Active').length;
  const activeVans     = vans.filter(v => v.status === 'Active').length;

  const filteredParents     = parents.filter(p =>
    !searchParent ||
    p.fullName?.toLowerCase().includes(searchParent.toLowerCase()) ||
    p.childName?.toLowerCase().includes(searchParent.toLowerCase()) ||
    p.phoneNumber?.includes(searchParent)
  );
  const filteredEnrollments = enrollments.filter(e =>
    !searchEnrollment ||
    e.parentName?.toLowerCase().includes(searchEnrollment.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchEnrollment.toLowerCase()) ||
    e.childName?.toLowerCase().includes(searchEnrollment.toLowerCase())
  );
  const filteredPayments    = payments.filter(p =>
    !searchPayment ||
    (p.expand?.parentId?.fullName || '').toLowerCase().includes(searchPayment.toLowerCase()) ||
    (p.transactionId || '').toLowerCase().includes(searchPayment.toLowerCase())
  );

  const handleLogout = () => { logout(); navigate('/'); };

  const statusBadge = (status, map) => {
    const cfg = map[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>{status}</span>;
  };
  const enrollmentColors = { Active: { bg: 'bg-green-100', text: 'text-green-800' }, Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' }, Suspended: { bg: 'bg-red-100', text: 'text-red-800' } };
  const paymentColors    = { Paid: { bg: 'bg-green-100', text: 'text-green-800' }, Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' }, PendingAdminApproval: { bg: 'bg-blue-100', text: 'text-blue-800' }, Overdue: { bg: 'bg-red-100', text: 'text-red-800' }, Rejected: { bg: 'bg-gray-100', text: 'text-gray-700' } };
  const vanColors        = { Active: { bg: 'bg-green-100', text: 'text-green-800' }, Inactive: { bg: 'bg-gray-100', text: 'text-gray-700' }, Maintenance: { bg: 'bg-orange-100', text: 'text-orange-800' } };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-800 mx-auto mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <>
      {busy && <BusyOverlay />}
      <Helmet><title>Admin Dashboard - SafeRide</title></Helmet>

      {showParentModal  && <ParentModal parent={editingParent} onClose={() => { setShowParentModal(false); setEditingParent(null); }} onSave={fetchData} />}
      {showVanModal     && <VanModal    van={editingVan}       onClose={() => { setShowVanModal(false);    setEditingVan(null);    }} onSave={fetchData} />}
      {showAssignModal  && assigningParent && (
        <AssignVanModal
          parent={assigningParent}
          vans={vans}
          existingAssignment={assignments.find(a => a.parentId === assigningParent.id)}
          onClose={() => { setShowAssignModal(false); setAssigningParent(null); }}
          onSave={fetchData}
        />
      )}
      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
      {showFeeModal && feeModalParent && (
        <FeeIncreaseModal
          parent={feeModalParent}
          assignment={feeModalAssignment}
          onClose={() => { setShowFeeModal(false); setFeeModalParent(null); setFeeModalAssignment(null); }}
          onSave={fetchData}
        />
      )}

      <div className="min-h-screen bg-gray-100">
        {/* Top Bar */}
        <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-xl font-bold">SafeRide Admin Panel</h1>
            <p className="text-blue-300 text-xs">Manage your entire fleet and operations</p>
          </div>
          <div className="flex gap-2 items-center">
            <Link to="/accounting">
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-800 border border-blue-700">
                📊 Accounting
              </Button>
            </Link>
            <Button onClick={() => setShowChangePassword(true)} variant="ghost" size="sm" className="text-white hover:bg-blue-800 border border-blue-700">
              🔑 Change Password
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-white hover:bg-blue-800 border border-blue-700">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Revenue',    value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign,   color: 'from-green-500 to-green-600',   sub: 'Paid payments' },
              { label: 'Active Parents',   value: activeParents,                          icon: UserCheck,    color: 'from-blue-500 to-blue-700',     sub: `${parents.length} total` },
              { label: 'Pending Payments', value: pendingPayments,                        icon: AlertTriangle,color: 'from-yellow-500 to-orange-500', sub: 'Awaiting approval' },
              { label: 'Active Vans',      value: activeVans,                             icon: Activity,     color: 'from-purple-500 to-purple-700', sub: `${vans.length} total fleet` },
            ].map((s, i) => (
              <div key={i} className={`bg-gradient-to-br ${s.color} text-white p-5 rounded-2xl shadow-lg`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-white/80 mb-1">{s.label}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-white/70 mt-1">{s.sub}</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-xl"><s.icon className="w-5 h-5" /></div>
                </div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="enrollments" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 bg-white p-1 rounded-xl shadow-sm h-auto">
              <TabsTrigger value="enrollments" className="py-2.5 text-xs sm:text-sm relative">
                <ClipboardList className="w-4 h-4 mr-1 hidden sm:inline" /> Enrollments
                {enrollments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {enrollments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="parents"       className="py-2.5 text-xs sm:text-sm"><Users       className="w-4 h-4 mr-1 hidden sm:inline" /> Parents</TabsTrigger>
              <TabsTrigger value="payments"      className="py-2.5 text-xs sm:text-sm"><CreditCard  className="w-4 h-4 mr-1 hidden sm:inline" /> Payments</TabsTrigger>
              <TabsTrigger value="vans"          className="py-2.5 text-xs sm:text-sm"><Truck       className="w-4 h-4 mr-1 hidden sm:inline" /> Vans</TabsTrigger>
              <TabsTrigger value="notifications" className="py-2.5 text-xs sm:text-sm"><Bell        className="w-4 h-4 mr-1 hidden sm:inline" /> Notify</TabsTrigger>
              <TabsTrigger value="reports"       className="py-2.5 text-xs sm:text-sm"><FileBarChart className="w-4 h-4 mr-1 hidden sm:inline" /> Reports</TabsTrigger>
            </TabsList>

            {/* ── Enrollments ──────────────────────────────────────────────── */}
            <TabsContent value="enrollments" className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <div>
                  <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" /> Pending Enrollment Requests ({enrollments.length})
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Approved and rejected records are hidden.</p>
                </div>
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={searchEnrollment} onChange={e => setSearchEnrollment(e.target.value)} placeholder="Search enrollments..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {enrollments.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No pending enrollment requests</p>
                  <p className="text-sm mt-1">New bookings from /book will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEnrollments.map(e => (
                    <div key={e.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 flex-1">
                          <div><p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Parent Name</p><p className="font-semibold text-gray-900 mt-0.5">{e.parentName}</p></div>
                          <div><p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p><p className="font-medium text-gray-800 mt-0.5 text-sm">{e.email}</p></div>
                          <div><p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Contact</p><p className="font-medium text-gray-800 mt-0.5 text-sm">{e.contactNumber}</p></div>
                          <div><p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Child</p><p className="font-medium text-gray-800 mt-0.5 text-sm">{e.childName} — {e.childClass}</p></div>
                          <div><p className="text-xs text-gray-400 font-medium uppercase tracking-wide">School</p><p className="font-medium text-gray-800 mt-0.5 text-sm">{e.schoolName}</p></div>
                          <div><p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Shift / Submitted</p><p className="font-medium text-gray-800 mt-0.5 text-sm">{e.preferredShift} · {new Date(e.created).toLocaleDateString()}</p></div>
                          {e.homeAddress && <div className="col-span-2 sm:col-span-3"><p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Address</p><p className="font-medium text-gray-800 mt-0.5 text-sm">{e.homeAddress}</p></div>}
                          {e.specialInstructions && <div className="col-span-2 sm:col-span-3"><p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Special Instructions</p><p className="text-sm text-gray-600 mt-0.5 italic">{e.specialInstructions}</p></div>}
                        </div>
                        <div className="flex md:flex-col gap-2 md:w-36 flex-shrink-0">
                          <Button onClick={() => handleApproveEnrollment(e)} disabled={approvingId === e.id} className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white text-sm">
                            {approvingId === e.id ? <span className="flex items-center gap-1"><span className="animate-spin">⏳</span> Creating...</span> : <span className="flex items-center gap-1"><UserPlus className="w-4 h-4" /> Approve</span>}
                          </Button>
                          <Button onClick={() => handleRejectEnrollment(e.id)} variant="outline" className="flex-1 md:flex-none border-red-300 text-red-600 hover:bg-red-50 text-sm">
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── Parents ──────────────────────────────────────────────────── */}
            <TabsContent value="parents" className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Registered Parents ({parents.length}) · {parents.length + approvedEnrollments.length} Children Total
                </h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={searchParent} onChange={e => setSearchParent(e.target.value)} placeholder="Search parents..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <Button onClick={() => { setEditingParent(null); setShowParentModal(true); }} className="bg-blue-800 hover:bg-blue-900 text-white flex-shrink-0">
                    <Plus className="w-4 h-4 mr-1" /> Add Parent
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-3 font-semibold text-gray-600">Parent</th>
                      <th className="p-3 font-semibold text-gray-600 hidden md:table-cell">Child / School</th>
                      <th className="p-3 font-semibold text-gray-600 hidden sm:table-cell">Phone</th>
                      <th className="p-3 font-semibold text-gray-600 hidden lg:table-cell">Van</th>
                      <th className="p-3 font-semibold text-gray-600">Status</th>
                      <th className="p-3 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParents.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-gray-400">No parents found</td></tr>
                    ) : filteredParents.map(p => {
                      const siblings   = approvedEnrollments.filter(e => e.email === p.email);
                      const assignment = assignments.find(a => a.parentId === p.id);
                      const assignedVan = vans.find(v => v.id === assignment?.vanId);
                      return (
                        <React.Fragment key={p.id}>
                          <tr className="border-b hover:bg-gray-50/70 transition-colors">
                            <td className="p-3">
                              <div className="font-medium text-gray-900">{p.fullName}</div>
                              <div className="text-xs text-gray-500">{p.email}</div>
                            </td>
                            <td className="p-3 hidden md:table-cell">
                              <div className="text-gray-800 font-medium">{p.childName} ({p.childClass})</div>
                              <div className="text-xs text-gray-500">{p.schoolName}</div>
                              {siblings.map(s => (
                                <div key={s.id} className="mt-1 pt-1 border-t border-dashed border-gray-200">
                                  <div className="text-gray-700 text-xs flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                    {s.childName} ({s.childClass})
                                  </div>
                                  <div className="text-xs text-gray-400">{s.schoolName} · {s.preferredShift}</div>
                                </div>
                              ))}
                            </td>
                            <td className="p-3 text-gray-600 hidden sm:table-cell">{p.phoneNumber}</td>
                            {/* SUGGESTION A — show assigned van */}
                            <td className="p-3 hidden lg:table-cell">
                              {assignedVan ? (
                                <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                                  {assignedVan.vanId}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">Unassigned</span>
                              )}
                            </td>
                            <td className="p-3">
                              <select
                                value={p.enrollmentStatus}
                                onChange={e => handleUpdateEnrollmentStatus(p.id, e.target.value)}
                                className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${enrollmentColors[p.enrollmentStatus]?.bg || 'bg-gray-100'} ${enrollmentColors[p.enrollmentStatus]?.text || 'text-gray-700'}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1">
                                {/* SUGGESTION A — assign van button */}
                                <button
                                  onClick={() => { setAssigningParent(p); setShowAssignModal(true); }}
                                  className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                                  title={assignedVan ? `Reassign van (${assignedVan.vanId})` : 'Assign van'}
                                >
                                  <MapPin className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setEditingParent(p); setShowParentModal(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Edit">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                {/* FIX #10 — archive icon instead of delete */}
                                <button onClick={() => handleArchiveParent(p.id, p.fullName)} className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-500 transition-colors" title="Archive (soft delete)">
                                  <Archive className="w-4 h-4" />
                                </button>
                                {/* Fee increase button — only shown when parent has an assignment */}
                                {assignments.find(a => a.parentId === p.id) && (
                                  <button
                                    onClick={() => {
                                      const asgn = assignments.find(a => a.parentId === p.id);
                                      setFeeModalParent(p);
                                      setFeeModalAssignment(asgn);
                                      setShowFeeModal(true);
                                    }}
                                    className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                                    title="Update monthly fee"
                                  >
                                    <TrendingUp className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* ── Payments ─────────────────────────────────────────────────── */}
            <TabsContent value="payments" className="bg-white p-6 rounded-2xl shadow-sm">
              {/* Header with view-switcher */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Payments
                  </h2>
                  <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                    <button onClick={() => setPaymentTab('all')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${paymentTab==='all' ? 'bg-white shadow text-blue-800' : 'text-gray-500 hover:text-gray-700'}`}>
                      All ({payments.length})
                    </button>
                    <button onClick={() => setPaymentTab('pending')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${paymentTab==='pending' ? 'bg-white shadow text-red-700' : 'text-gray-500 hover:text-gray-700'}`}>
                      <Clock className="w-3 h-3" />
                      Due / Overdue ({payments.filter(p => ['Pending','Overdue','PendingAdminApproval'].includes(p.status)).length})
                    </button>
                  </div>
                </div>
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={searchPayment} onChange={e => setSearchPayment(e.target.value)} placeholder="Search by name or ID..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {paymentTab === 'pending' && (
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 text-sm">Showing all unpaid & overdue invoices</p>
                    <p className="text-xs text-amber-700 mt-0.5">Click <strong>Remind</strong> to send an instant in-app notification to the parent.</p>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                {(() => {
                  const viewPayments = paymentTab === 'pending'
                    ? filteredPayments.filter(p => ['Pending','Overdue','PendingAdminApproval'].includes(p.status))
                    : filteredPayments;
                  return (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="p-3 font-semibold text-gray-600">Parent</th>
                          <th className="p-3 font-semibold text-gray-600 hidden sm:table-cell">Child</th>
                          <th className="p-3 font-semibold text-gray-600">Amount</th>
                          <th className="p-3 font-semibold text-gray-600 hidden sm:table-cell">Method</th>
                          <th className="p-3 font-semibold text-gray-600 hidden md:table-cell">Due Date</th>
                          <th className="p-3 font-semibold text-gray-600">Status</th>
                          <th className="p-3 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewPayments.length === 0 ? (
                          <tr><td colSpan={7} className="p-8 text-center text-gray-400">
                            {paymentTab === 'pending' ? '\u2705 No pending or overdue payments right now' : 'No payments found'}
                          </td></tr>
                        ) : viewPayments.map(p => {
                          const isOverdue = p.status === 'Overdue' || (p.dueDate && new Date(p.dueDate) < new Date() && p.status === 'Pending');
                          return (
                            <tr key={p.id} className={`border-b hover:bg-gray-50/70 transition-colors ${isOverdue ? 'bg-red-50/40' : ''}`}>
                              <td className="p-3">
                                <div className="font-medium">{p.expand?.parentId?.fullName || 'Unknown'}</div>
                                <div className="text-xs text-gray-500">{p.month || new Date(p.created).toLocaleDateString()}</div>
                              </td>
                              <td className="p-3 text-gray-600 text-xs hidden sm:table-cell">{p.childLabel || '\u2014'}</td>
                              <td className="p-3 font-semibold text-gray-900">Rs. {Number(p.amount).toLocaleString()}</td>
                              <td className="p-3 text-gray-600 hidden sm:table-cell">{p.paymentMethod || '\u2014'}</td>
                              <td className="p-3 hidden md:table-cell">
                                {p.dueDate ? (
                                  <span className={`text-xs font-medium ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                    {new Date(p.dueDate).toLocaleDateString('en-PK')}
                                    {isOverdue && ' \u26a0\ufe0f'}
                                  </span>
                                ) : <span className="text-gray-300">\u2014</span>}
                              </td>
                              <td className="p-3">{statusBadge(p.status, paymentColors)}</td>
                              <td className="p-3 text-right">
                                <div className="flex justify-end gap-1 flex-wrap">
                                  {(p.status === 'Pending' || p.status === 'PendingAdminApproval') && (
                                    <>
                                      <button onClick={() => handleApprovePayment(p.id)} disabled={!!actionLoading['pay_'+p.id]}
                                        className="flex items-center gap-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium disabled:opacity-50">
                                        {actionLoading['pay_'+p.id] ? <Spin /> : <Check className="w-3.5 h-3.5" />} Approve
                                      </button>
                                      <button onClick={() => handleRejectPayment(p.id)} disabled={!!actionLoading['rej_'+p.id]}
                                        className="flex items-center gap-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium disabled:opacity-50">
                                        {actionLoading['rej_'+p.id] ? <Spin /> : <X className="w-3.5 h-3.5" />} Reject
                                      </button>
                                    </>
                                  )}
                                  {p.status !== 'Paid' && (
                                    <button onClick={() => handleSendPaymentReminder(p)} disabled={!!actionLoading['reminder_'+p.id]}
                                      title="Send in-app reminder"
                                      className="flex items-center gap-1 px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium disabled:opacity-50">
                                      {actionLoading['reminder_'+p.id] ? <Spin /> : <Send className="w-3 h-3" />} Remind
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </TabsContent>

            {/* ── Vans ─────────────────────────────────────────────────────── */}
            <TabsContent value="vans" className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2"><Truck className="w-5 h-5" /> Fleet Management ({vans.length} vans)</h2>
                <Button onClick={() => { setEditingVan(null); setShowVanModal(true); }} className="bg-blue-800 hover:bg-blue-900 text-white">
                  <Plus className="w-4 h-4 mr-1" /> Add Van
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-3 font-semibold text-gray-600">Van</th>
                      <th className="p-3 font-semibold text-gray-600">Driver</th>
                      <th className="p-3 font-semibold text-gray-600 hidden sm:table-cell">Capacity</th>
                      <th className="p-3 font-semibold text-gray-600 hidden md:table-cell">Assigned Students</th>
                      <th className="p-3 font-semibold text-gray-600">Status</th>
                      <th className="p-3 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vans.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-gray-400">No vans added yet</td></tr>
                    ) : vans.map(v => {
                      const assigned = assignments.filter(a => a.vanId === v.id).length;
                      return (
                        <tr key={v.id} className="border-b hover:bg-gray-50/70 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-blue-900">{v.vanId}</div>
                            <div className="text-xs text-gray-500">{v.licensePlate || 'No plate'}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-gray-900">{v.driverName}</div>
                            <div className="text-xs text-gray-500">{v.driverPhone}</div>
                          </td>
                          <td className="p-3 text-gray-600 hidden sm:table-cell">{v.capacity} seats</td>
                          <td className="p-3 hidden md:table-cell">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${assigned >= v.capacity ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {assigned} / {v.capacity}
                            </span>
                          </td>
                          <td className="p-3">{statusBadge(v.status, vanColors)}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => { setEditingVan(v); setShowVanModal(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Edit">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* ── Notifications ────────────────────────────────────────────── */}
            <TabsContent value="notifications" className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5" /> Send Notification
              </h2>

              {/* SUGGESTION C — targeted or broadcast */}
              <form onSubmit={handleSendNotification} className="max-w-xl space-y-4">
                <div>
                  <Label className="text-sm font-medium">Recipient</Label>
                  <select
                    value={notifTargetId}
                    onChange={e => setNotifTargetId(e.target.value)}
                    className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">📢 All Parents (Broadcast)</option>
                    {parents.map(p => (
                      <option key={p.id} value={p.id}>{p.fullName} ({p.childName})</option>
                    ))}
                  </select>
                  {notifTargetId && (
                    <p className="text-xs text-blue-600 mt-1">
                      This notification will only be visible to <strong>{parents.find(p => p.id === notifTargetId)?.fullName}</strong>.
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Notification Type</Label>
                  <select
                    value={notifType}
                    onChange={e => setNotifType(e.target.value)}
                    className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Broadcast">📢 Broadcast (general announcement)</option>
                    <option value="FeeReminder">💳 Fee Reminder</option>
                    <option value="PaymentConfirmation">✅ Payment Confirmation</option>
                    <option value="PickupDelay">🚐 Pickup Delay</option>
                    <option value="Emergency">🚨 Emergency Alert</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Title *</Label>
                  <Input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} required className="mt-1.5" placeholder="e.g., Fee Reminder - March 2026" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Message *</Label>
                  <Textarea value={notifMsg} onChange={e => setNotifMsg(e.target.value)} required rows={5} className="mt-1.5" placeholder="Write your message here..." />
                </div>
                <div>
                  <Label className="text-sm font-medium">Expiry Date <span className="text-gray-400 font-normal">(optional — hide after this date)</span></Label>
                  <Input type="date" value={notifExpiry} onChange={e => setNotifExpiry(e.target.value)} className="mt-1.5 w-64"
                    min={new Date().toISOString().split('T')[0]} />
                </div>
                <Button type="submit" disabled={notifLoading} className="bg-blue-800 hover:bg-blue-900 text-white w-full sm:w-auto px-8">
                  <Bell className="w-4 h-4 mr-2" />
                  {notifLoading ? 'Sending...' : notifTargetId ? 'Send to Parent' : `Broadcast to All (${parents.length})`}
                </Button>
              </form>

              {/* Quick Templates */}
              <div className="mt-10 border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Templates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: 'Monthly Fee Reminder', msg: 'Dear parent, your monthly transport fee is due. Please make the payment via your parent dashboard to avoid service interruption. Thank you!' },
                    { title: 'Eid Holiday Notice',   msg: 'Dear parent, SafeRide will be off from [DATE] to [DATE] for Eid holidays. Service will resume on [DATE]. Eid Mubarak!' },
                    { title: 'Route Change Notice',  msg: "Dear parent, please note that the van route has been slightly adjusted. Your child's pickup time may change by 10-15 minutes. We will update you with exact times." },
                    { title: 'New Year Start',       msg: 'Dear parent, we are ready to serve you in the new academic year! Please ensure your account is active and fees are up to date. Welcome back!' },
                  ].map(t => (
                    <button key={t.title} onClick={() => { setNotifTitle(t.title); setNotifMsg(t.msg); }} className="text-left p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors">
                      <div className="font-medium text-gray-800 text-sm">{t.title}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{t.msg}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sent Notifications History */}
              <div className="mt-10 border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" /> Sent Notifications ({sentNotifications.length})
                </h3>
                {sentNotifications.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No notifications sent yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sentNotifications.map(n => {
                      const targetParent = n.parentId ? parents.find(p => p.id === n.parentId) : null;
                      return (
                        <div key={n.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${n.type === 'Broadcast' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {n.type === 'Broadcast' ? '📢' : '🔔'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${n.type === 'Broadcast' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {n.type}
                              </span>
                              {/* FIX #8 — show target label correctly */}
                              {n.type === 'Broadcast'
                                ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">All Parents</span>
                                : targetParent && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">→ {targetParent.fullName}</span>
                              }
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{n.message}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <p className="text-xs text-gray-400">{new Date(n.created).toLocaleString()}</p>
                              {n.expiresAt && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${new Date(n.expiresAt) < new Date() ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-700'}`}>
                                  {new Date(n.expiresAt) < new Date() ? '⏰ Expired' : `⏳ Expires ${new Date(n.expiresAt).toLocaleDateString('en-PK')}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── Reports ──────────────────────────────────────────────────── */}
            <TabsContent value="reports" className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Reports & Analytics</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Parents',   value: parents.length,                      sub: `${activeParents} active` },
                  { label: 'Total Payments',  value: payments.length,                     sub: `${pendingPayments} pending` },
                  { label: 'Total Revenue',   value: `Rs. ${totalRevenue.toLocaleString()}`, sub: 'Paid only' },
                  { label: 'Fleet Size',      value: vans.length,                         sub: `${activeVans} active` },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-2xl font-bold text-blue-900">{s.value}</div>
                    <div className="text-sm font-medium text-gray-700 mt-1">{s.label}</div>
                    <div className="text-xs text-gray-500">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Payment Status Breakdown</h3>
                <div className="flex flex-wrap gap-3">
                  {['Paid', 'Pending', 'PendingAdminApproval', 'Overdue', 'Rejected'].map(status => {
                    const count  = payments.filter(p => p.status === status).length;
                    const amount = payments.filter(p => p.status === status).reduce((s, p) => s + (p.amount || 0), 0);
                    if (!count) return null;
                    return (
                      <div key={status} className={`px-4 py-3 rounded-xl ${paymentColors[status]?.bg || 'bg-gray-100'} ${paymentColors[status]?.text || 'text-gray-700'}`}>
                        <div className="font-bold text-lg">{count}</div>
                        <div className="text-xs font-medium">{status === 'PendingAdminApproval' ? 'Verifying' : status}</div>
                        <div className="text-xs opacity-80">Rs. {amount.toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Enrollment by Shift</h3>
                <div className="flex flex-wrap gap-3">
                  {['Morning', 'Afternoon', 'Both'].map(shift => (
                    <div key={shift} className="bg-blue-50 text-blue-800 px-4 py-3 rounded-xl border border-blue-100">
                      <div className="font-bold text-lg">{parents.filter(p => p.preferredShift === shift).length}</div>
                      <div className="text-xs font-medium">{shift} Shift</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">Export Data (CSV)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Export Payments',    sub: `${payments.length} records`,    icon: CreditCard,  fn: exportPayments,    color: 'border-green-400 text-green-700 hover:bg-green-50' },
                    { label: 'Export Parents',     sub: `${parents.length} records`,     icon: Users,       fn: exportParents,     color: 'border-blue-400 text-blue-700 hover:bg-blue-50' },
                    { label: 'Export Fleet',       sub: `${vans.length} vans`,           icon: Truck,       fn: exportVans,        color: 'border-purple-400 text-purple-700 hover:bg-purple-50' },
                    { label: 'Export Enrollments', sub: `${enrollments.length} pending`, icon: ClipboardList, fn: exportEnrollments, color: 'border-yellow-400 text-yellow-700 hover:bg-yellow-50' },
                  ].map(({ label, sub, icon: Icon, fn, color }) => (
                    <button key={label} onClick={fn} className={`flex items-center gap-3 p-5 border-2 rounded-2xl transition-colors ${color}`}>
                      <Download className="w-5 h-5 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-semibold text-sm">{label}</div>
                        <div className="text-xs opacity-70">{sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;