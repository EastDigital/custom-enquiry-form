
import { supabase } from '@/integrations/supabase/client';

export const getServicePricing = async (serviceId: string, subServiceId: string) => {
  try {
    const { data, error } = await supabase
      .from('sub_services')
      .select('price, unit, minimum_units')
      .eq('id', subServiceId)
      .eq('service_id', serviceId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching service pricing:', error);
    return null;
  }
};

export const validateAdminSession = async () => {
  const sessionToken = localStorage.getItem('admin_session_token');
  
  if (!sessionToken) {
    return null;
  }

  try {
    const { data, error } = await supabase.rpc('validate_admin_session', {
      session_token: sessionToken
    });

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Session validation failed:', error);
    return null;
  }
};
