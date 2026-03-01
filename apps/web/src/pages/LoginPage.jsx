
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useToast } from '@/hooks/use-toast.js';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { requestOTP, authWithOTP, otpId } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLocalLoading(true);

    try {
      await requestOTP(email);
      setStep(2);
      toast({
        title: 'Code Sent!',
        description: 'Check your email for the 8-digit verification code.',
      });
    } catch (error) {
      console.error('OTP request error:', error);
      toast({
        title: 'Failed to Send Code',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLocalLoading(true);

    try {
      await authWithOTP(otpId, code);
      toast({
        title: 'Login Successful!',
        description: 'Welcome to SafeRide Admin Dashboard.',
      });
      navigate('/admin');
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLocalLoading(true);
    try {
      await requestOTP(email);
      toast({
        title: 'Code Resent!',
        description: 'A new verification code has been sent to your email.',
      });
    } catch (error) {
      toast({
        title: 'Failed to Resend Code',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - SafeRide School Transport</title>
        <meta
          name="description"
          content="Admin login for SafeRide School Transport. Access your dashboard to manage enrollments and messages."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <section className="py-16 bg-gray-50 flex-grow flex items-center">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Admin Login
                </h1>
                <p className="text-gray-600">
                  {step === 1
                    ? 'Enter your email to receive a verification code'
                    : 'Enter the 8-digit code sent to your email'}
                </p>
              </div>

              {step === 1 ? (
                <form onSubmit={handleSendCode} className="space-y-6">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@saferide.com.pk"
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={localLoading}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-6 text-lg font-semibold"
                  >
                    {localLoading ? 'Sending Code...' : 'Send Verification Code'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="space-y-6">
                  <div>
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="00000000"
                      maxLength={8}
                      className="mt-1 text-center text-2xl tracking-widest"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Enter the 8-digit code sent to {email}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={localLoading || code.length !== 8}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-6 text-lg font-semibold"
                  >
                    {localLoading ? 'Verifying...' : 'Verify & Login'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={localLoading}
                      className="text-primary hover:text-primary-dark font-medium text-sm"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default LoginPage;
