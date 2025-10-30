import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: Track requests per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60000; // 1 minute in milliseconds

// Allowed query parameters whitelist
const ALLOWED_PARAMS = ['flight_iata', 'airline_iata', 'dep_iata', 'arr_iata', 'limit'];
const MAX_PARAM_LENGTH = 50;

// Format validation patterns (IATA codes)
const FLIGHT_CODE_PATTERN = /^[A-Z0-9]{2}[0-9]{1,4}$/i;
const AIRLINE_CODE_PATTERN = /^[A-Z]{2}$/i;
const AIRPORT_CODE_PATTERN = /^[A-Z]{3}$/i;
const LIMIT_PATTERN = /^[0-9]+$/;

function validateParamFormat(key: string, value: string): boolean {
  switch(key) {
    case 'flight_iata':
      return FLIGHT_CODE_PATTERN.test(value);
    case 'airline_iata':
      return AIRLINE_CODE_PATTERN.test(value);
    case 'dep_iata':
    case 'arr_iata':
      return AIRPORT_CODE_PATTERN.test(value);
    case 'limit':
      return LIMIT_PATTERN.test(value) && parseInt(value) > 0 && parseInt(value) <= 100;
    default:
      return false;
  }
}

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting check
  const rateLimitKey = getRateLimitKey(req);
  if (!checkRateLimit(rateLimitKey)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
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
      
      // Validate flight_iata input
      if (flightIata) {
        if (flightIata.length > MAX_PARAM_LENGTH) {
          throw new Error('Flight code is too long');
        }
        if (!FLIGHT_CODE_PATTERN.test(flightIata)) {
          console.warn(`Invalid flight code format rejected: ${flightIata.substring(0, 10)}`);
          throw new Error('Invalid flight code format');
        }
      }
    } catch (error) {
      if (error instanceof Error && (error.message === 'Flight code is too long' || error.message === 'Invalid flight code format')) {
        throw error;
      }
      // No body or invalid JSON, continue without flight filter
    }
    
    // Build the API URL with parameters
    const aviationStackUrl = new URL(apiUrl);
    aviationStackUrl.searchParams.set('access_key', apiKey);
    
    // Add flight IATA if provided
    if (flightIata) {
      aviationStackUrl.searchParams.set('flight_iata', flightIata);
    }
    
    // Forward only whitelisted query parameters with validation
    params.forEach((value, key) => {
      if (ALLOWED_PARAMS.includes(key) && value.length <= MAX_PARAM_LENGTH) {
        if (validateParamFormat(key, value)) {
          aviationStackUrl.searchParams.set(key, value);
        } else {
          console.warn(`Invalid parameter format rejected: ${key}=${value.substring(0, 10)}`);
        }
      }
    });

    console.log('Fetching flight data from AviationStack API');
    
    const response = await fetch(aviationStackUrl.toString());
    const data = await response.json();

    if (!response.ok) {
      console.error('AviationStack API error:', data);
      throw new Error('Unable to fetch flight data');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-flights function:', error);
    return new Response(
      JSON.stringify({ error: 'Unable to process request' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
