import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  adminEmail: string;
  otpToken: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { adminEmail, otpToken }: OTPRequest = await req.json();

    console.log(`Sending OTP email to: ${adminEmail}`);

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { 
              background: linear-gradient(to right, #ff6900, #cc5400); 
              padding: 20px; 
              color: white; 
              text-align: center; 
              border-radius: 8px 8px 0 0;
            }
            .content { 
              padding: 30px; 
              background-color: #ffffff; 
              border-radius: 0 0 8px 8px; 
              border: 1px solid #e2e8f0; 
              border-top: none; 
              text-align: center;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #ff6900;
              background-color: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              letter-spacing: 8px;
              margin: 20px 0;
              border: 2px dashed #ff6900;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #e2e8f0; 
              font-size: 12px; 
              color: #6b7280; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Admin Login OTP</h1>
            </div>
            <div class="content">
              <h2>Your One-Time Password</h2>
              <p>Use this OTP to log into the East Digital admin dashboard:</p>
              
              <div class="otp-code">${otpToken}</div>
              
              <p><strong>This OTP will expire in 10 minutes.</strong></p>
              <p>If you didn't request this OTP, please ignore this email.</p>
              
              <div class="footer">
                <p>This email was sent from the East Digital admin system.</p>
                <p>&copy; ${new Date().getFullYear()} East Digital. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "East Digital Admin <onboarding@resend.dev>",
      to: [adminEmail],
      subject: "Your Admin Login OTP",
      html: emailTemplate,
    });

    console.log("OTP email response:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP email sent successfully",
        emailResponse
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
    console.error("Error sending OTP email:", error);
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