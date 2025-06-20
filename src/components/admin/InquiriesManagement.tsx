
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { FileText, ExternalLink, Clock, User, Mail, Phone, MapPin, MessageSquare, Paperclip } from 'lucide-react';

interface CustomerInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  urgent: boolean;
  has_document: boolean;
  document_url: string;
  document_name: string;
  proposal_type: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const InquiriesManagement = () => {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('customer_inquiries')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', inquiryId);

      if (error) throw error;

      setInquiries(inquiries.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, status: newStatus }
          : inquiry
      ));

      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string, urgent: boolean) => {
    const baseClasses = urgent ? 'animate-pulse' : '';
    
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</Badge>;
      case 'completed':
        return <Badge variant="secondary" className={`${baseClasses} bg-green-100 text-green-800`}>Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</Badge>;
      default:
        return <Badge variant="secondary" className={baseClasses}>{status}</Badge>;
    }
  };

  const getProposalTypeBadge = (type: string) => {
    return type === 'instant' 
      ? <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Instant</Badge>
      : <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Tailored</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading inquiries...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Customer Inquiries
            </CardTitle>
            <CardDescription>
              Manage and respond to customer inquiry requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            {inquiry.name}
                            {inquiry.urgent && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Clock className="w-4 h-4 text-red-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Urgent</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {inquiry.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getProposalTypeBadge(inquiry.proposal_type)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(inquiry.status, inquiry.urgent)}
                      </TableCell>
                      <TableCell>
                        {inquiry.total_amount ? `$${inquiry.total_amount}` : '-'}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={inquiry.status}
                            onValueChange={(value) => updateInquiryStatus(inquiry.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInquiry(inquiry)}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Inquiry Details Modal/Panel */}
        {selectedInquiry && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Inquiry Details</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInquiry(null)}
                >
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{selectedInquiry.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedInquiry.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedInquiry.phone}</span>
                  </div>
                  {selectedInquiry.country && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedInquiry.country}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">Proposal Type:</span>
                    <div className="mt-1">
                      {getProposalTypeBadge(selectedInquiry.proposal_type)}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Status:</span>
                    <div className="mt-1">
                      {getStatusBadge(selectedInquiry.status, selectedInquiry.urgent)}
                    </div>
                  </div>
                  {selectedInquiry.total_amount && (
                    <div>
                      <span className="text-sm font-medium">Total Amount:</span>
                      <div className="mt-1 text-lg font-semibold">
                        ${selectedInquiry.total_amount}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedInquiry.message && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Message</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>
                </div>
              )}

              {selectedInquiry.has_document && selectedInquiry.document_url && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Attached Document</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedInquiry.document_url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {selectedInquiry.document_name || 'View Document'}
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

export default InquiriesManagement;
