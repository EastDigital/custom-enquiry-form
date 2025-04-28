
export type ServiceSelection = {
  serviceId: string;
  subServiceId: string;
  quantity?: number;
};

export type CustomerFormData = {
  name: string;
  email: string;
  phone: string;
  selectedServices: ServiceSelection[];
};
