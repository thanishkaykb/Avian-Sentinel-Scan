import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const EBIRD_API_KEY = Deno.env.get('EBIRD_API_KEY');
    if (!EBIRD_API_KEY) {
      throw new Error('EBIRD_API_KEY is not configured');
    }

    const { lat, lng, dist, maxResults } = await req.json();

    const params = new URLSearchParams({
      lat: String(lat || 13.08),
      lng: String(lng || 80.27),
      dist: String(dist || 50),
      maxResults: String(maxResults || 30),
      back: '14',
    });

    const response = await fetch(
      `https://api.ebird.org/v2/data/obs/geo/recent?${params}`,
      { headers: { 'X-eBirdApiToken': EBIRD_API_KEY } }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`eBird API error [${response.status}]: ${text}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
