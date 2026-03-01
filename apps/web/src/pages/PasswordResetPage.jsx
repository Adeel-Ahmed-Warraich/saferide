
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useToast } from '@/hooks/use-toast.js';

const PasswordResetPage = () => {
  const { requestPasswordReset } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
      toast({ title: "Reset Email Sent", description: "Check your inbox for instructions." });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Reset Password - SafeRide</title></Helmet>
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-900">Reset Password</h2>
            <p className="mt-2 text-gray-600">Enter your email to receive a reset link</p>
          </div>
          
          {!submitted ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-blue-800 hover:bg-blue-900 text-white py-6 text-lg rounded-xl">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="mt-8 text-center p-6 bg-green-50 rounded-xl border border-green-100">
              <p className="text-green-800 font-medium">If an account exists with {email}, a password reset link has been sent.</p>
            </div>
          )}

          <div className="text-center mt-6">
            <Link to="/parent-login" className="font-medium text-blue-800 hover:underline">Back to Login</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordResetPage;
