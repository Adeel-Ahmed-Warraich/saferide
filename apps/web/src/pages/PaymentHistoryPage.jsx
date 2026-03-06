import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useToast } from '@/hooks/use-toast.js';

const PaymentHistoryPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        let filterStr = `parentId="${currentUser.id}"`;
        if (filter !== 'All') {
          filterStr += ` && status="${filter}"`;
        }
        const res = await pb.collection('payments').getList(1, 50, {
          filter: filterStr,
          sort: '-created',
          $autoCancel: false
        });
        setPayments(res.items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [currentUser.id, filter]);

  const handleDownloadReceipt = (payment) => {
    // Dummy PDF generation - in a real app, use jsPDF or similar
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for Rs. ${payment.amount} saved to your device.`,
    });
    // Simulate print view
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Receipt</title><style>body{font-family:sans-serif;padding:40px;}</style></head><body>
      <h2>SafeRide Payment Receipt</h2>
      <p><strong>Date:</strong> ${new Date(payment.created).toLocaleDateString()}</p>
      <p><strong>Amount:</strong> Rs. ${payment.amount}</p>
      <p><strong>Method:</strong> ${payment.paymentMethod}</p>
      <p><strong>Status:</strong> ${payment.status}</p>
      <p><strong>Transaction ID:</strong> ${payment.transactionId || 'N/A'}</p>
      <hr/><p>Thank you for choosing SafeRide!</p>
      <script>window.print();window.close();</script>
      </body></html>
    `);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'PendingAdminApproval': return 'bg-blue-100 text-blue-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet><title>Payment History - SafeRide</title></Helmet>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-yellow-500" /> Payment History
            </h1>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading payments...</div>
            ) : payments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No payments found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 font-semibold text-gray-600">Date</th>
                      <th className="p-4 font-semibold text-gray-600">Child</th>
                      <th className="p-4 font-semibold text-gray-600">Amount</th>
                      <th className="p-4 font-semibold text-gray-600">Method</th>
                      <th className="p-4 font-semibold text-gray-600">Status</th>
                      <th className="p-4 font-semibold text-gray-600 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-gray-800">{new Date(payment.created).toLocaleDateString()}</td>
                        <td className="p-4 text-gray-700 font-medium">{payment.childLabel || currentUser.childName || '—'}</td>
                        <td className="p-4 font-medium text-gray-900">Rs. {payment.amount}</td>
                        <td className="p-4 text-gray-600">{payment.paymentMethod}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                            {payment.status === 'PendingAdminApproval' ? 'Verifying' : payment.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadReceipt(payment)} className="text-blue-800 hover:bg-blue-50">
                            <Download className="w-4 h-4 mr-2" /> Receipt
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