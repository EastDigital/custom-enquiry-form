
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, Clock, CheckCircle } from 'lucide-react';

interface AdminStatsData {
  totalInquiries: number;
  pendingInquiries: number;
  completedInquiries: number;
  totalServices: number;
}

const AdminStats = () => {
  const [stats, setStats] = useState<AdminStatsData>({
    totalInquiries: 0,
    pendingInquiries: 0,
    completedInquiries: 0,
    totalServices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get inquiry stats
      const { data: inquiries, error: inquiriesError } = await supabase
        .from('customer_inquiries')
        .select('status');

      if (inquiriesError) throw inquiriesError;

      // Get services count
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('id')
        .eq('status', 'active');

      if (servicesError) throw servicesError;

      const totalInquiries = inquiries?.length || 0;
      const pendingInquiries = inquiries?.filter(i => i.status === 'pending').length || 0;
      const completedInquiries = inquiries?.filter(i => i.status === 'completed').length || 0;
      const totalServices = services?.length || 0;

      setStats({
        totalInquiries,
        pendingInquiries,
        completedInquiries,
        totalServices,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries,
      description: 'All customer inquiries',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Pending',
      value: stats.pendingInquiries,
      description: 'Awaiting response',
      icon: Clock,
      color: 'text-orange-600',
    },
    {
      title: 'Completed',
      value: stats.completedInquiries,
      description: 'Successfully handled',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Active Services',
      value: stats.totalServices,
      description: 'Available services',
      icon: Users,
      color: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-slate-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-slate-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-slate-200 rounded w-12 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
