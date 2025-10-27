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
    const apiUrl = Deno.env.get('API_URL');
    const apiKey = Deno.env.get('API_KEY');

    if (!apiUrl || !apiKey) {
      throw new Error('API credentials not configured');
    }

    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    
    // Get flight code from request body if provided
    let flightIata = '';
    try {
      const body = await req.json();
      flightIata = body?.flight_iata || '';
    } catch {
      // No body or invalid JSON, continue without flight filter
    }
    
    // Build the API URL with parameters
    const aviationStackUrl = new URL(apiUrl);
    aviationStackUrl.searchParams.set('access_key', apiKey);
    
    // Add flight IATA if provided
    if (flightIata) {
      aviationStackUrl.searchParams.set('flight_iata', flightIata);
    }
    
    // Forward any additional query parameters
    params.forEach((value, key) => {
      if (key !== 'access_key') {
        aviationStackUrl.searchParams.set(key, value);
      }
    });

    console.log('Fetching flight data from AviationStack API');
    
    const response = await fetch(aviationStackUrl.toString());
    const data = await response.json();

    if (!response.ok) {
      console.error('AviationStack API error:', data);
      throw new Error(data.error?.info || 'Failed to fetch flight data');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-flights function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
