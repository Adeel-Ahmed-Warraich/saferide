import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { Mail, CheckCircle2 } from 'lucide-react';

const PasswordResetPage = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  // Support ?collection=admins for admin reset link
  const collection = searchParams.get('collection') || 'parents';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pb.collection(collection).requestPasswordReset(email, { $autoCancel: false });
      setSubmitted(true);
    } catch (err) {
      // Always show success to avoid email enumeration — but log real error
      console.error('Password reset error:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = collection === 'admins';

  return (
    <>
      <Helmet><title>Forgot Password - SafeRide</title></Helmet>
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-blue-700" />
            </div>
            <h2 className="text-2xl font-extrabold text-blue-900">Forgot Password?</h2>
            <p className="text-gray-500 text-sm mt-1">
              {isAdmin ? 'Enter your admin email to receive a reset link' : "Enter your email and we'll send you a reset link"}
            </p>
            {isAdmin && (
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                Admin Account
              </span>
            )}
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={isAdmin ? 'admin@saferide.com.pk' : 'parent@example.com'}
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={loading}
                className="w-full bg-blue-800 hover:bg-blue-900 text-white py-5 text-base rounded-xl">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p className="text-green-800 font-semibold mb-1">Check Your Email</p>
              <p className="text-green-700 text-sm">
                If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your inbox and spam folder.
              </p>
            </div>
          )}

          <div className="text-center mt-6 space-y-2">
            <div>
              <Link
                to={isAdmin ? '/admin-login' : '/login'}
                className="text-sm font-medium text-blue-800 hover:underline"
              >
                ← Back to {isAdmin ? 'Admin' : 'Parent'} Login
              </Link>
            </div>
            {!isAdmin && (
              <div>
                <span className="text-xs text-gray-400">Admin? </span>
                <Link to="/password-reset?collection=admins" className="text-xs text-gray-500 hover:underline">
                  Admin password reset
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordResetPage;