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
    const { lat, lng, radius, perPage } = await req.json();

    const params = new URLSearchParams({
      lat: String(lat || 13.08),
      lng: String(lng || 80.27),
      radius: String(radius || 50),
      iconic_taxa: 'Aves',
      per_page: String(perPage || 20),
      order: 'desc',
      order_by: 'observed_on',
      quality_grade: 'research',
    });

    const url = `https://api.inaturalist.org/v1/observations?${params}`;
    console.log(`Fetching: ${url}`);

    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      throw new Error(`iNaturalist API error [${response.status}]: ${text.substring(0, 200)}`);
    }

    const raw = JSON.parse(text);

    // Map to a simpler format
    const observations = (raw.results || []).map((obs: any) => ({
      id: obs.id,
      comName: obs.taxon?.preferred_common_name || obs.species_guess || 'Unknown',
      sciName: obs.taxon?.name || '',
      locName: obs.place_guess || 'Unknown location',
      lat: obs.geojson?.coordinates?.[1] ?? lat,
      lng: obs.geojson?.coordinates?.[0] ?? lng,
      obsDt: obs.observed_on || '',
      howMany: obs.taxon?.observations_count,
      photoUrl: obs.photos?.[0]?.url?.replace('square', 'small') || null,
    }));

    return new Response(JSON.stringify(observations), {
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
