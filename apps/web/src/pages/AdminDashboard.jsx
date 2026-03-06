import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { useToast } from '@/hooks/use-toast.js';
import {
  Users, CreditCard, Bell, Truck, FileBarChart, Check, X,
  Plus, Search, TrendingUp, DollarSign, AlertTriangle, Activity,
  Download, Eye, UserCheck, Edit2, Trash2, LogOut, ClipboardList,
  UserPlus, Clock, CheckCircle2, XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import ChangePasswordModal from '@/components/ChangePasswordModal.jsx';

// ─── Add/Edit Parent Modal ────────────────────────────────────────────────────
const ParentModal = ({ parent, onClose, onSave }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: parent?.fullName || '',
    email: parent?.email || '',
    password: '',
    phoneNumber: parent?.phoneNumber || '',
    childName: parent?.childName || '',
    childClass: parent?.childClass || '',
    schoolName: parent?.schoolName || '',
    homeAddress: parent?.homeAddress || '',
    preferredShift: parent?.preferredShift || 'Morning',
    enrollmentStatus: parent?.enrollmentStatus || 'Pending',
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (parent) {
        const data = { ...form };
        if (!data.password) delete data.password;
        else { data.passwordConfirm = data.password; }
        await pb.collection('parents').update(parent.id, data, { $autoCancel: false });
        toast({ title: 'Parent updated successfully' });
      } else {
        await pb.collection('parents').create({
          ...form,
          passwordConfirm: form.password,
          emailVisibility: true,
        }, { $autoCancel: false });
        toast({ title: 'Parent added successfully' });
      }
      onSave();
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-blue-900">{parent ? 'Edit Parent' : 'Add New Parent'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Full Name *</Label>
              <Input name="fullName" required value={form.fullName} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label>Email *</Label>
              <Input name="email" type="email" required value={form.email} onChange={handleChange} className="mt-1" disabled={!!parent} />
            </div>
            <div>
              <Label>{parent ? 'New Password (leave blank to keep)' : 'Password *'}</Label>
              <Input name="password" type="password" required={!parent} value={form.password} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="+92 300 1234567" className="mt-1" />
            </div>
            <div>
              <Label>Enrollment Status</Label>
              <select name="enrollmentStatus" value={form.enrollmentStatus} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Pending</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </div>
            <div>
              <Label>Child Name</Label>
              <Input name="childName" value={form.childName} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label>Child Class</Label>
              <Input name="childClass" value={form.childClass} onChange={handleChange} placeholder="e.g., Grade 5" className="mt-1" />
            </div>
            <div>
              <Label>School Name</Label>
              <Input name="schoolName" value={form.schoolName} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label>Preferred Shift</Label>
              <select name="preferredShift" value={form.preferredShift} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Both</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Home Address</Label>
              <Textarea name="homeAddress" value={form.homeAddress} onChange={handleChange} rows={2} className="mt-1" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-blue-800 hover:bg-blue-900 text-white">
              {loading ? 'Saving...' : (parent ? 'Update Parent' : 'Add Parent')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Van Modal ────────────────────────────────────────────────────────────────
const VanModal = ({ van, onClose, onSave }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vanId: van?.vanId || '',
    driverName: van?.driverName || '',
    driverPhone: van?.driverPhone || '',
    capacity: van?.capacity || 7,
    status: van?.status || 'Active',
    licensePlate: van?.licensePlate || '',
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

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
      onSave();
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-blue-900">{van ? 'Edit Van' : 'Add New Van'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Van ID *</Label>
              <Input name="vanId" required value={form.vanId} onChange={handleChange} placeholder="V-001" className="mt-1" />
            </div>
            <div>
              <Label>License Plate</Label>
              <Input name="licensePlate" value={form.licensePlate} onChange={handleChange} placeholder="LHR-1234" className="mt-1" />
            </div>
            <div>
              <Label>Driver Name *</Label>
              <Input name="driverName" required value={form.driverName} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label>Driver Phone</Label>
              <Input name="driverPhone" value={form.driverPhone} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input name="capacity" type="number" min={1} max={15} value={form.capacity} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label>Status</Label>
              <select name="status" value={form.status} onChange={handleChange} className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-blue-800 hover:bg-blue-900 text-white">
              {loading ? 'Saving...' : (van ? 'Update Van' : 'Add Van')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main AdminDashboard ──────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [parents, setParents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParent, setSearchParent] = useState('');
  const [searchPayment, setSearchPayment] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [approvedEnrollments, setApprovedEnrollments] = useState([]); // second children
  const [searchEnrollment, setSearchEnrollment] = useState('');
  const [approvingId, setApprovingId] = useState(null);

  const [showParentModal, setShowParentModal] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [showVanModal, setShowVanModal] = useState(false);
  const [editingVan, setEditingVan] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Notification Form State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifLoading, setNotifLoading] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const safeFetch = async (collectionFn, label) => {
    try {
      return await collectionFn();
    } catch (err) {
      console.error(`[SafeRide] Failed to fetch ${label} — Status: ${err?.status}, Error: ${err?.message}`, err?.data);
      return { items: [] };
    }
  };

  const fetchData = async () => {
    setLoading(true);

    // Build request options — send admin token explicitly so PocketBase
    // knows this request is coming from an authenticated admin
    const token = pb.authStore.token;
    const headers = token ? { 'Authorization': token } : {};

    const [parentsRes, paymentsRes, vansRes, enrollmentsRes, approvedEnrollmentsRes, notifRes] = await Promise.all([
      safeFetch(() => pb.collection('parents').getList(1, 500, {
        $autoCancel: false,
        headers,
      }), 'parents'),
      safeFetch(() => pb.collection('payments').getList(1, 500, {
        sort: '-created',
        expand: 'parentId',
        $autoCancel: false,
        headers,
      }), 'payments'),
      safeFetch(() => pb.collection('vans').getList(1, 100, {
        $autoCancel: false,
        headers,
      }), 'vans'),
      safeFetch(() => pb.collection('enrollments').getList(1, 500, {
        sort: '-created',
        filter: 'status != "approved" && status != "rejected"',
        $autoCancel: false,
        headers,
      }), 'enrollments'),
      safeFetch(() => pb.collection('enrollments').getList(1, 500, {
        sort: '-created',
        filter: 'status = "approved"',
        $autoCancel: false,
        headers,
      }), 'approvedEnrollments'),
      safeFetch(() => pb.collection('notifications').getList(1, 100, {
        sort: '-created',
        $autoCancel: false,
        headers,
      }), 'notifications'),
    ]);

    setParents(parentsRes.items);
    setPayments(paymentsRes.items);
    setVans(vansRes.items);
    setEnrollments(enrollmentsRes.items);
    setApprovedEnrollments(approvedEnrollmentsRes.items);
    setSentNotifications(notifRes.items);
    setLoading(false);
  };

  const handleApproveEnrollment = async (enrollment) => {
    setApprovingId(enrollment.id);

    const defaultPassword = enrollment.contactNumber
      ? enrollment.contactNumber.replace(/\s/g, '').slice(-8) + 'SR!'
      : 'SafeRide@123';

    // ── Step 1: Check if parent account already exists ──────────────────────
    let existingParent = null;
    try {
      const existing = await pb.collection('parents').getList(1, 1, {
        filter: `email="${enrollment.email}"`,
        $autoCancel: false,
      });
      if (existing.items.length > 0) existingParent = existing.items[0];
    } catch (err) {
      console.warn('[approve] Could not check existing parents:', err.message);
    }

    // ── Step 2a: EXISTING PARENT — second child scenario ────────────────────
    if (existingParent) {
      // Update parent status to Active
      let updateOk = false;
      try {
        await pb.collection('parents').update(existingParent.id, {
          enrollmentStatus: 'Active',
        }, { $autoCancel: false });
        updateOk = true;
      } catch (err) {
        console.error('[approve] Parent update failed:', err);
        toast({
          title: 'Update Failed — enrollment kept',
          description: `Could not update parent: ${err.message}`,
          variant: 'destructive',
        });
        setApprovingId(null);
        return;
      }

      // Mark enrollment as approved (NOT deleted) so parent dashboard shows this child
      if (updateOk) {
        try {
          await pb.collection('enrollments').update(enrollment.id, {
            status: 'approved',
          }, { $autoCancel: false });
        } catch (err) {
          console.warn('[approve] Could not mark enrollment approved:', err.message);
        }
        toast({
          title: '✓ Second Child Approved',
          description: `${enrollment.childName} (${enrollment.childClass}) approved under ${enrollment.email}'s account.`,
        });
        fetchData();
      }

      setApprovingId(null);
      return;
    }

    // ── Step 2b: NEW PARENT — create account ────────────────────────────────
    let createOk = false;
    try {
      await pb.collection('parents').create({
        email:               enrollment.email,
        password:            defaultPassword,
        passwordConfirm:     defaultPassword,
        emailVisibility:     true,
        fullName:            enrollment.parentName,
        phoneNumber:         enrollment.contactNumber,
        childName:           enrollment.childName,
        childClass:          enrollment.childClass,
        schoolName:          enrollment.schoolName,
        homeAddress:         enrollment.homeAddress,
        preferredShift:      enrollment.preferredShift,
        specialInstructions: enrollment.specialInstructions || '',
        enrollmentStatus:    'Active',
      }, { $autoCancel: false });
      createOk = true;
    } catch (err) {
      console.error('[approve] Parent create failed:', err, err?.data);
      // If email conflict means parent actually exists (race condition), fetch again
      if (err?.data?.email?.code === 'validation_not_unique') {
        toast({
          title: 'Email Already Exists',
          description: `A parent with ${enrollment.email} already exists. Refresh and try again.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Create Failed — enrollment kept',
          description: err.message || 'Unknown error. Check browser console for details.',
          variant: 'destructive',
        });
      }
      setApprovingId(null);
      return; // ← stop here, do NOT delete enrollment
    }

    // Only delete enrollment if create succeeded
    if (createOk) {
      try {
        await pb.collection('enrollments').delete(enrollment.id, { $autoCancel: false });
      } catch (err) {
        console.warn('[approve] Could not delete enrollment after create:', err.message);
      }
      toast({
        title: '✓ Parent Account Created',
        description: `Login: ${enrollment.email} · Password: ${defaultPassword}`,
      });
      fetchData();
    }

    setApprovingId(null);
  };

  const handleRejectEnrollment = async (id) => {
    if (!confirm('Reject this enrollment request? The applicant will be notified by email.')) return;
    try {
      // Set status = rejected FIRST so the pb_hook can send the rejection email
      await pb.collection('enrollments').update(id, { status: 'rejected' }, { $autoCancel: false });
      // Then delete after a short delay to allow hook to fire
      setTimeout(async () => {
        try { await pb.collection('enrollments').delete(id, { $autoCancel: false }); } catch (_) {}
      }, 2000);
      toast({ title: 'Enrollment rejected — applicant will be notified by email' });
      fetchData();
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const handleApprovePayment = async (id) => {
    try {
      await pb.collection('payments').update(id, { status: 'Paid' }, { $autoCancel: false });
      toast({ title: 'Payment Approved ✓' });
      fetchData();
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const handleRejectPayment = async (id) => {
    try {
      await pb.collection('payments').update(id, { status: 'Rejected' }, { $autoCancel: false });
      toast({ title: 'Payment Rejected' });
      fetchData();
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const handleUpdateEnrollment = async (id, status) => {
    try {
      await pb.collection('parents').update(id, { enrollmentStatus: status }, { $autoCancel: false });
      toast({ title: `Status updated to ${status}` });
      fetchData();
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
  };

  const handleDeleteParent = async (id) => {
    if (!confirm('Are you sure you want to delete this parent?')) return;
    try {
      await pb.collection('parents').delete(id, { $autoCancel: false });
      toast({ title: 'Parent deleted' });
      fetchData();
    } catch (e) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setNotifLoading(true);
    try {
      await pb.collection('notifications').create({
        title: notifTitle,
        message: notifMsg,
        type: 'Broadcast',
        isRead: false,
        parentId: ''
      }, { $autoCancel: false });
      toast({ title: 'Broadcast sent to all parents ✓' });
      setNotifTitle(''); setNotifMsg('');
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); }
    finally { setNotifLoading(false); }
  };

  // ── CSV Export ──────────────────────────────────────────────────────────────
  const exportCSV = (data, filename, columns) => {
    const header = columns.map(c => c.label).join(',');
    const rows = data.map(row =>
      columns.map(c => {
        const val = c.get ? c.get(row) : row[c.key] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast({ title: `${filename} downloaded ✓` });
  };

  const exportPayments = () => exportCSV(payments, 'saferide_payments.csv', [
    { label: 'Parent', get: r => r.expand?.parentId?.fullName || 'Unknown' },
    { label: 'Amount (Rs)', key: 'amount' },
    { label: 'Method', key: 'paymentMethod' },
    { label: 'Status', key: 'status' },
    { label: 'Transaction ID', key: 'transactionId' },
    { label: 'Date', get: r => new Date(r.created).toLocaleDateString() },
  ]);

  const exportParents = () => exportCSV(parents, 'saferide_parents.csv', [
    { label: 'Full Name', key: 'fullName' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phoneNumber' },
    { label: 'Child Name', key: 'childName' },
    { label: 'Class', key: 'childClass' },
    { label: 'School', key: 'schoolName' },
    { label: 'Shift', key: 'preferredShift' },
    { label: 'Status', key: 'enrollmentStatus' },
    { label: 'Address', key: 'homeAddress' },
  ]);

  const exportEnrollments = () => exportCSV(enrollments, 'saferide_enrollments.csv', [
    { label: 'Parent Name', key: 'parentName' },
    { label: 'Email', key: 'email' },
    { label: 'Contact', key: 'contactNumber' },
    { label: 'Child Name', key: 'childName' },
    { label: 'Class', key: 'childClass' },
    { label: 'School', key: 'schoolName' },
    { label: 'Address', key: 'homeAddress' },
    { label: 'Shift', key: 'preferredShift' },
    { label: 'Special Instructions', key: 'specialInstructions' },
    { label: 'Submitted On', get: r => new Date(r.created).toLocaleDateString() },
  ]);

  const exportVans = () => exportCSV(vans, 'saferide_fleet.csv', [
    { label: 'Van ID', key: 'vanId' },
    { label: 'Driver', key: 'driverName' },
    { label: 'Driver Phone', key: 'driverPhone' },
    { label: 'License Plate', key: 'licensePlate' },
    { label: 'Capacity', key: 'capacity' },
    { label: 'Status', key: 'status' },
  ]);

  // ── Stats ────────────────────────────────────────────────────────────────────
  const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + (p.amount || 0), 0);
  const pendingPayments = payments.filter(p => p.status === 'Pending' || p.status === 'PendingAdminApproval').length;
  const activeParents = parents.filter(p => p.enrollmentStatus === 'Active').length;
  const activeVans = vans.filter(v => v.status === 'Active').length;

  // ── Filtered lists ────────────────────────────────────────────────────────────
  const filteredParents = parents.filter(p =>
    !searchParent || p.fullName?.toLowerCase().includes(searchParent.toLowerCase()) ||
    p.childName?.toLowerCase().includes(searchParent.toLowerCase()) ||
    p.phoneNumber?.includes(searchParent)
  );

  const filteredEnrollments = enrollments.filter(e =>
    !searchEnrollment ||
    e.parentName?.toLowerCase().includes(searchEnrollment.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchEnrollment.toLowerCase()) ||
    e.childName?.toLowerCase().includes(searchEnrollment.toLowerCase())
  );

  const filteredPayments = payments.filter(p =>
    !searchPayment || (p.expand?.parentId?.fullName || '').toLowerCase().includes(searchPayment.toLowerCase()) ||
    (p.transactionId || '').toLowerCase().includes(searchPayment.toLowerCase())
  );

  const handleLogout = () => { logout(); navigate('/'); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-800 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );

  const statusBadge = (status, map) => {
    const cfg = map[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>{status}</span>;
  };

  const enrollmentColors = { Active: { bg: 'bg-green-100', text: 'text-green-800' }, Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' }, Suspended: { bg: 'bg-red-100', text: 'text-red-800' } };
  const paymentColors = { Paid: { bg: 'bg-green-100', text: 'text-green-800' }, Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' }, PendingAdminApproval: { bg: 'bg-blue-100', text: 'text-blue-800' }, Overdue: { bg: 'bg-red-100', text: 'text-red-800' }, Rejected: { bg: 'bg-gray-100', text: 'text-gray-700' } };
  const vanColors = { Active: { bg: 'bg-green-100', text: 'text-green-800' }, Inactive: { bg: 'bg-gray-100', text: 'text-gray-700' }, Maintenance: { bg: 'bg-orange-100', text: 'text-orange-800' } };

  return (
    <>
      <Helmet><title>Admin Dashboard - SafeRide</title></Helmet>

      {showParentModal && (
        <ParentModal
          parent={editingParent}
          onClose={() => { setShowParentModal(false); setEditingParent(null); }}
          onSave={fetchData}
        />
      )}
      {showVanModal && (
        <VanModal
          van={editingVan}
          onClose={() => { setShowVanModal(false); setEditingVan(null); }}
          onSave={fetchData}
        />
      )}
      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}

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
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-green-600', sub: 'Paid payments' },
              { label: 'Active Parents', value: activeParents, icon: UserCheck, color: 'from-blue-500 to-blue-700', sub: `${parents.length} total` },
              { label: 'Pending Payments', value: pendingPayments, icon: AlertTriangle, color: 'from-yellow-500 to-orange-500', sub: 'Awaiting approval' },
              { label: 'Active Vans', value: activeVans, icon: Activity, color: 'from-purple-500 to-purple-700', sub: `${vans.length} total fleet` },
            ].map((s, i) => (
              <div key={i} className={`bg-gradient-to-br ${s.color} text-white p-5 rounded-2xl shadow-lg`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-white/80 mb-1">{s.label}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-white/70 mt-1">{s.sub}</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-xl">
                    <s.icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="enrollments" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 bg-white p-1 rounded-xl shadow-sm h-auto">
              <TabsTrigger value="enrollments" className="py-2.5 text-xs sm:text-sm relative">
                <ClipboardList className="w-4 h-4 mr-1 hidden sm:inline"/> Enrollments
                {enrollments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {enrollments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="parents" className="py-2.5 text-xs sm:text-sm"><Users className="w-4 h-4 mr-1 hidden sm:inline"/> Parents</TabsTrigger>
              <TabsTrigger value="payments" className="py-2.5 text-xs sm:text-sm"><CreditCard className="w-4 h-4 mr-1 hidden sm:inline"/> Payments</TabsTrigger>
              <TabsTrigger value="vans" className="py-2.5 text-xs sm:text-sm"><Truck className="w-4 h-4 mr-1 hidden sm:inline"/> Vans</TabsTrigger>
              <TabsTrigger value="notifications" className="py-2.5 text-xs sm:text-sm"><Bell className="w-4 h-4 mr-1 hidden sm:inline"/> Notify</TabsTrigger>
              <TabsTrigger value="reports" className="py-2.5 text-xs sm:text-sm"><FileBarChart className="w-4 h-4 mr-1 hidden sm:inline"/> Reports</TabsTrigger>
            </TabsList>

            {/* ── Enrollments Tab ───────────────────────────────────────────────── */}
            <TabsContent value="enrollments" className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <div>
                  <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" /> Pending Enrollment Requests ({enrollments.length})
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">These are booking form submissions awaiting review. Approved and rejected records are hidden.</p>
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
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Parent Name</p>
                            <p className="font-semibold text-gray-900 mt-0.5">{e.parentName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                            <p className="font-medium text-gray-800 mt-0.5 text-sm">{e.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Contact</p>
                            <p className="font-medium text-gray-800 mt-0.5 text-sm">{e.contactNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Child</p>
                            <p className="font-medium text-gray-800 mt-0.5 text-sm">{e.childName} — {e.childClass}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">School</p>
                            <p className="font-medium text-gray-800 mt-0.5 text-sm">{e.schoolName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Shift / Submitted</p>
                            <p className="font-medium text-gray-800 mt-0.5 text-sm">{e.preferredShift} · {new Date(e.created).toLocaleDateString()}</p>
                          </div>
                          {e.homeAddress && (
                            <div className="col-span-2 sm:col-span-3">
                              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Address</p>
                              <p className="font-medium text-gray-800 mt-0.5 text-sm">{e.homeAddress}</p>
                            </div>
                          )}
                          {e.specialInstructions && (
                            <div className="col-span-2 sm:col-span-3">
                              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Special Instructions</p>
                              <p className="text-sm text-gray-600 mt-0.5 italic">{e.specialInstructions}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex md:flex-col gap-2 md:w-36 flex-shrink-0">
                          <Button
                            onClick={() => handleApproveEnrollment(e)}
                            disabled={approvingId === e.id}
                            className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white text-sm"
                          >
                            {approvingId === e.id ? (
                              <span className="flex items-center gap-1"><span className="animate-spin">⏳</span> Creating...</span>
                            ) : (
                              <span className="flex items-center gap-1"><UserPlus className="w-4 h-4" /> Approve</span>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleRejectEnrollment(e.id)}
                            variant="outline"
                            className="flex-1 md:flex-none border-red-300 text-red-600 hover:bg-red-50 text-sm"
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── Parents Tab ──────────────────────────────────────────────────── */}
            <TabsContent value="parents" className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2"><Users className="w-5 h-5" /> Registered Parents ({parents.length}) · {parents.length + approvedEnrollments.length} Children Total</h2>
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
                      <th className="p-3 font-semibold text-gray-600">Status</th>
                      <th className="p-3 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParents.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-gray-400">No parents found</td></tr>
                    ) : filteredParents.map(p => {
                      const siblings = approvedEnrollments.filter(e => e.email === p.email);
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
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                                    {s.childName} ({s.childClass})
                                  </div>
                                  <div className="text-xs text-gray-400">{s.schoolName} · {s.preferredShift}</div>
                                </div>
                              ))}
                            </td>
                            <td className="p-3 text-gray-600 hidden sm:table-cell">{p.phoneNumber}</td>
                            <td className="p-3">
                              <select
                                value={p.enrollmentStatus}
                                onChange={e => handleUpdateEnrollment(p.id, e.target.value)}
                                className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${enrollmentColors[p.enrollmentStatus]?.bg || 'bg-gray-100'} ${enrollmentColors[p.enrollmentStatus]?.text || 'text-gray-700'}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1">
                                <button onClick={() => { setEditingParent(p); setShowParentModal(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Edit">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteParent(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
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

            {/* ── Payments Tab ─────────────────────────────────────────────────── */}
            <TabsContent value="payments" className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Management</h2>
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={searchPayment} onChange={e => setSearchPayment(e.target.value)} placeholder="Search by name or ID..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-3 font-semibold text-gray-600">Parent</th>
                      <th className="p-3 font-semibold text-gray-600">Amount</th>
                      <th className="p-3 font-semibold text-gray-600 hidden sm:table-cell">Method</th>
                      <th className="p-3 font-semibold text-gray-600 hidden md:table-cell">Txn ID</th>
                      <th className="p-3 font-semibold text-gray-600">Status</th>
                      <th className="p-3 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-gray-400">No payments found</td></tr>
                    ) : filteredPayments.map(p => (
                      <tr key={p.id} className="border-b hover:bg-gray-50/70 transition-colors">
                        <td className="p-3">
                          <div className="font-medium">{p.expand?.parentId?.fullName || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{new Date(p.created).toLocaleDateString()}</div>
                        </td>
                        <td className="p-3 font-semibold text-gray-900">Rs. {p.amount}</td>
                        <td className="p-3 text-gray-600 hidden sm:table-cell">{p.paymentMethod}</td>
                        <td className="p-3 text-xs text-gray-500 font-mono hidden md:table-cell">{p.transactionId || 'N/A'}</td>
                        <td className="p-3">{statusBadge(p.status, paymentColors)}</td>
                        <td className="p-3 text-right">
                          {(p.status === 'Pending' || p.status === 'PendingAdminApproval') && (
                            <div className="flex justify-end gap-1">
                              <button onClick={() => handleApprovePayment(p.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors">
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button onClick={() => handleRejectPayment(p.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors">
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* ── Vans Tab ─────────────────────────────────────────────────────── */}
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
                      <th className="p-3 font-semibold text-gray-600">Status</th>
                      <th className="p-3 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vans.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-gray-400">No vans added yet</td></tr>
                    ) : vans.map(v => (
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
                        <td className="p-3">{statusBadge(v.status, vanColors)}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => { setEditingVan(v); setShowVanModal(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* ── Notifications Tab ────────────────────────────────────────────── */}
            <TabsContent value="notifications" className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2"><Bell className="w-5 h-5" /> Send Broadcast Notification</h2>
              <form onSubmit={handleSendBroadcast} className="max-w-xl space-y-4">
                <div>
                  <Label className="text-sm font-medium">Notification Title *</Label>
                  <Input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} required className="mt-1.5" placeholder="e.g., Fee Reminder - March 2026" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Message *</Label>
                  <Textarea value={notifMsg} onChange={e => setNotifMsg(e.target.value)} required rows={5} className="mt-1.5" placeholder="Write your message to all parents here..." />
                </div>
                <Button type="submit" disabled={notifLoading} className="bg-blue-800 hover:bg-blue-900 text-white w-full sm:w-auto px-8">
                  <Bell className="w-4 h-4 mr-2" />
                  {notifLoading ? 'Sending...' : `Send to All Parents (${parents.length})`}
                </Button>
              </form>

              <div className="mt-10 border-t pt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Templates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: 'Monthly Fee Reminder', msg: 'Dear parent, your monthly transport fee is due. Please make the payment via your parent dashboard to avoid service interruption. Thank you!' },
                    { title: 'Eid Holiday Notice', msg: 'Dear parent, SafeRide will be off from [DATE] to [DATE] for Eid holidays. Service will resume on [DATE]. Eid Mubarak!' },
                    { title: 'Route Change Notice', msg: 'Dear parent, please note that the van route has been slightly adjusted. Your child\'s pickup time may change by 10-15 minutes. We will update you with exact times.' },
                    { title: 'New Year Start', msg: 'Dear parent, we are ready to serve you in the new academic year! Please ensure your account is active and fees are up to date. Welcome back!' },
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
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Sent Notifications ({sentNotifications.length})
                </h3>
                {sentNotifications.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No notifications sent yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sentNotifications.map(n => (
                      <div key={n.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm
                          ${n.type === 'Broadcast' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {n.type === 'Broadcast' ? '📢' : '🔔'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                              ${n.type === 'Broadcast' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                              {n.type}
                            </span>
                            {!n.parentId && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">All Parents</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(n.created).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── Reports Tab ──────────────────────────────────────────────────── */}
            <TabsContent value="reports" className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Reports & Analytics</h2>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Parents', value: parents.length, sub: `${activeParents} active` },
                  { label: 'Total Payments', value: payments.length, sub: `${pendingPayments} pending` },
                  { label: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, sub: 'Paid only' },
                  { label: 'Fleet Size', value: vans.length, sub: `${activeVans} active` },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-2xl font-bold text-blue-900">{s.value}</div>
                    <div className="text-sm font-medium text-gray-700 mt-1">{s.label}</div>
                    <div className="text-xs text-gray-500">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Payment Breakdown */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Payment Status Breakdown</h3>
                <div className="flex flex-wrap gap-3">
                  {['Paid', 'Pending', 'PendingAdminApproval', 'Overdue', 'Rejected'].map(status => {
                    const count = payments.filter(p => p.status === status).length;
                    const amount = payments.filter(p => p.status === status).reduce((s, p) => s + (p.amount || 0), 0);
                    if (count === 0) return null;
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

              {/* Shift Breakdown */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Enrollment by Shift</h3>
                <div className="flex flex-wrap gap-3">
                  {['Morning', 'Afternoon', 'Both'].map(shift => {
                    const count = parents.filter(p => p.preferredShift === shift).length;
                    return (
                      <div key={shift} className="bg-blue-50 text-blue-800 px-4 py-3 rounded-xl border border-blue-100">
                        <div className="font-bold text-lg">{count}</div>
                        <div className="text-xs font-medium">{shift} Shift</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Export Buttons */}
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-3">Export Data (CSV)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Export Payments', sub: `${payments.length} records`, icon: CreditCard, fn: exportPayments, color: 'border-green-400 text-green-700 hover:bg-green-50' },
                    { label: 'Export Parents', sub: `${parents.length} records`, icon: Users, fn: exportParents, color: 'border-blue-400 text-blue-700 hover:bg-blue-50' },
                    { label: 'Export Fleet', sub: `${vans.length} vans`, icon: Truck, fn: exportVans, color: 'border-purple-400 text-purple-700 hover:bg-purple-50' },
                    { label: 'Export Enrollments', sub: `${enrollments.length} pending`, icon: ClipboardList, fn: exportEnrollments, color: 'border-yellow-400 text-yellow-700 hover:bg-yellow-50' },
                  ].map(({ label, sub, icon: Icon, fn, color }) => (
                    <button key={label} onClick={fn} className={`flex items-center gap-3 p-5 border-2 rounded-2xl transition-colors ${color}`}>
                      <div className="flex-shrink-0">
                        <Download className="w-5 h-5" />
                      </div>
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