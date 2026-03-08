/**
 * saferide/web/src/pages/PaymentPage.jsx
 *
 * FIXES applied:
 *  #1  Fetch fresh parent record (getOne) instead of relying on stale
 *      currentUser.childName from auth token payload.
 *  #F  Image compression via browser-image-compression before upload.
 *  #S  Centralised SAFERIDE config (bank details, merchant IDs).
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { SAFERIDE } from '@/lib/config.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { CreditCard, UploadCloud, User, Loader2 } from 'lucide-react';

// ─── Inline image compressor (no extra dep needed for typical screenshots) ──
// Resizes + quality-reduces images > 1 MB before upload to PocketBase.
async function compressImage(file, maxSizeKB = 800) {
  if (!file || file.size / 1024 <= maxSizeKB) return file;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        // Scale down proportionally if very large
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width  = Math.round(width  * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob ? new File([blob], file.name, { type: 'image/jpeg' }) : file),
          'image/jpeg',
          0.75,
        );
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

const PaymentPage = () => {
  const { currentUser } = useAuth();
  const { toast }       = useToast();
  const navigate        = useNavigate();

  const [loading,       setLoading]       = useState(false);
  const [initLoading,   setInitLoading]   = useState(true);
  const [amount,        setAmount]        = useState(String(SAFERIDE.defaultMonthlyFee));
  const [phone,         setPhone]         = useState('');
  const [file,          setFile]          = useState(null);
  const [compressing,   setCompressing]   = useState(false);

  // Children list built from fresh parent record + approved sibling enrollments
  const [children,      setChildren]      = useState([]);
  const [selectedChild, setSelectedChild] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        // FIX #1 — fetch the live parent record, not the stale auth token model
        const parentRecord = await pb.collection('parents').getOne(currentUser.id, {
          $autoCancel: false,
        });
        const primaryLabel = parentRecord.childName || currentUser.childName || 'Child';

        // Approved sibling enrollments
        const sibRes = await pb.collection('enrollments').getList(1, 20, {
          filter: `email="${currentUser.email}" && status="approved"`,
          $autoCancel: false,
        });
        const siblings = sibRes.items.map(e => ({ label: e.childName, isPrimary: false }));

        const all = [{ label: primaryLabel, isPrimary: true }, ...siblings];
        setChildren(all);
        setSelectedChild(primaryLabel);

        // Pre-fill amount from latest pending payment if any
        const res = await pb.collection('payments').getList(1, 1, {
          filter: `parentId="${currentUser.id}" && status="Pending"`,
          $autoCancel: false,
        });
        if (res.items.length > 0) setAmount(res.items[0].amount.toString());
      } catch (e) {
        console.error('[PaymentPage] init error:', e);
        // Graceful fallback — still let the user pay
        const fallbackLabel = currentUser.childName || 'Child';
        setChildren([{ label: fallbackLabel, isPrimary: true }]);
        setSelectedChild(fallbackLabel);
      } finally {
        setInitLoading(false);
      }
    };
    init();
  }, [currentUser.id, currentUser.email, currentUser.childName]);

  const submitPayment = async (method, extraData = {}) => {
    await pb.collection('payments').create({
      parentId:      currentUser.id,
      childLabel:    selectedChild,
      amount:        Number(amount),
      dueDate:       new Date().toISOString(),
      paymentMethod: method,
      status:        'Pending',
      transactionId: `TXN-${Math.floor(Math.random() * 1_000_000)}`,
      ...extraData,
    }, { $autoCancel: false });
  };

  const handleMobilePayment = async (method) => {
    if (!phone)         { toast({ title: 'Phone number required', variant: 'destructive' }); return; }
    if (!selectedChild) { toast({ title: 'Please select a child', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      await submitPayment(method);
      toast({ title: 'Payment Request Submitted', description: `Please approve the prompt on your ${method} app.` });
      navigate('/payment-history');
    } catch (error) {
      toast({ title: 'Payment Failed', description: error.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const handleFileChange = async (e) => {
    const raw = e.target.files[0];
    if (!raw) return;
    setCompressing(true);
    try {
      const compressed = await compressImage(raw);
      setFile(compressed);
      if (compressed.size < raw.size) {
        toast({ title: `Image compressed: ${Math.round(compressed.size / 1024)} KB (was ${Math.round(raw.size / 1024)} KB)` });
      }
    } finally {
      setCompressing(false);
    }
  };

  const handleBankDeposit = async (e) => {
    e.preventDefault();
    if (!file)          { toast({ title: 'Screenshot required', variant: 'destructive' }); return; }
    if (!selectedChild) { toast({ title: 'Please select a child', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('parentId',        currentUser.id);
      formData.append('childLabel',      selectedChild);
      formData.append('amount',          amount);
      formData.append('dueDate',         new Date().toISOString());
      formData.append('paymentMethod',   'BankDeposit');
      formData.append('status',          'PendingAdminApproval');
      formData.append('bankScreenshotUrl', file);
      await pb.collection('payments').create(formData, { $autoCancel: false });
      toast({ title: 'Receipt Uploaded', description: 'Admin will verify your payment shortly.' });
      navigate('/payment-history');
    } catch (error) {
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  if (initLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-800" />
    </div>
  );

  return (
    <>
      <Helmet><title>Pay Fee - SafeRide</title></Helmet>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-yellow-500" /> Pay Monthly Fee
          </h1>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">

            {/* Child selector — only shown if multiple children */}
            {children.length > 1 && (
              <div>
                <Label className="text-base font-semibold text-gray-700 flex items-center gap-1.5 mb-2">
                  <User className="w-4 h-4" /> Select Child
                </Label>
                <div className="flex flex-wrap gap-2">
                  {children.map(c => (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setSelectedChild(c.label)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedChild === c.label
                          ? 'border-blue-600 bg-blue-50 text-blue-800'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}
                    >
                      {c.label}
                      {c.isPrimary && <span className="ml-1.5 text-xs text-gray-400">(primary)</span>}
                    </button>
                  ))}
                </div>
                {selectedChild && (
                  <p className="text-xs text-blue-600 mt-2">Paying fee for: <strong>{selectedChild}</strong></p>
                )}
              </div>
            )}

            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="text-lg text-gray-700">Amount to Pay (Rs.)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="text-2xl font-bold mt-2 h-14"
              />
            </div>

            <Tabs defaultValue="easypaisa" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
                <TabsTrigger value="easypaisa" className="text-sm md:text-base">Easypaisa</TabsTrigger>
                <TabsTrigger value="jazzcash"  className="text-sm md:text-base">JazzCash</TabsTrigger>
                <TabsTrigger value="bank"      className="text-sm md:text-base">Bank Deposit</TabsTrigger>
              </TabsList>

              {/* ── Easypaisa ───────────────────────────────────────────── */}
              <TabsContent value="easypaisa" className="space-y-6">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                  <p className="text-green-800 font-medium text-center">
                    Merchant ID: {SAFERIDE.merchants.easypaisa}
                  </p>
                </div>
                <div>
                  <Label htmlFor="ep-phone">Easypaisa Mobile Number</Label>
                  <Input
                    id="ep-phone"
                    type="tel"
                    placeholder="03xxxxxxxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="mt-2 h-12"
                  />
                </div>
                <Button
                  onClick={() => handleMobilePayment('Easypaisa')}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-lg rounded-xl"
                >
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Pay via Easypaisa'}
                </Button>
              </TabsContent>

              {/* ── JazzCash ────────────────────────────────────────────── */}
              <TabsContent value="jazzcash" className="space-y-6">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
                  <p className="text-red-800 font-medium text-center">
                    Merchant ID: {SAFERIDE.merchants.jazzcash}
                  </p>
                </div>
                <div>
                  <Label htmlFor="jc-phone">JazzCash Mobile Number</Label>
                  <Input
                    id="jc-phone"
                    type="tel"
                    placeholder="03xxxxxxxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="mt-2 h-12"
                  />
                </div>
                <Button
                  onClick={() => handleMobilePayment('JazzCash')}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg rounded-xl"
                >
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Pay via JazzCash'}
                </Button>
              </TabsContent>

              {/* ── Bank Deposit ─────────────────────────────────────────── */}
              <TabsContent value="bank">
                <form onSubmit={handleBankDeposit} className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-2">
                    <h3 className="font-bold text-blue-900 mb-2">Bank Details</h3>
                    <p className="text-sm text-blue-800"><span className="font-semibold">Bank:</span> {SAFERIDE.bank.name}</p>
                    <p className="text-sm text-blue-800"><span className="font-semibold">Account Title:</span> {SAFERIDE.bank.title}</p>
                    <p className="text-sm text-blue-800"><span className="font-semibold">Account No:</span> {SAFERIDE.bank.account}</p>
                    <p className="text-sm text-blue-800"><span className="font-semibold">IBAN:</span> {SAFERIDE.bank.iban}</p>
                  </div>
                  <div>
                    <Label htmlFor="receipt">
                      Upload Payment Screenshot
                      <span className="ml-2 text-xs font-normal text-gray-400">(auto-compressed if &gt; 800 KB)</span>
                    </Label>
                    <div className="mt-2 flex items-center justify-center w-full">
                      <label
                        htmlFor="receipt"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                          file ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {compressing
                            ? <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                            : <UploadCloud className={`w-8 h-8 mb-2 ${file ? 'text-green-500' : 'text-gray-400'}`} />
                          }
                          <p className="text-sm text-gray-500">
                            {compressing ? 'Compressing...' : file ? `✓ ${file.name}` : 'Click to upload screenshot'}
                          </p>
                          {file && (
                            <p className="text-xs text-gray-400 mt-1">{Math.round(file.size / 1024)} KB</p>
                          )}
                        </div>
                        <input
                          id="receipt"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || compressing}
                    className="w-full bg-blue-800 hover:bg-blue-900 text-white h-14 text-lg rounded-xl"
                  >
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : 'Submit Bank Receipt'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;