
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LogOut, Users, Settings, FileText } from 'lucide-react';
import ServicesManagement from '@/components/admin/ServicesManagement';
import InquiriesManagement from '@/components/admin/InquiriesManagement';
import AdminStats from '@/components/admin/AdminStats';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const sessionToken = localStorage.getItem('admin_session_token');
    const adminUserId = localStorage.getItem('admin_user_id');

    if (!sessionToken || !adminUserId) {
      navigate('/admin/login');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('validate_admin_session', {
        session_token: sessionToken
      });

      if (error || !data) {
        throw new Error('Invalid session');
      }

      // Get admin user details
      const { data: adminUser, error: userError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('id', adminUserId)
        .single();

      if (userError || !adminUser) {
        throw new Error('Admin user not found');
      }

      setAdminEmail(adminUser.email);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('admin_session_token');
      localStorage.removeItem('admin_user_id');
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session_token');
    localStorage.removeItem('admin_user_id');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-orange to-brand-dark-orange bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Welcome back, {adminEmail}
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <AdminStats />

        {/* Main Content */}
        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Customer Inquiries
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Services Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries">
            <InquiriesManagement />
          </TabsContent>

          <TabsContent value="services">
            <ServicesManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
