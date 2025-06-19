
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ServiceCategory, SubService } from '@/data/servicesData';

export const useServices = () => {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Fetch services and sub_services in a single query with join
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select(`
          id,
          name,
          description,
          display_order,
          sub_services (
            id,
            name,
            description,
            price,
            unit,
            minimum_units,
            show_price,
            display_order
          )
        `)
        .eq('status', 'active')
        .order('display_order');

      if (servicesError) {
        throw servicesError;
      }

      // Transform the data to match the existing ServiceCategory interface
      const transformedCategories: ServiceCategory[] = services?.map(service => ({
        id: service.id,
        name: service.name,
        subServices: service.sub_services?.map((subService: any) => ({
          id: subService.id,
          name: subService.name,
          price: parseFloat(subService.price),
          unit: subService.unit,
          minimumUnits: subService.minimum_units,
        } as SubService)) || [],
      })) || [];

      setServiceCategories(transformedCategories);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  return { serviceCategories, loading, error, refetch: fetchServices };
};
