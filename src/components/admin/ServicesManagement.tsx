
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Service = Tables<'services'>;
type SubService = Tables<'sub_services'>;

interface ServiceWithSubServices extends Service {
  sub_services: SubService[];
}

const ServicesManagement = () => {
  const [services, setServices] = useState<ServiceWithSubServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isSubServiceDialogOpen, setIsSubServiceDialogOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          sub_services (*)
        `)
        .order('display_order');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSubmit = async (formData: FormData) => {
    const serviceData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as 'active' | 'inactive',
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
        toast.success('Service updated successfully');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);

        if (error) throw error;
        toast.success('Service created successfully');
      }

      setIsServiceDialogOpen(false);
      setEditingService(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    }
  };

  const handleSubServiceSubmit = async (formData: FormData, serviceId: string) => {
    const subServiceData = {
      service_id: serviceId,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      unit: formData.get('unit') as string || null,
      minimum_units: parseInt(formData.get('minimum_units') as string) || 1,
      show_price: formData.get('show_price') === 'true',
      status: formData.get('status') as 'active' | 'inactive',
      display_order: parseInt(formData.get('display_order') as string) || 0,
    };

    try {
      if (editingSubService) {
        const { error } = await supabase
          .from('sub_services')
          .update(subServiceData)
          .eq('id', editingSubService.id);

        if (error) throw error;
        toast.success('Sub-service updated successfully');
      } else {
        const { error } = await supabase
          .from('sub_services')
          .insert([subServiceData]);

        if (error) throw error;
        toast.success('Sub-service created successfully');
      }

      setIsSubServiceDialogOpen(false);
      setEditingSubService(null);
      fetchServices();
    } catch (error) {
      console.error('Error saving sub-service:', error);
      toast.error('Failed to save sub-service');
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This will also delete all sub-services.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const deleteSubService = async (subServiceId: string) => {
    if (!confirm('Are you sure you want to delete this sub-service?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('sub_services')
        .delete()
        .eq('id', subServiceId);

      if (error) throw error;
      toast.success('Sub-service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Error deleting sub-service:', error);
      toast.error('Failed to delete sub-service');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Services Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading services...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Services Management
              </CardTitle>
              <CardDescription>
                Manage your service categories and sub-services
              </CardDescription>
            </div>
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingService(null)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingService ? 'Update the service details below.' : 'Create a new service category.'}
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleServiceSubmit(new FormData(e.currentTarget));
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="name">Service Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={editingService?.name || ''}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      defaultValue={editingService?.description || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={editingService?.status || 'active'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      name="display_order"
                      type="number"
                      defaultValue={editingService?.display_order || 0}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsServiceDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingService ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                        {service.status}
                      </Badge>
                    </div>
                    {service.description && (
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingService(service);
                        setIsServiceDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteService(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Sub-Services</h4>
                    <Dialog open={isSubServiceDialogOpen} onOpenChange={setIsSubServiceDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingSubService(null)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Sub-Service
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {editingSubService ? 'Edit Sub-Service' : 'Add New Sub-Service'}
                          </DialogTitle>
                          <DialogDescription>
                            {editingSubService 
                              ? 'Update the sub-service details below.'
                              : `Add a new sub-service to ${service.name}.`
                            }
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSubServiceSubmit(new FormData(e.currentTarget), service.id);
                          }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="sub_name">Sub-Service Name</Label>
                              <Input
                                id="sub_name"
                                name="name"
                                defaultValue={editingSubService?.name || ''}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="sub_price">Price</Label>
                              <Input
                                id="sub_price"
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={editingSubService?.price || ''}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="sub_description">Description</Label>
                            <Input
                              id="sub_description"
                              name="description"
                              defaultValue={editingSubService?.description || ''}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="sub_unit">Unit</Label>
                              <Input
                                id="sub_unit"
                                name="unit"
                                defaultValue={editingSubService?.unit || ''}
                                placeholder="e.g., per hour, per page"
                              />
                            </div>
                            <div>
                              <Label htmlFor="sub_minimum_units">Minimum Units</Label>
                              <Input
                                id="sub_minimum_units"
                                name="minimum_units"
                                type="number"
                                defaultValue={editingSubService?.minimum_units || 1}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="sub_show_price">Show Price</Label>
                              <Select name="show_price" defaultValue={editingSubService?.show_price ? 'true' : 'false'}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Yes</SelectItem>
                                  <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="sub_status">Status</Label>
                              <Select name="status" defaultValue={editingSubService?.status || 'active'}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="sub_display_order">Display Order</Label>
                            <Input
                              id="sub_display_order"
                              name="display_order"
                              type="number"
                              defaultValue={editingSubService?.display_order || 0}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsSubServiceDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingSubService ? 'Update' : 'Create'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {service.sub_services.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {service.sub_services.map((subService) => (
                            <TableRow key={subService.id}>
                              <TableCell className="font-medium">
                                {subService.name}
                              </TableCell>
                              <TableCell>
                                {subService.show_price ? `$${subService.price}` : 'Hidden'}
                              </TableCell>
                              <TableCell>
                                {subService.unit || '-'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={subService.status === 'active' ? 'default' : 'secondary'}>
                                  {subService.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingSubService(subService);
                                      setIsSubServiceDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteSubService(subService.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No sub-services yet. Add one to get started.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesManagement;
