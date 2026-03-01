
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx';
import { useToast } from '@/hooks/use-toast.js';

const ParentSignupPage = () => {
  const navigate = useNavigate();
  const { signupParent } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    fullName: '',
    phoneNumber: '',
    childName: '',
    childClass: '',
    schoolName: '',
    homeAddress: '',
    preferredShift: 'Morning',
    specialInstructions: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await signupParent(formData);
      toast({
        title: "Account Created!",
        description: "Please log in to access your dashboard.",
      });
      navigate('/parent-login');
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Parent Signup - SafeRide</title></Helmet>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="max-w-2xl w-full space-y-8 bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-900">Create Parent Account</h2>
            <p className="mt-2 text-gray-600">Enroll your child for SafeRide transport</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-800 border-b pb-2">Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input id="phoneNumber" name="phoneNumber" type="tel" required value={formData.phoneNumber} onChange={handleChange} className="mt-1" placeholder="03001234567" />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" name="password" type="password" required minLength={8} value={formData.password} onChange={handleChange} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="passwordConfirm">Confirm Password *</Label>
                  <Input id="passwordConfirm" name="passwordConfirm" type="password" required minLength={8} value={formData.passwordConfirm} onChange={handleChange} className="mt-1" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-blue-800 border-b pb-2 mt-6">Parent & Child Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="fullName">Parent Full Name *</Label>
                  <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="childName">Child's Full Name *</Label>
                  <Input id="childName" name="childName" required value={formData.childName} onChange={handleChange} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="childClass">Class / Grade *</Label>
                  <Input id="childClass" name="childClass" required value={formData.childClass} onChange={handleChange} className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input id="schoolName" name="schoolName" required value={formData.schoolName} onChange={handleChange} className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="homeAddress">Home Address *</Label>
                  <Textarea id="homeAddress" name="homeAddress" required value={formData.homeAddress} onChange={handleChange} className="mt-1" rows={2} />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-blue-800 border-b pb-2 mt-6">Transport Preferences</h3>
              <div>
                <Label className="mb-2 block">Preferred Shift *</Label>
                <RadioGroup value={formData.preferredShift} onValueChange={(v) => setFormData(p => ({...p, preferredShift: v}))} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Morning" id="r1" /><Label htmlFor="r1">Morning</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Afternoon" id="r2" /><Label htmlFor="r2">Afternoon</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Both" id="r3" /><Label htmlFor="r3">Both</Label></div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea id="specialInstructions" name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} className="mt-1" rows={2} placeholder="Allergies, specific pickup points, etc." />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-800 hover:bg-blue-900 text-white py-6 text-lg rounded-xl">
              {loading ? 'Creating Account...' : 'Submit Enrollment Request'}
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              Already have an account? <Link to="/parent-login" className="font-medium text-blue-800 hover:underline">Log in here</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default ParentSignupPage;
