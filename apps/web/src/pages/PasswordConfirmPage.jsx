import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

const PasswordConfirmPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = searchParams.get('token');
  const collectionParam = searchParams.get('collection') || 'parents';

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = () => {
    if (!password) return null;
    if (password.length < 6) return { label: 'Too short', color: 'bg-red-400', width: 'w-1/4' };
    if (password.length < 8) return { label: 'Weak', color: 'bg-orange-400', width: 'w-2/4' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Fair', color: 'bg-yellow-400', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (password.length < 8) {
      toast({ title: 'Password must be at least 8 characters', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await pb.collection(collectionParam).confirmPasswordReset(token, password, passwordConfirm, { $autoCancel: false });
      setDone(true);
      toast({ title: 'Password updated successfully!' });
    } catch (err) {
      toast({
        title: 'Reset Failed',
        description: err.message?.includes('token') ? 'This reset link has expired or already been used. Please request a new one.' : err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const s = strength();
  const loginPath = collectionParam === 'admins' ? '/admin-login' : '/login';

  if (!token) return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-gray-100">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
        <p className="text-gray-500 text-sm mb-6">This password reset link is invalid or missing. Please request a new one.</p>
        <Link to="/password-reset">
          <Button className="bg-blue-800 hover:bg-blue-900 text-white w-full">Request New Reset Link</Button>
        </Link>
      </div>
    </div>
  );

  if (done) return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center border border-gray-100">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Password Updated!</h2>
        <p className="text-gray-500 text-sm mb-6">Your password has been changed successfully. You can now log in with your new password.</p>
        <Link to={loginPath}>
          <Button className="bg-blue-800 hover:bg-blue-900 text-white w-full">Go to Login</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <Helmet><title>Set New Password - SafeRide</title></Helmet>
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7 text-blue-700" />
            </div>
            <h2 className="text-2xl font-extrabold text-blue-900">Set New Password</h2>
            <p className="text-gray-500 text-sm mt-1">Choose a strong password for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="password">New Password *</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {s && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${s.color} ${s.width}`} />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    s.label === 'Strong' ? 'text-green-600' :
                    s.label === 'Fair' ? 'text-yellow-600' : 'text-red-500'
                  }`}>{s.label}</p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="passwordConfirm">Confirm New Password *</Label>
              <div className="relative mt-1">
                <Input
                  id="passwordConfirm"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  className={`pr-10 ${passwordConfirm && password !== passwordConfirm ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordConfirm && password !== passwordConfirm && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <Button type="submit" disabled={loading || (passwordConfirm && password !== passwordConfirm)}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-5 text-base rounded-xl mt-2">
              {loading ? 'Updating...' : 'Set New Password'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link to="/password-reset" className="text-sm text-blue-700 hover:underline">
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordConfirmPage;