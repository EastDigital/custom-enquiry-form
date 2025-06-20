
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inquiryId } = await req.json();

    if (!inquiryId) {
      throw new Error('Inquiry ID is required');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Fetch inquiry details with services
    const { data: inquiry, error: inquiryError } = await supabase
      .from('customer_inquiries')
      .select('*')
      .eq('id', inquiryId)
      .single();

    if (inquiryError) {
      throw new Error(`Failed to fetch inquiry: ${inquiryError.message}`);
    }

    // Fetch inquiry services with service details
    const { data: inquiryServices, error: servicesError } = await supabase
      .from('customer_inquiry_services')
      .select(`
        *,
        services:service_id(name, description),
        sub_services:sub_service_id(name, description, price, unit)
      `)
      .eq('inquiry_id', inquiryId);

    if (servicesError) {
      throw new Error(`Failed to fetch services: ${servicesError.message}`);
    }

    // Create detailed prompt for AI proposal generation
    const servicesDescription = inquiryServices.map(service => {
      const serviceName = service.services?.name || 'Unknown Service';
      const subServiceName = service.sub_services?.name || 'Unknown Sub-service';
      const price = service.sub_services?.price || 0;
      const unit = service.sub_services?.unit || '';
      const quantity = service.quantity || 1;
      
      return `- ${serviceName}: ${subServiceName} (${quantity} ${unit}) - $${price * quantity}`;
    }).join('\n');

    const totalEstimate = inquiryServices.reduce((sum, service) => {
      return sum + ((service.sub_services?.price || 0) * (service.quantity || 1));
    }, 0);

    const prompt = `
Generate a comprehensive business proposal for East Digital based on the following customer inquiry:

Customer Information:
- Name: ${inquiry.name}
- Email: ${inquiry.email}
- Phone: ${inquiry.phone}
- Country: ${inquiry.country}
- Priority: ${inquiry.urgent ? 'Urgent' : 'Standard'}
${inquiry.message ? `- Message: ${inquiry.message}` : ''}

Selected Services:
${servicesDescription}

Total Estimated Value: $${totalEstimate}

Please create a professional proposal that includes:

1. **Executive Summary** - Brief overview of the project and East Digital's capabilities
2. **Project Understanding** - Detailed analysis of the client's requirements
3. **Proposed Solution** - Comprehensive breakdown of services and approach
4. **Timeline & Milestones** - Realistic project schedule with key deliverables
5. **Investment & ROI** - Detailed pricing breakdown and expected return on investment
6. **Why East Digital** - Company credentials, expertise, and unique value proposition
7. **Next Steps** - Clear action items and contact information

Make the proposal:
- Professional and persuasive
- Tailored to the specific services requested
- Include industry best practices
- Highlight East Digital's expertise in digital marketing, branding, 3D rendering, and development
- Be specific about deliverables and timelines
- Address the urgency if marked as urgent

Format the response as a well-structured HTML document that can be displayed in a web interface.
`;

    console.log('Generating AI proposal with OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional business proposal writer for East Digital, a leading digital agency specializing in branding, digital campaigns, 3D renderings, and walkthroughs. Create compelling, detailed proposals that win clients.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const proposalContent = data.choices[0].message.content;

    console.log('AI proposal generated successfully');

    // Update the inquiry with the generated proposal
    const { error: updateError } = await supabase
      .from('customer_inquiries')
      .update({ 
        total_amount: totalEstimate,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', inquiryId);

    if (updateError) {
      console.error('Error updating inquiry:', updateError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      proposal: proposalContent,
      totalAmount: totalEstimate 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-ai-proposal function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
