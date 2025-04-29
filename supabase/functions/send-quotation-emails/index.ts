
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  selectedServices: any[];
  urgent: boolean;
  hasDocument: boolean;
  documentUrl?: string;
  documentName?: string;
  customerTemplate: string;
  adminTemplate: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerEmail,
      customerName,
      customerTemplate,
      adminTemplate,
    }: EmailRequest = await req.json();

    // For Resend free tier testing: use your registered email
    const testingEmail = "eastdigitalcompany@gmail.com"; // Your Resend registered email

    // Log original recipient information (for reference only)
    console.log(`Original customer email: ${customerEmail}`);
    
    // Send email with customer template to your testing email
    console.log(`Sending customer template email to testing address: ${testingEmail}`);
    const customerEmailResponse = await resend.emails.send({
      from: "Quotation System <onboarding@resend.dev>",
      to: [testingEmail], // Send to your testing email
      subject: `[TEST] Customer Quote Request - ${customerName}`,
      html: customerTemplate,
      text: `This is a test email for customer ${customerName}. In production, this would be sent to ${customerEmail}.`
    });

    console.log("Customer email response:", customerEmailResponse);

    // Send email with admin template to your testing email
    console.log(`Sending admin template email to testing address: ${testingEmail}`);
    const adminEmailResponse = await resend.emails.send({
      from: "Quotation System <onboarding@resend.dev>",
      to: [testingEmail], // Send to your testing email
      subject: `[TEST] Admin Quote Request - ${customerName}`,
      html: adminTemplate,
      text: `This is a test email for an admin notification about customer ${customerName}.`
    });

    console.log("Admin email response:", adminEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        customerEmail: customerEmailResponse,
        adminEmail: adminEmailResponse,
        message: "Test emails sent to your registered email address",
        note: "This is using the Resend free tier which only allows sending to your registered email"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
