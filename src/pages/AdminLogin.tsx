
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestOtp = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('generate_admin_otp', {
        admin_email: email
      });

      if (error) throw error;

      toast.success('OTP sent! Check your email.');
      setStep('otp');
    } catch (error: any) {
      console.error('Error requesting OTP:', error);
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('verify_admin_otp', {
        admin_email: email,
        otp_token: otp
      });

      if (error) throw error;

      // Store session token in localStorage
      localStorage.setItem('admin_session_token', data[0].session_token);
      localStorage.setItem('admin_user_id', data[0].admin_user_id);
      
      toast.success('Login successful!');
      navigate('/admin');
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'email') {
      requestOtp();
    } else {
      verifyOtp();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-brand-orange to-brand-dark-orange bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <CardDescription>
            {step === 'email' 
              ? 'Enter your admin email to receive an OTP' 
              : 'Enter the OTP sent to your email'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 'email' ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                />
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setStep('email')}
                  className="p-0 h-auto text-sm"
                >
                  ← Back to email
                </Button>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-brand-orange to-brand-dark-orange"
              disabled={loading}
            >
              {loading ? 'Processing...' : step === 'email' ? 'Send OTP' : 'Verify & Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
