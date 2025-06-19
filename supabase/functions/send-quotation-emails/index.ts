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

    // Send email to actual customer
    console.log(`Sending customer email to: ${customerEmail}`);
    const customerEmailResponse = await resend.emails.send({
      from: "East Digital <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Your Quote Request - ${customerName}`,
      html: customerTemplate,
    });

    console.log("Customer email response:", customerEmailResponse);

    // Send admin notification to the actual admin email
    const adminEmail = "info@eastdigital.in";
    console.log(`Sending admin notification to: ${adminEmail}`);
    const adminEmailResponse = await resend.emails.send({
      from: "East Digital <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `New Quote Request from ${customerName}`,
      html: adminTemplate,
    });

    console.log("Admin email response:", adminEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        customerEmail: customerEmailResponse,
        adminEmail: adminEmailResponse,
        message: "Emails sent successfully"
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