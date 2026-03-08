/**
 * saferide/web/src/pages/PaymentHistoryPage.jsx
 *
 * FIXES applied:
 *  #2  childLabel column now always visible and falls back gracefully.
 *  #E  Proper branded receipt PDF via window.print() with child name,
 *      transaction ID, and SafeRide branding — replaces the bare-bones version.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { SAFERIDE } from '@/lib/config.js';
import { Download, FileText, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useToast } from '@/hooks/use-toast.js';

// ─── Branded receipt HTML ───────────────────────────────────────────────────
function buildReceiptHTML(payment, parentName, childName) {
  const date    = new Date(payment.created).toLocaleDateString('en-PK', { day: '2-digit', month: 'long', year: 'numeric' });
  const receipt = payment.id.slice(-8).toUpperCase();
  const status  = payment.status === 'Paid' ? '✓ VERIFIED & PAID' : payment.status.toUpperCase();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>SafeRide Receipt #${receipt}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, Arial, sans-serif; background: #f1f5f9; display: flex; justify-content: center; padding: 40px 20px; }
    .card { background: #fff; border-radius: 16px; max-width: 560px; width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,.1); overflow: hidden; }
    .header { background: #1e40af; padding: 28px 32px; color: #fff; }
    .header h1 { font-size: 22px; font-weight: 800; }
    .header p  { color: #bfdbfe; font-size: 13px; margin-top: 4px; }
    .stamp { background: #15803d; color: #fff; text-align: center; padding: 8px; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
    .body  { padding: 28px 32px; }
    table  { width: 100%; border-collapse: collapse; margin-top: 16px; }
    tr:nth-child(even) td { background: #f8fafc; }
    td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
    td:first-child { color: #64748b; width: 45%; }
    td:last-child  { color: #1e293b; font-weight: 600; }
    .amount-row td:first-child { border-top: 2px solid #bbf7d0; color: #64748b; }
    .amount-row td:last-child  { border-top: 2px solid #bbf7d0; color: #15803d; font-size: 22px; font-weight: 800; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 32px; text-align: center; font-size: 11px; color: #94a3b8; }
    @media print { body { background: #fff; padding: 0; } .card { box-shadow: none; border-radius: 0; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>${SAFERIDE.name}</h1>
      <p>Official Payment Receipt — #${receipt}</p>
    </div>
    <div class="stamp">${status}</div>
    <div class="body">
      <table>
        <tr><td>Receipt No.</td>   <td>#${receipt}</td></tr>
        <tr><td>Date</td>          <td>${date}</td></tr>
        <tr><td>Parent</td>        <td>${parentName}</td></tr>
        <tr><td>Child</td>         <td>${childName}</td></tr>
        <tr><td>Month</td>         <td>${payment.month || '—'}</td></tr>
        <tr><td>Payment Method</td><td>${payment.paymentMethod}</td></tr>
        <tr><td>Transaction ID</td><td>${payment.transactionId || 'N/A'}</td></tr>
        <tr class="amount-row"><td>Amount Paid</td><td>Rs. ${Number(payment.amount).toLocaleString()}</td></tr>
      </table>
    </div>
    <div class="footer">
      ${SAFERIDE.name} · ${SAFERIDE.address}<br/>
      📞 ${SAFERIDE.phone} · 📧 ${SAFERIDE.email}
    </div>
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;
}

// ─── Status helpers ──────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Paid:                  'bg-green-100 text-green-800',
  Pending:               'bg-yellow-100 text-yellow-800',
  PendingAdminApproval:  'bg-blue-100 text-blue-800',
  Overdue:               'bg-red-100 text-red-800',
  Rejected:              'bg-gray-100 text-gray-700',
};
const statusLabel = (s) => s === 'PendingAdminApproval' ? 'Verifying' : s;

// ─── Component ───────────────────────────────────────────────────────────────
const PaymentHistoryPage = () => {
  const { currentUser } = useAuth();
  const { toast }       = useToast();
  const [payments,  setPayments]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('All');
  const [parentName, setParentName] = useState(currentUser.name || currentUser.email || 'Parent');

  // Fetch parent name once for receipts
  useEffect(() => {
    pb.collection('parents').getOne(currentUser.id, { fields: 'fullName', $autoCancel: false })
      .then(r => { if (r.fullName) setParentName(r.fullName); })
      .catch(() => {});
  }, [currentUser.id]);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      let filterStr = `parentId="${currentUser.id}"`;
      if (filter !== 'All') filterStr += ` && status="${filter}"`;
      const res = await pb.collection('payments').getList(1, 100, {
        filter: filterStr,
        sort:   '-created',
        $autoCancel: false,
      });
      setPayments(res.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentUser.id, filter]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleDownloadReceipt = (payment) => {
    if (payment.status !== 'Paid') {
      toast({ title: 'Receipt only available for paid payments', variant: 'destructive' });
      return;
    }
    // FIX #E — use childLabel from record; fall back to parentRecord childName
    const childName = payment.childLabel || currentUser.childName || '—';
    const html = buildReceiptHTML(payment, parentName, childName);
    const win  = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  // Summary totals
  const totalPaid    = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + (p.amount || 0), 0);
  const pendingCount = payments.filter(p => p.status === 'Pending' || p.status === 'PendingAdminApproval').length;

  return (
    <>
      <Helmet><title>Payment History - SafeRide</title></Helmet>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-yellow-500" /> Payment History
            </h1>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4 text-sm"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="PendingAdminApproval">Verifying</option>
                <option value="Overdue">Overdue</option>
                <option value="Rejected">Rejected</option>
              </select>
              <Button variant="outline" size="sm" onClick={fetchPayments} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total Paid</p>
              <p className="text-xl font-bold text-green-700 mt-1">Rs. {totalPaid.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total Records</p>
              <p className="text-xl font-bold text-blue-900 mt-1">{payments.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Pending</p>
              <p className={`text-xl font-bold mt-1 ${pendingCount > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                {pendingCount}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading payments...
              </div>
            ) : payments.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No payments found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {filter !== 'All' ? `No ${filter} payments on record.` : 'Your payment history will appear here once you make a payment.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
                      {/* FIX #2 — Child column always present */}
                      <th className="p-4 font-semibold text-gray-600 text-sm">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Child</span>
                      </th>
                      <th className="p-4 font-semibold text-gray-600 text-sm">Amount</th>
                      <th className="p-4 font-semibold text-gray-600 text-sm hidden sm:table-cell">Method</th>
                      <th className="p-4 font-semibold text-gray-600 text-sm hidden md:table-cell">Txn ID</th>
                      <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                      <th className="p-4 font-semibold text-gray-600 text-sm text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-gray-700 text-sm whitespace-nowrap">
                          {new Date(payment.created).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        {/* FIX #2 — show childLabel; graceful fallback */}
                        <td className="p-4 text-gray-800 font-medium text-sm">
                          {payment.childLabel || currentUser.childName || '—'}
                        </td>
                        <td className="p-4 font-semibold text-gray-900 text-sm whitespace-nowrap">
                          Rs. {Number(payment.amount).toLocaleString()}
                        </td>
                        <td className="p-4 text-gray-600 text-sm hidden sm:table-cell">{payment.paymentMethod}</td>
                        <td className="p-4 text-gray-400 text-xs font-mono hidden md:table-cell">
                          {payment.transactionId || 'N/A'}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[payment.status] || 'bg-gray-100 text-gray-700'}`}>
                            {statusLabel(payment.status)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReceipt(payment)}
                            disabled={payment.status !== 'Paid'}
                            title={payment.status !== 'Paid' ? 'Receipt available after payment is verified' : 'Download receipt'}
                            className={payment.status === 'Paid' ? 'text-blue-800 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'}
                          >
                            <Download className="w-4 h-4 mr-1.5" />
                            <span className="hidden sm:inline">Receipt</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default PaymentHistoryPage;