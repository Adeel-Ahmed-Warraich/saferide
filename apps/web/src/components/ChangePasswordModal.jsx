import React, { useState } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { X, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';

const ChangePasswordModal = ({ onClose }) => {
  const { currentUser, isAdmin } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (field) => setShow(prev => ({ ...prev, [field]: !prev[field] }));
  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const strength = () => {
    const p = form.newPass;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: 'bg-red-400', w: 'w-1/4' };
    if (p.length < 8) return { label: 'Weak',      color: 'bg-orange-400', w: 'w-2/4' };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Fair', color: 'bg-yellow-400', w: 'w-3/4' };
    return { label: 'Strong', color: 'bg-green-500', w: 'w-full' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      toast({ title: 'Passwords do not match', variant: 'destructive' }); return;
    }
    if (form.newPass.length < 8) {
      toast({ title: 'Password must be at least 8 characters', variant: 'destructive' }); return;
    }
    setLoading(true);
    try {
      const collection = isAdmin ? 'admins' : 'parents';
      // PocketBase requires old password to change — use update with password + oldPassword
      await pb.collection(collection).update(currentUser.id, {
        oldPassword:     form.current,
        password:        form.newPass,
        passwordConfirm: form.confirm,
      }, { $autoCancel: false });
      setDone(true);
      toast({ title: '✓ Password changed successfully!' });
    } catch (err) {
      const msg = err?.data?.oldPassword
        ? 'Current password is incorrect.'
        : err.message || 'Failed to change password.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const s = strength();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-blue-700" />
            </div>
            <h2 className="text-lg font-bold text-blue-900">Change Password</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Password Updated!</h3>
            <p className="text-gray-500 text-sm mb-6">Your password has been changed successfully.</p>
            <Button onClick={onClose} className="bg-blue-800 hover:bg-blue-900 text-white w-full">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Current Password */}
            <div>
              <Label>Current Password *</Label>
              <div className="relative mt-1">
                <Input
                  name="current"
                  type={show.current ? 'text' : 'password'}
                  required
                  value={form.current}
                  onChange={handle}
                  placeholder="Enter your current password"
                  className="pr-10"
                />
                <button type="button" onClick={() => toggle('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <Label>New Password *</Label>
              <div className="relative mt-1">
                <Input
                  name="newPass"
                  type={show.newPass ? 'text' : 'password'}
                  required
                  value={form.newPass}
                  onChange={handle}
                  placeholder="Min. 8 characters"
                  className="pr-10"
                />
                <button type="button" onClick={() => toggle('newPass')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show.newPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {s && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${s.color} ${s.w}`} />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    s.label === 'Strong' ? 'text-green-600' :
                    s.label === 'Fair'   ? 'text-yellow-600' : 'text-red-500'
                  }`}>{s.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>Confirm New Password *</Label>
              <div className="relative mt-1">
                <Input
                  name="confirm"
                  type={show.confirm ? 'text' : 'password'}
                  required
                  value={form.confirm}
                  onChange={handle}
                  placeholder="Repeat your new password"
                  className={`pr-10 ${form.confirm && form.newPass !== form.confirm ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                />
                <button type="button" onClick={() => toggle('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirm && form.newPass !== form.confirm && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              <Button
                type="submit"
                disabled={loading || (form.confirm && form.newPass !== form.confirm)}
                className="flex-1 bg-blue-800 hover:bg-blue-900 text-white"
              >
                {loading ? 'Updating...' : 'Change Password'}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-400 mt-2">
              Forgot your current password?{' '}
              <a href="/password-reset" className="text-blue-600 hover:underline" onClick={onClose}>
                Reset via email
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;