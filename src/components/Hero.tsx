import { Plane, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flight } from "@/hooks/useFlightData";

const Hero = () => {
  const [flightCode, setFlightCode] = useState("");
  const [flightData, setFlightData] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackFlight = async () => {
    if (!flightCode.trim()) {
      setError("Please enter a flight code!");
      return;
    }

    setLoading(true);
    setError("");
    setFlightData(null);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke("fetch-flights", {
        body: { flight_iata: flightCode.trim() },
      });

      if (fetchError) throw fetchError;

      if (data?.data && data.data.length > 0) {
        setFlightData(data.data[0]);
      } else {
        setError("No data found for this flight code.");
      }
    } catch (err) {
      setError("Error fetching flight data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[40vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-10 animate-pulse" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Plane className="w-12 h-12 text-primary animate-bounce" />
          <h1 className="text-5xl md:text-7xl font-bold text-glow">
            SkyTrack Live
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Track flights in real-time across the globe with live data, paths, and airline information
        </p>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="flex gap-2 p-2 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
            <Input
              placeholder="Enter flight number or airline (e.g., AA123, Delta)"
              className="flex-1 bg-background/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              value={flightCode}
              onChange={(e) => setFlightCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrackFlight()}
            />
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
              onClick={handleTrackFlight}
              disabled={loading}
            >
              <Search className="w-5 h-5 mr-2" />
              {loading ? "Tracking..." : "Track Flight"}
            </Button>
          </div>
        </div>

        {/* Flight Results */}
        {error && (
          <div className="max-w-2xl mx-auto mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {flightData && (
          <div className="max-w-2xl mx-auto mt-4 p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">
              {flightData.airline.name} ({flightData.flight.iata})
            </h3>
            <div className="space-y-2 text-left">
              <p>
                <span className="font-semibold">From:</span> {flightData.departure.airport} ({flightData.departure.iata})
              </p>
              <p>
                <span className="font-semibold">To:</span> {flightData.arrival.airport} ({flightData.arrival.iata})
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className={
                  flightData.flight_status === "active" ? "text-green-500" :
                  flightData.flight_status === "scheduled" ? "text-blue-500" :
                  "text-yellow-500"
                }>
                  {flightData.flight_status}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Live Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Real-time Updates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Global Coverage</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
