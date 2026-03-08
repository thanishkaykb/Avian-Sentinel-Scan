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

    // Log key length for debugging (never log the actual key)
    console.log(`eBird API key length: ${EBIRD_API_KEY.length}, starts with: ${EBIRD_API_KEY.substring(0, 3)}...`);

    const { lat, lng, dist, maxResults } = await req.json();

    const url = `https://api.ebird.org/v2/data/obs/geo/recent?lat=${lat}&lng=${lng}&dist=${dist || 50}&maxResults=${maxResults || 30}&back=14`;
    
    console.log(`Fetching: ${url}`);

    const response = await fetch(url, {
      headers: { 'X-eBirdApiToken': EBIRD_API_KEY },
    });

    const text = await response.text();
    console.log(`eBird response status: ${response.status}, body length: ${text.length}`);

    if (!response.ok) {
      throw new Error(`eBird API error [${response.status}]: ${text.substring(0, 200)}`);
    }

    const data = JSON.parse(text);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Edge function error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
