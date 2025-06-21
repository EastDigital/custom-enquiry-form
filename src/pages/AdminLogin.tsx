import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [email, setEmail] = useState('info@eastdigital.in');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const navigate = useNavigate();

  const requestOtp = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      console.log('Requesting OTP for:', email);
      
      // Test database connection first
      const { data: testData, error: testError } = await supabase
        .from('admin_users')
        .select('id')
        .limit(1);

      if (testError) {
        console.error('Database connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      console.log('Database connection successful');
      
      // Generate OTP using the database function
      const { data: otpToken, error: otpError } = await supabase.rpc('generate_admin_otp', {
        admin_email: email
      });

      if (otpError) {
        console.error('OTP generation error:', otpError);
        throw new Error(`OTP generation failed: ${otpError.message}`);
      }

      console.log('OTP generated successfully:', otpToken);
      setGeneratedOtp(otpToken);

      // For development, show the OTP in console and toast
      toast.success(`OTP generated successfully! Development OTP: ${otpToken}`, {
        duration: 15000,
      });
      
      // Try to send email but don't fail if it doesn't work
      try {
        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-admin-otp', {
          body: {
            adminEmail: email,
            otpToken: otpToken
          }
        });

        if (!emailError) {
          console.log('Email sent successfully:', emailData);
          toast.success('OTP sent to your email!');
        } else {
          console.warn('Email sending failed:', emailError);
          toast.warning('Email sending failed, but you can use the OTP shown above');
        }
      } catch (emailError) {
        console.warn('Email sending failed, but OTP is available:', emailError);
        toast.warning('Email sending failed, but you can use the OTP shown above');
      }

      setStep('otp');
    } catch (error: any) {
      console.error('Error requesting OTP:', error);
      toast.error(error.message || 'Failed to generate OTP');
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
      console.log('Verifying OTP:', otp, 'for email:', email);
      
      const { data, error } = await supabase.rpc('verify_admin_otp', {
        admin_email: email,
        otp_token: otp
      });

      if (error) {
        console.error('OTP verification error:', error);
        throw new Error(`OTP verification failed: ${error.message}`);
      }

      console.log('OTP verification successful:', data);

      if (data && data.length > 0) {
        // Store session token in localStorage
        localStorage.setItem('admin_session_token', data[0].session_token);
        localStorage.setItem('admin_user_id', data[0].admin_user_id);
        
        toast.success('Login successful!');
        navigate('/admin');
      } else {
        throw new Error('Invalid response from server');
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/50 to-amber-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-md bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-white/30 dark:border-white/10">
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
                  placeholder="info@eastdigital.in"
                  className="h-12 rounded-xl border-slate-200 dark:border-slate-600 focus:border-brand-orange transition-all duration-200"
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
                  className="h-12 rounded-xl border-slate-200 dark:border-slate-600 focus:border-brand-orange transition-all duration-200"
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
                {generatedOtp && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <strong>Development OTP:</strong> {generatedOtp}
                  </div>
                )}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-brand-orange to-brand-dark-orange rounded-xl h-12"
              disabled={loading}
            >
              {loading ? 'Processing...' : step === 'email' ? 'Send OTP' : 'Verify & Login'}
            </Button>
          </form>
          
          {/* Development helper */}
          <div className="mt-4 p-3 bg-yellow-50/80 dark:bg-yellow-900/20 border border-yellow-200/60 dark:border-yellow-800/60 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Development Mode:</strong> The OTP will be shown above and in the browser console for testing purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;