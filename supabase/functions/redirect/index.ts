import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const shortCode = url.pathname.slice(1); // Remove leading slash

    if (!shortCode) {
      return new Response('Short code is required', { status: 400 });
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get link data
    const { data: link, error } = await supabase
      .from('links')
      .select('*')
      .eq('short_code', shortCode)
      .eq('is_active', true)
      .single();

    if (error || !link) {
      return new Response('Link not found', { status: 404 });
    }

    // Check if link has expired
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return new Response('Link has expired', { status: 410 });
    }

    // Get client info for analytics
    const userAgent = req.headers.get('user-agent') || '';
    const referer = req.headers.get('referer') || '';
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';

    // Parse user agent for device/browser info
    const deviceInfo = parseUserAgent(userAgent);
    
    // Get geolocation (basic implementation)
    let geoInfo = { country: '', city: '' };
    try {
      if (clientIP) {
        // You can integrate with IP geolocation services here
        // For now, we'll just use a placeholder
        geoInfo = await getGeolocation(clientIP);
      }
    } catch (error) {
      console.error('Geolocation error:', error);
    }

    // Record click analytics
    await supabase.from('clicks').insert({
      link_id: link.id,
      ip_address: clientIP || null,
      country: geoInfo.country || null,
      city: geoInfo.city || null,
      device: deviceInfo.device || null,
      browser: deviceInfo.browser || null,
      os: deviceInfo.os || null,
      referrer: referer || null,
    });

    // Update click count
    await supabase
      .from('links')
      .update({ clicks: (link.clicks || 0) + 1 })
      .eq('id', link.id);

    // Check if password protected
    if (link.password) {
      const providedPassword = url.searchParams.get('password');
      if (providedPassword !== link.password) {
        // Return password form HTML
        return new Response(getPasswordForm(shortCode), {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'text/html' 
          },
        });
      }
    }

    // Redirect to original URL
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': link.original_url,
      },
    });

  } catch (error) {
    console.error('Redirect error:', error);
    return new Response('Internal server error', { status: 500 });
  }
});

function parseUserAgent(userAgent: string) {
  const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'Mobile' : 'Desktop';
  
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';

  let os = 'Unknown';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';

  return { device, browser, os };
}

async function getGeolocation(ip: string) {
  // Placeholder for geolocation service
  // You can integrate with services like ipapi.co, ipgeolocation.io, etc.
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    return {
      country: data.country_name || '',
      city: data.city || ''
    };
  } catch {
    return { country: '', city: '' };
  }
}

function getPasswordForm(shortCode: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Link Protegido - Abrev.io</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background: #0F0F23;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
        }
        .container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 2rem;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        .logo {
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          margin: 1rem 0;
          box-sizing: border-box;
        }
        button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Abrev.io</div>
        <h2>Link Protegido</h2>
        <p>Este link requer uma senha para acessar.</p>
        <form method="get">
          <input type="password" name="password" placeholder="Digite a senha" required>
          <button type="submit">Acessar Link</button>
        </form>
      </div>
    </body>
    </html>
  `;
}