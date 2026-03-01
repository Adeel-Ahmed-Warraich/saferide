
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { CreditCard, UploadCloud } from 'lucide-react';

const PaymentPage = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('5000'); // Default dummy amount
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState(null);

  // Fetch latest pending payment to pre-fill amount if needed
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await pb.collection('payments').getList(1, 1, {
          filter: `parentId="${currentUser.id}" && status="Pending"`,
          $autoCancel: false
        });
        if (res.items.length > 0) setAmount(res.items[0].amount.toString());
      } catch (e) { console.error(e); }
    };
    fetchPending();
  }, [currentUser.id]);

  const handleMobilePayment = async (method) => {
    if (!phone) { toast({ title: "Phone number required", variant: "destructive" }); return; }
    setLoading(true);
    try {
      await pb.collection('payments').create({
        parentId: currentUser.id,
        amount: Number(amount),
        dueDate: new Date().toISOString(),
        paymentMethod: method,
        status: 'Pending',
        transactionId: `TXN-${Math.floor(Math.random()*1000000)}`
      }, { $autoCancel: false });
      
      toast({ title: "Payment Request Submitted", description: `Please approve the prompt on your ${method} app.` });
      navigate('/payment-history');
    } catch (error) {
      toast({ title: "Payment Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleBankDeposit = async (e) => {
    e.preventDefault();
    if (!file) { toast({ title: "Screenshot required", variant: "destructive" }); return; }
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('parentId', currentUser.id);
      formData.append('amount', amount);
      formData.append('dueDate', new Date().toISOString());
      formData.append('paymentMethod', 'BankDeposit');
      formData.append('status', 'PendingAdminApproval');
      formData.append('bankScreenshotUrl', file);

      await pb.collection('payments').create(formData, { $autoCancel: false });
      
      toast({ title: "Receipt Uploaded", description: "Admin will verify your payment shortly." });
      navigate('/payment-history');
    } catch (error) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Pay Fee - SafeRide</title></Helmet>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-8 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-yellow-500" /> Pay Monthly Fee
          </h1>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-8">
              <Label htmlFor="amount" className="text-lg text-gray-700">Amount to Pay (Rs.)</Label>
              <Input id="amount" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="text-2xl font-bold mt-2 h-14" readOnly />
            </div>

            <Tabs defaultValue="easypaisa" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 h-12">
                <TabsTrigger value="easypaisa" className="text-sm md:text-base">Easypaisa</TabsTrigger>
                <TabsTrigger value="jazzcash" className="text-sm md:text-base">JazzCash</TabsTrigger>
                <TabsTrigger value="bank" className="text-sm md:text-base">Bank Deposit</TabsTrigger>
              </TabsList>
              
              <TabsContent value="easypaisa" className="space-y-6">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                  <p className="text-green-800 font-medium text-center">Merchant ID: SAFERIDE001</p>
                </div>
                <div>
                  <Label htmlFor="ep-phone">Easypaisa Mobile Number</Label>
                  <Input id="ep-phone" type="tel" placeholder="03xxxxxxxxx" value={phone} onChange={(e)=>setPhone(e.target.value)} className="mt-2 h-12" />
                </div>
                <Button onClick={() => handleMobilePayment('Easypaisa')} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-lg rounded-xl">
                  {loading ? 'Processing...' : 'Pay via Easypaisa'}
                </Button>
              </TabsContent>

              <TabsContent value="jazzcash" className="space-y-6">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
                  <p className="text-red-800 font-medium text-center">Merchant ID: SAFERIDE_JAZZ_001</p>
                </div>
                <div>
                  <Label htmlFor="jc-phone">JazzCash Mobile Number</Label>
                  <Input id="jc-phone" type="tel" placeholder="03xxxxxxxxx" value={phone} onChange={(e)=>setPhone(e.target.value)} className="mt-2 h-12" />
                </div>
                <Button onClick={() => handleMobilePayment('JazzCash')} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg rounded-xl">
                  {loading ? 'Processing...' : 'Pay via JazzCash'}
                </Button>
              </TabsContent>

              <TabsContent value="bank">
                <form onSubmit={handleBankDeposit} className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-2">
                    <h3 className="font-bold text-blue-900 mb-2">Bank Details</h3>
                    <p className="text-sm text-blue-800"><span className="font-semibold">Bank:</span> Meezan Bank</p>
                    <p className="text-sm text-blue-800"><span className="font-semibold">Account Title:</span> SafeRide Transport</p>
                    <p className="text-sm text-blue-800"><span className="font-semibold">Account No:</span> 0123456789</p>
                    <p className="text-sm text-blue-800"><span className="font-semibold">IBAN:</span> PK34MEZN00000123456789</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="receipt">Upload Payment Screenshot</Label>
                    <div className="mt-2 flex items-center justify-center w-full">
                      <label htmlFor="receipt" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">{file ? file.name : "Click to upload screenshot"}</p>
                        </div>
                        <input id="receipt" type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                      </label>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-blue-800 hover:bg-blue-900 text-white h-14 text-lg rounded-xl">
                    {loading ? 'Uploading...' : 'Submit Bank Receipt'}
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
