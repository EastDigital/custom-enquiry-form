
import { ServiceSelection } from "@/types/form";
import { serviceCategories } from "@/data/servicesData";

// Define the urgency fee
const URGENCY_FEE = 25;

const calculateTotal = (selectedServices: ServiceSelection[], urgent: boolean = false) => {
  let total = 0;
  selectedServices.forEach((service) => {
    const category = serviceCategories.find((c) => c.id === service.serviceId);
    const subService = category?.subServices.find((s) => s.id === service.subServiceId);
    if (subService) {
      if (service.quantity && subService.unit) {
        total += subService.price * service.quantity;
      } else {
        total += subService.price;
      }
    }
  });
  
  // Add urgency fee if urgent
  if (urgent) {
    total += URGENCY_FEE;
  }
  
  return total;
};

const formatServicesList = (selectedServices: ServiceSelection[]) => {
  return selectedServices.map((service) => {
    const category = serviceCategories.find((c) => c.id === service.serviceId);
    const subService = category?.subServices.find((s) => s.id === service.subServiceId);
    if (category && subService) {
      const price = service.quantity 
        ? subService.price * (service.quantity || 1)
        : subService.price;
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${category.name} - ${subService.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
            ${service.quantity ? `${service.quantity} ${subService.unit}` : '1'}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">$${price}</td>
        </tr>
      `;
    }
    return '';
  }).join('');
};

export const generateCustomerEmailHTML = (
  name: string,
  email: string,
  phone: string,
  selectedServices: ServiceSelection[],
  urgent: boolean = false,
  documentUrl?: string,
  documentName?: string
) => {
  const total = calculateTotal(selectedServices, urgent);
  const urgencyBadgeColor = urgent ? "#ff6900" : "#4ade80";
  const urgencyText = urgent ? "Urgent" : "Not So Urgent";
  
  const documentSection = documentUrl && documentName ? `
    <div style="margin: 15px 0; padding: 10px; background-color: #f8fafc; border-radius: 8px;">
      <p><strong>Attached Document:</strong> ${documentName}</p>
      <p>You can access your document here: <a href="${documentUrl}" target="_blank">View Document</a></p>
    </div>
  ` : '';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #ff6900, #ff8533); padding: 20px; color: white; text-align: center; }
          .content { padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f8fafc; padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
          .total { font-weight: bold; margin-top: 20px; text-align: right; }
          .urgency-badge { 
            display: inline-block;
            background-color: ${urgencyBadgeColor}; 
            color: white; 
            padding: 5px 10px; 
            border-radius: 20px; 
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Quotation Details</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for requesting a quote. Here are the details of your quotation:</p>
            
            <div style="margin: 15px 0; padding: 10px; background-color: #f8fafc; border-radius: 8px;">
              <p><strong>Urgency Level:</strong> <span class="urgency-badge">${urgencyText}</span></p>
            </div>
            
            ${documentSection}
            
            <h3>Services Selected:</h3>
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${formatServicesList(selectedServices)}
                ${urgent ? `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Urgency Fee</strong></td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">1</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">$${URGENCY_FEE}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>
            
            <div class="total">
              <p>Total Amount: $${total}</p>
            </div>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>Your Company Name</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const generateAdminEmailHTML = (
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  selectedServices: ServiceSelection[],
  urgent: boolean = false,
  documentUrl?: string,
  documentName?: string
) => {
  const total = calculateTotal(selectedServices, urgent);
  const urgencyBadgeColor = urgent ? "#ff6900" : "#4ade80";
  const urgencyText = urgent ? "Urgent" : "Not So Urgent";
  
  const documentSection = documentUrl && documentName ? `
    <p><strong>Document:</strong> <a href="${documentUrl}" target="_blank">${documentName}</a></p>
  ` : '';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #ff6900, #ff8533); padding: 20px; color: white; text-align: center; }
          .content { padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f8fafc; padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0; }
          .customer-info { background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .urgency-badge { 
            display: inline-block;
            background-color: ${urgencyBadgeColor}; 
            color: white; 
            padding: 5px 10px; 
            border-radius: 20px; 
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Quote Request</h1>
          </div>
          <div class="content">
            <div class="customer-info">
              <h3>Customer Information:</h3>
              <p><strong>Name:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
              <p><strong>Phone:</strong> ${customerPhone}</p>
              <p><strong>Urgency Level:</strong> <span class="urgency-badge">${urgencyText}</span></p>
              ${documentSection}
            </div>
            
            <h3>Selected Services:</h3>
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${formatServicesList(selectedServices)}
                ${urgent ? `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Urgency Fee</strong></td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">1</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">$${URGENCY_FEE}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>
            
            <div style="text-align: right; margin-top: 20px;">
              <p><strong>Total Amount: $${total}</strong></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
